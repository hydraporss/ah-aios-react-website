"""AH-IMG-INTEGRATION-001 — Full image-render workflow orchestrator.

Integrates:
  - PromptBibleRenderInput: strictly validated input contract
  - OpenAIImageRenderer: provider adapter (OpenAI `gpt-image-1`)
  - ImageRenderAuditRecord: typed, immutable per-attempt audit

Pipeline:
    validated input → provider request → image persistence → read-back
    → SHA-256 validation → immutable per-attempt audit record

Every step is keyed by attempt_number and generation_id.  Completed audit
records are immutable; corrections are appended as linked records or events
(discussed in the IMPROVEMENT section of the directive).
"""

from __future__ import annotations

import hashlib
import time
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from .audit_pb import (
    ImageRenderAuditRecord,
    canonicalize,
    audit_full_sha256,
)
from .openai_adapter import OpenAIImageRenderer
from .prompt_bible import (
    PROMPT_BIBLE_RENDER_INPUT_SCHEMA,
    canonicalize_input,
    input_sha256,
    prompt_text_sha256,
)
from .validation import SchemaValidator

# ---------------------------------------------------------------------------
# Re-export for convenience
# ---------------------------------------------------------------------------

__all__ = [
    "ImageRenderWorkflow",
    "ImageRenderWorkflowResult",
]


class ImageRenderWorkflowResult:
    """Result of a single complete render workflow."""

    def __init__(
        self,
        audit_record: ImageRenderAuditRecord,
        image_path: str | None = None,
        storage_uri: str | None = None,
        bytes_written: int = 0,
        sha256: str | None = None,
    ):
        self.audit_record = audit_record
        self.image_path = image_path
        self.storage_uri = storage_uri
        self.bytes_written = bytes_written
        self.sha256 = sha256

    @property
    def sorted_model(self) -> dict[str, Any]:
        return self.audit_record.model_dump(mode="json")


# ---------------------------------------------------------------------------
# The workflow
# ---------------------------------------------------------------------------

class ImageRenderWorkflow:
    """
    Validates Prompt Bible input, requests the provider, persists the
    image, verifies bytes, and writes an immutable audit record.
    """

    def __init__(
        self,
        renderer: OpenAIImageRenderer | None = None,
        *,
        storage_dir: str | None = None,
        skip_provider: bool = False,
    ):
        self._renderer = renderer
        if self._renderer is None:
            self._renderer = OpenAIImageRenderer(storage_dir=storage_dir)
        self.skip_provider = skip_provider  # for offline/deterministic tests

        # Counter for deterministic test tracing
        self._attempt_counter = 0

    @property
    def renderer(self) -> OpenAIImageRenderer:
        return self._renderer

    def run(self, raw_input: dict[str, Any]) -> ImageRenderWorkflowResult:
        """
        Full pipeline: validate → request → persist → read-back verify →
        hash → audit.  Returns the workflow result.
        """
        if self.skip_provider:
            return self._dry_run(raw_input)

        # Phase 1: Strict schema validation
        validator = SchemaValidator(PROMPT_BIBLE_RENDER_INPUT_SCHEMA)
        validator.validate(raw_input)
        record = self._to_prompt_bible(record=raw_input)

        # Compute deterministic hashes
        input_sha = input_sha256(record.normalize().model_dump(mode="json"))
        prompt_text_sha = prompt_text_sha256(record.prompt_text)
        correlation_id = f"corr-{int(time.time() * 1000)}-{uuid4().hex[:8]}"
        generation_id = f"PB-{record.prompt_id[:8]}-{input_sha[:8]}"

        started_at = datetime.now(timezone.utc).isoformat()
        self._attempt_counter += 1

        # Phase 2: Provider request with retries
        attempt_number = 1
        image_bytes = None
        request_id = None
        attempt_error = None

        for attempt in range(1, self._renderer.max_retries + 1):
            attempt_number = attempt
            try:
                image_bytes, request_id = self._renderer._call_provider(
                    self._renderer._build_provider_payload(record)
                )
                break
            except Exception as exc:  # noqa: BLE001
                attempt_error = exc
                if attempt == self._renderer.max_retries:
                    break
                time.sleep(1.0 * (self._renderer.backoff_factor ** (attempt - 1)))

        if image_bytes is None:
            audit = self._build_audit_record(
                record=record,
                input_sha=input_sha,
                prompt_text_sha=prompt_text_sha,
                generation_id=generation_id,
                correlation_id=correlation_id,
                started_at=started_at,
                attempt_number=attempt_number,
                status="FAILED",
                error=self._renderer._sanitize_error(attempt_error),
            )
            return ImageRenderWorkflowResult(
                audit_record=ImageRenderAuditRecord.model_validate(audit),
            )

        # Phase 3: Persist image
        storage_uri, image_path, audit = self._renderer._persist_image(
            image_bytes,
            generation_id,
            started_at,
            record,
            input_sha,
            prompt_text_sha,
            request_id,
        )
        if audit["status"] != "SUCCEEDED":
            return ImageRenderWorkflowResult(
                audit_record=ImageRenderAuditRecord.model_validate(audit),
                image_path=str(image_path) if image_path else None,
                storage_uri=storage_uri,
            )

        # Phase 4: Read-back verification & checksum
        verification = self._renderer._verify_image(image_path, None)
        audit["verification"] = verification
        audit["result"]["sha256"] = verification.get("sha256") or audit["result"].get("sha256", "")

        if verification.get("checksum_match") and verification.get("storage_retrieval_passed"):
            audit["status"] = "SUCCEEDED"
        else:
            audit["status"] = "FAILED"
            audit["error"] = "Image verification failed: "
            + (
                "checksum mismatch" if not verification.get("checksum_match") else "read-back failed"
            )

        # Phase 5: Immutable audit record
        audit["created_at"] = datetime.now(timezone.utc).isoformat()

        return ImageRenderWorkflowResult(
            audit_record=ImageRenderAuditRecord.model_validate(audit),
            image_path=str(image_path),
            storage_uri=storage_uri,
            bytes_written=image_path.stat().st_size if image_path.exists() else 0,
            sha256=verification.get("sha256"),
        )

    def _dry_run(self, raw_input: dict[str, Any]) -> ImageRenderWorkflowResult:
        """Deterministic offline path for testing without a provider."""
        validator = SchemaValidator(PROMPT_BIBLE_RENDER_INPUT_SCHEMA)
        validator.validate(raw_input)
        record = self._to_prompt_bible(record=raw_input)

        input_sha = input_sha256(record.normalize().model_dump(mode="json"))
        prompt_text_sha = prompt_text_sha256(record.prompt_text)
        correlation_id = f"corr-{int(time.time() * 1000)}-{uuid4().hex[:8]}"
        generation_id = f"PB-{record.prompt_id[:8]}-{input_sha[:8]}"

        started_at = datetime.now(timezone.utc).isoformat()
        self._attempt_counter += 1

        # Build a synthetic successful result for offline verification
        import tempfile

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            # Minimal valid PNG (1x1 pixel)
            f.write(self._synthetic_png_1x1())
            temp_path = f.name

        audit = self._build_audit_record(
            record=record,
            input_sha=input_sha,
            prompt_text_sha=prompt_text_sha,
            generation_id=generation_id,
            correlation_id=correlation_id,
            started_at=started_at,
            attempt_number=1,
            status="SUCCEEDED",
        )

        # Compute verification on the synthetic file
        with open(temp_path, "rb") as fh:
            data = fh.read()
        sha = hashlib.sha256(data).hexdigest()

        verification = {
            "status": "PASSED",
            "response_decoded": True,
            "image_readable": True,
            "dimensions_valid": True,
            "storage_retrieval_passed": True,
            "checksum_match": True,
            "verified_at": datetime.now(timezone.utc).isoformat(),
            "sha256": sha,
        }

        audit["verification"] = verification
        audit["result"]["sha256"] = sha
        audit["result"]["size_bytes"] = len(data)
        audit["result"]["mime_type"] = "image/png"
        audit["result"]["width"] = 1
        audit["result"]["height"] = 1
        audit["status"] = "SUCCEEDED"

        return ImageRenderWorkflowResult(
            audit_record=ImageRenderAuditRecord.model_validate(audit),
            image_path=temp_path,
            storage_uri=temp_path,
            bytes_written=len(data),
            sha256=sha,
        )

    @staticmethod
    def _synthetic_png_1x1() -> bytes:
        """Return a minimal valid 1x1 PNG byte string."""
        return (
            b"\x89PNG\r\n\x1a\n"
            b"\x00\x00\x00\rIHDR"
            b"\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde"
            b"\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0\x00\x00\x01\x01\x00\x05\x00\x01"
            b"\x00\x00\x00\x00IEND\xaeB`\x82"
        )

    def _build_audit_record(
        self,
        record: "PromptBibleRenderInput",
        input_sha: str,
        prompt_text_sha: str,
        generation_id: str,
        correlation_id: str,
        started_at: str,
        attempt_number: int,
        status: str,
        error: str | None = None,
    ) -> dict:
        import uuid

        now = datetime.now(timezone.utc).isoformat()
        audit = {
            "schema_version": "1.0.0",
            "audit_id": f"audit-{uuid.uuid4().hex[:12]}",
            "generation_id": generation_id,
            "attempt_number": attempt_number,
            "status": status,
            "prompt": {
                "prompt_id": record.prompt_id,
                "prompt_version": record.prompt_version,
                "input_sha256": input_sha,
                "prompt_text_sha256": prompt_text_sha,
                "canon_references": record.canon_references,
                "source_references": record.source_references,
            },
            "provider": {
                "name": "openai",
                "model": self._renderer.model,
                "request_id": None,
            },
            "request": {
                "width": record.render_options.get("width", 1024),
                "height": record.render_options.get("height", 1024),
                "quality": record.render_options.get("quality", "high"),
                "output_format": record.render_options.get("output_format", "png"),
            },
            "timing": {
                "started_at": started_at,
                "completed_at": now,
                "duration_ms": 0,
            },
            "result": {},  # filled by caller after verification (must NOT be None)
            "verification": {
                "status": "NOT_APPLICABLE",
                "response_decoded": False,
                "image_readable": False,
                "dimensions_valid": False,
                "storage_retrieval_passed": False,
                "checksum_match": False,
                "verified_at": None,
            },
            "error": error,
            "correlation_id": correlation_id,
            "created_at": now,
        }
        return audit

    @staticmethod
    def _to_prompt_bible(record: dict[str, Any]) -> "PromptBibleRenderInput":
        from .prompt_bible import PromptBibleRenderInput

        return PromptBibleRenderInput.model_validate(record)
