"""AH-IMG-INTEGRATION-001 — Image render audit record schema (JSON Schema, draft 2020-12).

Defines the exact audit-record contract for every rendering attempt.
Implements `ImageRenderAuditRecord` with formal JSON Schema, typed Python
models, strict validation, deterministic hashing, and immutable history
semantics.

Enumerations:
  - attempt_status: STARTED | SUCCEEDED | FAILED | TIMED_OUT | CANCELLED
  - verification_status: PENDING | PASSED | FAILED | NOT_APPLICABLE

Invariants:
  - Every attempt has a unique `audit_id`; retries share `generation_id`
    and increment `attempt_number`.
  - A successful render requires a valid result object.
  - Failed attempts retain their error details and must not claim
    successful verification.
  - `verification.status = PASSED` requires every mandatory verification
    check to pass.
  - Image SHA-256 is computed from actual persisted bytes and verified
    after reading back.
  - Completed audit records are immutable history.  Corrections are
    appended as linked records or events.
  - Never store API keys, authorizations, or secrets in inputs,
    audit records, or logs.
  - Prompt hashes correspond to a documented canonicalization algorithm
    (see `prompt_bible.canonicalize_input`).
"""  # noqa: D200

import json
import hashlib
from typing import Any

# ---------------------------------------------------------------------------
# Canonical JSON serialization (mirrors prompt_bible.canonicalize_input)
# ---------------------------------------------------------------------------

def canonicalize(obj: dict[str, Any]) -> str:
    """Return a deterministic canonical JSON string of a dict."""
    return json_dumps_sorted(obj, sort_keys=True, separators=(",", ":"))


def audit_full_sha256(rec: dict[str, Any]) -> str:
    """Return the SHA-256 hex digest of the canonicalized full record."""
    return sha256_hex(canonicalize(rec).encode("utf-8"))


def json_dumps_sorted(obj: Any, sort_keys: bool = True, **kwargs: Any) -> str:
    """json.dumps that sorts keys and uses compact separators."""
    kwargs.setdefault("sort_keys", sort_keys)
    kwargs.setdefault("separators", (",", ":"))
    return json.dumps(obj, **kwargs)


def sha256_hex(data: bytes) -> str:
    """Return the SHA-256 hex digest of *data*."""
    return hashlib.sha256(data).hexdigest()


# ---------------------------------------------------------------------------
# JSON Schema fragments
# ---------------------------------------------------------------------------

ATTEMPT_STATUS_ENUM = ["STARTED", "SUCCEEDED", "FAILED", "TIMED_OUT", "CANCELLED"]

VERIFICATION_STATUS_ENUM = ["PENDING", "PASSED", "FAILED", "NOT_APPLICABLE"]

# Request sub-record (provider-translated parameters only)
AUDIT_REQUEST_OBJECT = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "ImageRenderAuditRequest",
    "type": "object",
    "additionalProperties": False,
    "required": ["width", "height", "quality", "output_format"],
    "properties": {
        "width": {"type": "integer", "minimum": 64, "maximum": 2048},
        "height": {"type": "integer", "minimum": 64, "maximum": 2048},
        "quality": {
            "type": "string",
            "enum": ["low", "medium", "high", "hd"],
        },
        "output_format": {
            "type": "string",
            "enum": ["png", "jpeg", "webp"],
        },
    },
    "unevaluatedProperties": False,
}

# Result sub-record
AUDIT_RESULT_OBJECT = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "ImageRenderAuditResult",
    "type": "object",
    "additionalProperties": False,
    "required": [
        "image_id",
        "storage_uri",
        "mime_type",
        "size_bytes",
        "sha256",
        "width",
        "height",
    ],
    "properties": {
        "image_id": {
            "type": "string",
            "pattern": "^[A-Za-z0-9_\\-]{1,128}$",
        },
        "storage_uri": {
            "type": "string",
            "minLength": 1,
            "description": "Approved storage reference.",
        },
        "mime_type": {
            "type": "string",
            "enum": ["image/png", "image/jpeg", "image/webp", "image/gif"],
        },
        "size_bytes": {
            "type": "integer",
            "minimum": 0,
        },
        "sha256": {
            "type": "string",
            "pattern": "^[a-fA-F0-9]{64}$",
        },
        "width": {"type": "integer", "minimum": 1},
        "height": {"type": "integer", "minimum": 1},
    },
    "unevaluatedProperties": False,
}

# Verification sub-record
AUDIT_VERIFICATION_OBJECT = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "ImageRenderAuditVerification",
    "type": "object",
    "additionalProperties": False,
    "required": [
        "status",
        "response_decoded",
        "image_readable",
        "dimensions_valid",
        "storage_retrieval_passed",
        "checksum_match",
        "verified_at",
    ],
    "properties": {
        "status": {
            "type": "string",
            "enum": VERIFICATION_STATUS_ENUM,
        },
        "response_decoded": {"type": "boolean"},
        "image_readable": {"type": "boolean"},
        "dimensions_valid": {"type": "boolean"},
        "storage_retrieval_passed": {"type": "boolean"},
        "checksum_match": {"type": "boolean"},
        "verified_at": {
            "type": "string",
            "format": "date-time",
            "description": "ISO-8601 UTC timestamp.",
        },
    },
    "unevaluatedProperties": False,
}

# Prompt sub-record
AUDIT_PROMPT_OBJECT = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "ImageRenderAuditPrompt",
    "type": "object",
    "additionalProperties": False,
    "required": [
        "prompt_id",
        "prompt_version",
        "input_sha256",
        "prompt_text_sha256",
        "canon_references",
        "source_references",
    ],
    "properties": {
        "prompt_id": {"type": "string"},
        "prompt_version": {"type": "string"},
        "input_sha256": {
            "type": "string",
            "pattern": "^[a-fA-F0-9]{64}$",
            "description": "SHA-256 of canonicalized full input.",
        },
        "prompt_text_sha256": {
            "type": "string",
            "pattern": "^[a-fA-F0-9]{64}$",
            "description": "SHA-256 of canonicalized prompt text.",
        },
        "canon_references": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 0,
            "uniqueItems": True,
        },
        "source_references": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 0,
            "uniqueItems": True,
        },
    },
    "unevaluatedProperties": False,
}

# Provider sub-record
AUDIT_PROVIDER_OBJECT = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "ImageRenderAuditProvider",
    "type": "object",
    "additionalProperties": False,
    "required": ["name", "model"],
    "properties": {
        "name": {
            "type": "string",
            "enum": ["openai"],
            "description": "Provider name (as actually used).",
        },
        "model": {
            "type": "string",
            "enum": ["gpt-image-1"],
            "description": "Model actually used for this attempt.",
        },
        "request_id": {
            "type": ["string", "null"],
            "description": "Provider request id, if any.",
        },
    },
    "unevaluatedProperties": False,
}

# Top-level audit record
IMAGE_RENDER_AUDIT_RECORD_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "ImageRenderAuditRecord",
    "description": (
        "Exact audit-record contract for every Prompt Bible image-rendering attempt. "
        "Versioned, strict, and immutable per release."
    ),
    "type": "object",
    "additionalProperties": False,
    "required": [
        "schema_version",
        "audit_id",
        "generation_id",
        "attempt_number",
        "status",
        "prompt",
        "provider",
        "request",
        "timing",
        "result",
        "verification",
        "error",
        "correlation_id",
        "created_at",
    ],
    "properties": {
        "schema_version": {
            "type": "string",
            "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$",
        },
        "audit_id": {
            "type": "string",
            "pattern": "^[A-Za-z0-9_\\-]{1,128}$",
            "description": "Unique identifier for this attempt.",
        },
        "generation_id": {
            "type": "string",
            "pattern": "^[A-Za-z0-9_\\-]{1,128}$",
            "description": "Generation identifier shared across retries.",
        },
        "attempt_number": {
            "type": "integer",
            "minimum": 1,
            "description": "Attempt number (1 for first try).",
        },
        "status": {
            "type": "string",
            "enum": ATTEMPT_STATUS_ENUM,
            "description": "Attempt status.",
        },
        "prompt": AUDIT_PROMPT_OBJECT,
        "provider": AUDIT_PROVIDER_OBJECT,
        "request": AUDIT_REQUEST_OBJECT,
        "timing": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "title": "ImageRenderAuditTiming",
            "type": "object",
            "additionalProperties": False,
            "required": ["started_at", "completed_at", "duration_ms"],
            "properties": {
                "started_at": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO-8601 UTC timestamp when started.",
                },
                "completed_at": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO-8601 UTC timestamp when completed.",
                },
                "duration_ms": {
                    "type": "integer",
                    "minimum": 0,
                    "description": "Elapsed wall-clock time in milliseconds.",
                },
            },
            "unevaluatedProperties": False,
        },
        "result": AUDIT_RESULT_OBJECT,
        "verification": AUDIT_VERIFICATION_OBJECT,
        "error": {
            "type": ["string", "null"],
            "description": "Sanitized error message, null when none.",
        },
        "correlation_id": {
            "type": "string",
            "pattern": "^[A-Za-z0-9_\\-]{1,128}$",
        },
        "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "ISO-8601 UTC timestamp when the record was created.",
        },
    },
    "unevaluatedProperties": False,
}

# Public alias for consumers that import by the class name
ImageRenderAuditSchema = IMAGE_RENDER_AUDIT_RECORD_SCHEMA

# ---------------------------------------------------------------------------
# Typed Python models (pydantic v2)
# ---------------------------------------------------------------------------

from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional


class ImageRenderAuditRecord(BaseModel):
    """Typed model for a validated image-render audit record."""

    schema_version: str = Field(
        ..., pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$", description="Schema version"
    )
    audit_id: str = Field(..., description="Unique attempt identifier")
    generation_id: str = Field(..., description="Shared generation identifier")
    attempt_number: int = Field(..., ge=1, description="Attempt number")
    status: str = Field(..., pattern=r"^(STARTED|SUCCEEDED|FAILED|TIMED_OUT|CANCELLED)$")
    prompt: dict[str, Any] = Field(..., description="Prompt sub-record")
    provider: dict[str, Any] = Field(..., description="Provider sub-record")
    request: dict[str, Any] = Field(..., description="Request sub-record")
    timing: dict[str, Any] = Field(..., description="Timing sub-record")
    result: dict[str, Any] = Field(..., description="Result sub-record")
    verification: dict[str, Any] = Field(..., description="Verification sub-record")
    error: Optional[str] = Field(None, description="Sanitized error or null")
    correlation_id: str = Field(..., description="Correlation identifier")
    created_at: str = Field(..., description="ISO-8601 UTC creation timestamp")

    model_config = {"extra": "forbid", "frozen": True}

    @field_validator("error", mode="before")
    @classmethod
    def strip_secret_from_error(cls, v):
        """Redact secrets from error strings."""
        if v is None:
            return None
        redacted = str(v)
        # Remove any potential secret patterns
        import re

        redacted = re.sub(r"(?i)api[_-]?key\s*[=:]\s*['\"]", "", redacted)
        redacted = re.sub(r"Bearer\s+\S+", "Bearer ***REDACTED***", redacted)
        return redacted

    @property
    def canonical_json(self) -> str:
        return canonicalize(self.model_dump(mode="json"))

    @property
    def audit_full_sha256(self) -> str:
        return audit_full_sha256(self.model_dump(mode="json"))
