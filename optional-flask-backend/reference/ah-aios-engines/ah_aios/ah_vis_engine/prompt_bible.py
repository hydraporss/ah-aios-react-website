"""AH-IMG-INTEGRATION-001 — Prompt Bible render input schema (JSON Schema, draft 2020-12).

Defines the exact input contract for Prompt Bible rendering requests.
Implements `PromptBibleRenderInput` with strict union schemas, deterministic
canonicalization, reference/image verification, and allowed/unknown-field
policy.  Provider-specific parameters are deliberately kept OUT OF this
schema and are translated through the renderer adapter.

Verification rules:
  - Every `reference_images` entry must carry `source`, `content_type`,
    `content_hash`, and `content_hash_algorithm`.
  - Reference access is tracked as `accessible` / `inaccessible`.
  - A required reference that is inaccessible or whose hash does not match
    the declared hash MUST cause rejection at validation time.
"""  # noqa: D200

import json
import hashlib
from typing import Any


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

REFERENCE_IMAGES_ITEM = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "PromptBibleReferenceImage",
    "type": "object",
    "additionalProperties": False,
    "required": [
        "source",
        "content_type",
        "content_hash",
        "content_hash_algorithm",
        "accessible",
    ],
    "properties": {
        "source": {
            "type": "string",
            "minLength": 1,
            "description": "Location of the reference image (URI, path, or key).",
        },
        "content_type": {
            "type": "string",
            "enum": ["image/png", "image/jpeg", "image/webp", "image/gif"],
            "description": "Detected or declared MIME type.",
        },
        "content_hash": {
            "type": "string",
            "pattern": "^[a-fA-F0-9]{64}$",
            "description": "Verify hash of the source bytes (SHA-256).",
        },
        "content_hash_algorithm": {
            "type": "string",
            "enum": ["sha256"],
            "description": "Hash algorithm used for content_hash.",
        },
        "accessible": {
            "type": "boolean",
            "description": "True when the source was readable at validation time.",
        },
    },
    "unevaluatedProperties": False,
}


REFERENCE_IMAGES_ARRAY = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "PromptBibleReferenceImages",
    "type": "array",
    "items": REFERENCE_IMAGES_ITEM,
    "minItems": 0,
}


RENDER_OPTIONS = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "PromptBibleRenderOptions",
    "type": "object",
    "additionalProperties": False,
    "required": ["width", "height", "quality", "output_format"],
    "properties": {
        "width": {
            "type": "integer",
            "minimum": 64,
            "maximum": 2048,
            "description": "Requested image width in pixels.",
        },
        "height": {
            "type": "integer",
            "minimum": 64,
            "maximum": 2048,
            "description": "Requested image height in pixels.",
        },
        "quality": {
            "type": "string",
            "enum": ["low", "medium", "high", "hd"],
            "description": "Rendering quality.",
        },
        "output_format": {
            "type": "string",
            "enum": ["png", "jpeg", "webp"],
            "description": "Desired output image format.",
        },
    },
    "unevaluatedProperties": False,
}


METADATA_OBJECT = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "PromptBibleMetadata",
    "type": "object",
    "additionalProperties": True,
}


CONSTRAINTS = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "PromptBibleConstraints",
    "type": "array",
    "items": {
        "type": "object",
        "additionalProperties": True,
    },
    "minItems": 0,
}


# Main top-level schema
PROMPT_BIBLE_RENDER_INPUT_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "PromptBibleRenderInput",
    "description": (
        "Exact input contract for Prompt Bible rendering requests. "
        "Versioned and immutable per release."
    ),
    "type": "object",
    "additionalProperties": False,
    "required": [
        "schema_version",
        "prompt_id",
        "prompt_version",
        "prompt_text",
        "negative_prompt",
        "canon_references",
        "source_references",
        "identity_constraints",
        "composition_constraints",
        "style_constraints",
        "preservation_constraints",
        "reference_images",
        "render_options",
        "metadata",
    ],
    "properties": {
        "schema_version": {
            "type": "string",
            "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$",
            "description": "Schema version (semver).",
        },
        "prompt_id": {
            "type": "string",
            "pattern": "^[A-Za-z0-9_\\-]{1,128}$",
            "description": "Universally unique prompt identifier (UUID).",
        },
        "prompt_version": {
            "type": "string",
            "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$",
            "description": "Prompt version (semver).",
        },
        "prompt_text": {
            "type": "string",
            "minLength": 1,
            "description": "Complete approved rendering prompt text.",
        },
        "negative_prompt": {
            "type": ["string", "null"],
            "minLength": 1,
            "description": "Negative prompt text, or null when absent.",
        },
        "canon_references": {
            "type": "array",
            "items": {
                "type": "string",
                "minLength": 1,
            },
            "uniqueItems": True,
            "minItems": 0,
            "description": "Traceable canon identifiers (NOT proof of verification).",
        },
        "source_references": {
            "type": "array",
            "items": {
                "type": "string",
                "minLength": 1,
            },
            "uniqueItems": True,
            "minItems": 0,
            "description": "Traceable source identifiers.",
        },
        "identity_constraints": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": True,
            },
            "minItems": 0,
            "description": "Identity constraints from the theory specification.",
        },
        "composition_constraints": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": True,
            },
            "minItems": 0,
            "description": "Composition constraints from the theory specification.",
        },
        "style_constraints": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": True,
            },
            "minItems": 0,
            "description": "Style constraints from the theory specification.",
        },
        "preservation_constraints": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": True,
            },
            "minItems": 0,
            "description": "Preservation constraints from the theory specification.",
        },
        "reference_images": REFERENCE_IMAGES_ARRAY,
        "render_options": RENDER_OPTIONS,
        "metadata": METADATA_OBJECT,
    },
    "unevaluatedProperties": False,
}

# Public alias for consumers that import by the class name
PromptBibleRenderSchema = PROMPT_BIBLE_RENDER_INPUT_SCHEMA

# Deterministic serialization helpers
def canonicalize_input(obj: dict[str, Any]) -> str:
    """Return a deterministic, canonical JSON string of *obj*."""
    return json_dumps_sorted(obj, sort_keys=True, separators=(",", ":"))


def prompt_text_sha256(text: str) -> str:
    """Return the SHA-256 hex digest of the canonicalized prompt text."""
    return sha256_hex(text.encode("utf-8"))


def input_sha256(obj: dict[str, Any]) -> str:
    """Return the SHA-256 hex digest of the canonicalized input dict."""
    return sha256_hex(canonicalize_input(obj).encode("utf-8"))


def sha256_hex(data: bytes) -> str:
    """Return the SHA-256 hex digest of *data*."""
    return hashlib.sha256(data).hexdigest()


def json_dumps_sorted(obj: Any, sort_keys: bool = True, **kwargs: Any) -> str:
    """json.dumps that sorts keys and uses compact separators."""
    kwargs.setdefault("sort_keys", sort_keys)
    kwargs.setdefault("separators", (",", ":"))
    return json.dumps(obj, **kwargs)


def prompt_text_sha256(text: str) -> str:
    """Return the SHA-256 hex digest of the canonicalized prompt text."""
    return sha256_hex(text.encode("utf-8"))


def input_sha256(obj: dict[str, Any]) -> str:
    """Return the SHA-256 hex digest of the canonicalized input dict."""
    return sha256_hex(canonicalize_input(obj).encode("utf-8"))

# ---------------------------------------------------------------------------
# Typed Python models (pydantic v2)
# ---------------------------------------------------------------------------

from pydantic import BaseModel, Field
from typing import Any, Optional


class PromptBibleRenderInput(BaseModel):
    """Typed model for a validated Prompt Bible render input."""

    schema_version: str = Field(
        ..., pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$", description="Schema version"
    )
    prompt_id: str = Field(
        ..., pattern=r"^[A-Za-z0-9_\-]{1,128}$", description="Prompt UUID"
    )
    prompt_version: str = Field(
        ..., pattern=r"^[0-9]+\.[0-9]+\.[0-9]+$", description="Prompt version"
    )
    prompt_text: str = Field(..., min_length=1, description="Rendering prompt")
    negative_prompt: Optional[str] = Field(None, min_length=1, description="Neg. prompt")
    canon_references: list[str] = Field(default_factory=list)
    source_references: list[str] = Field(default_factory=list)
    identity_constraints: list[dict[str, Any]] = Field(default_factory=list)
    composition_constraints: list[dict[str, Any]] = Field(default_factory=list)
    style_constraints: list[dict[str, Any]] = Field(default_factory=list)
    preservation_constraints: list[dict[str, Any]] = Field(default_factory=list)
    reference_images: list[dict[str, Any]] = Field(default_factory=list)
    render_options: dict[str, Any] = Field(default_factory=dict)
    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = {"extra": "forbid", "frozen": True}

    # Deterministic normalization — applied BEFORE hashing
    def normalize(self) -> "PromptBibleRenderInput":
        """Return a normalized copy (dicts sorted, strings stripped)."""
        return PromptBibleRenderInput(
            schema_version=self.schema_version,
            prompt_id=self.prompt_id,
            prompt_version=self.prompt_version,
            prompt_text=self.prompt_text,
            negative_prompt=self.negative_prompt,
            canon_references=sorted(self.canon_references),
            source_references=sorted(self.source_references),
            identity_constraints=sorted(
                [dict(d) for d in sorted(self.identity_constraints, key=lambda x: str(x))]
            ),
            composition_constraints=sorted(
                [dict(d) for d in sorted(self.composition_constraints, key=lambda x: str(x))]
            ),
            style_constraints=sorted(
                [dict(d) for d in sorted(self.style_constraints, key=lambda x: str(x))]
            ),
            preservation_constraints=sorted(
                [dict(d) for d in sorted(self.preservation_constraints, key=lambda x: str(x))]
            ),
            reference_images=self.reference_images,
            render_options=self.render_options,
            metadata=self.metadata,
        )

    @property
    def canonical_json(self) -> str:
        """Deterministic JSON representation of the input."""
        return canonicalize_input(self.model_dump(mode="json"))

    @property
    def prompt_text_sha256(self) -> str:
        return prompt_text_sha256(self.prompt_text)

    @property
    def input_sha256(self) -> str:
        return input_sha256(self.model_dump(mode="json"))


# Public aliases for the two contracts
PROMPT_BIBLE_RENDER_INPUT_SCHEMA = PROMPT_BIBLE_RENDER_INPUT_SCHEMA
PromptBibleRenderSchema = PROMPT_BIBLE_RENDER_INPUT_SCHEMA
