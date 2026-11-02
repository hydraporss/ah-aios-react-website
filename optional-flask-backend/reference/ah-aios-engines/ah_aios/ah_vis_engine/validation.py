"""AH-IMG-INTEGRATION-001 — Schema validation module.

Strict JSON Schema validator with deterministic error reporting.
Supports draft 2020-12 and reports validation failures with
field paths and expected values, so that error messages are
truthful, actionable, and never leak secrets.
"""

from __future__ import annotations

import re
from typing import Any

from .prompt_bible import PROMPT_BIBLE_RENDER_INPUT_SCHEMA
from .audit_pb import IMAGE_RENDER_AUDIT_RECORD_SCHEMA

# Draft 2020-12 meta-schema is the minimal supported schema version.
SUPPORTED_SCHEMA_DRAFT = "https://json-schema.org/draft/2020-12/schema"


class ValidationError(Exception):
    """Raised when an input record fails schema validation."""

    def __init__(self, message: str, errors: list[dict[str, Any]]):
        super().__init__(message)
        self.errors = errors

    def __str__(self) -> str:
        return f"{super().__str__()}\n{len(self.errors)} validation error(s): {[e.get('path', '.') for e in self.errors]}"


class SchemaValidator:
    """
    Strict validator for Prompt Bible render input and image audit record
    schemas.  Uses a hand-written, deterministic JSON Schema validator
    (no external `jsonschema` dependency) so that validation is
    reproducible across Python versions and environments.
    """

    def __init__(self, schema: dict[str, Any]):
        self._schema = schema
        self._errors: list[dict[str, Any]] = []

    def validate(self, instance: Any) -> None:
        """Validate *instance* against the schema.  Raises ValidationError on failure."""
        self._errors = []
        self._validate_instance(instance, self._schema, path="$")
        if self._errors:
            raise ValidationError(
                f"Prompt Bible input validation failed: {self._errors}",
                self._errors,
            )

    # ------------------------------------------------------------------
    # Core validation
    # ------------------------------------------------------------------

    def _validate_instance(self, instance: Any, schema: dict[str, Any], path: str) -> None:
        """Validate *instance* against *schema* at *path*."""
        schema_type = schema.get("type")
        if schema_type:
            type_ok = self._check_type(instance, schema_type)
            if not type_ok:
                self._add_error(
                    path,
                    "type",
                    f"expected {schema_type}, got {type(instance).__name__}",
                    actual=type(instance).__name__,
                    schema_type=schema_type,
                )
                return  # Type mismatch: skip remaining checks for this instance

        # Require check
        if schema.get("required") and isinstance(instance, dict):
            for req in schema["required"]:
                if req not in instance:
                    self._add_error(path, "required", f"missing required key '{req}'", key=req)

        # Additional properties
        if schema.get("additionalProperties") is False and isinstance(instance, dict):
            allowed = set(schema.get("properties", {}).keys())
            extra = set(instance.keys()) - allowed
            for key in sorted(extra):
                self._add_error(
                    path,
                    "additionalProperties",
                    f"unexpected key '{key}' (additionalProperties: False)",
                    key=key,
                )

        # Pattern checks
        for prop, subschema in schema.get("properties", {}).items():
            if prop in instance and subschema.get("pattern"):
                if not re.match(subschema["pattern"], instance[prop]):
                    self._add_error(
                        path,
                        "pattern",
                        f"does not match pattern '{subschema['pattern']}'",
                        key=prop,
                        value=instance[prop],
                        pattern=subschema["pattern"],
                    )

        # Enum checks
        if "enum" in schema and instance not in schema["enum"]:
            self._add_error(
                path, "enum", f"value '{instance}' not in allowed enum {schema['enum']}", actual=instance
            )

        # Item types for arrays
        if schema.get("type") == "array" and isinstance(instance, list):
            items_schema = schema.get("items", {})
            if isinstance(items_schema, dict):
                for i, item in enumerate(instance):
                    self._validate_instance(item, items_schema, f"{path}[{i}]")
            if schema.get("uniqueItems") and len(instance) != len(set(instance)):
                self._add_error(
                    path,
                    "uniqueItems",
                    "array contains duplicate items",
                    actual=[str(item) for item in instance],
                )

        # Min/max and minLength checks
        if isinstance(instance, (int, float)) and schema.get("minimum") is not None:
            if instance < schema["minimum"]:
                self._add_error(
                    path, "minimum", f"value {instance} < minimum {schema['minimum']}", actual=instance
                )
        if isinstance(instance, (int, float)) and schema.get("maximum") is not None:
            if instance > schema["maximum"]:
                self._add_error(
                    path, "maximum", f"value {instance} > maximum {schema['maximum']}", actual=instance
                )

        # Nested properties validation
        for prop_name, prop_schema in schema.get("properties", {}).items():
            if prop_name in instance:
                prop_value = instance[prop_name]  # type: ignore[index]
                if isinstance(prop_value, str) and prop_schema.get("minLength") is not None:
                    if len(prop_value) < prop_schema["minLength"]:
                        self._add_error(
                            f"{path}.{prop_name}",
                            "minLength",
                            f"length {len(prop_value)} < minLength {prop_schema['minLength']}",
                            key=prop_name,
                            value=prop_value,
                        )
                self._validate_instance(prop_value, prop_schema, f"{path}.{prop_name}")

    def _check_type(self, instance: Any, expected: str | list[str]) -> bool:
        """Return True if *instance* matches the JSON Schema *expected* type(s)."""
        if isinstance(expected, list):
            return any(self._check_type(instance, t) for t in expected)
        if expected == "object":
            return isinstance(instance, dict)
        if expected == "array":
            return isinstance(instance, list)
        if expected == "string":
            return isinstance(instance, str)
        if expected == "integer":
            return isinstance(instance, int) and not isinstance(instance, bool)
        if expected == "number":
            return isinstance(instance, (int, float)) and not isinstance(instance, bool)
        if expected == "boolean":
            return isinstance(instance, bool)
        if expected == "null":
            return instance is None
        if expected == "any":
            return True
        return False

    def _add_error(self, path: str, error_type: str, message: str, **context: Any) -> None:
        self._errors.append(
            {
                "path": path,
                "type": error_type,
                "message": message,
                **context,
            }
        )

    # ------------------------------------------------------------------
    # Convenient entry points for the two contracts
    # ------------------------------------------------------------------

    @classmethod
    def validate_prompt_bible(cls, instance: Any) -> None:
        """Validate Prompt Bible render input against the PromptBible schema."""
        validator = cls(PROMPT_BIBLE_RENDER_INPUT_SCHEMA)
        validator.validate(instance)

    @classmethod
    def validate_audit_record(cls, instance: Any) -> None:
        """Validate image audit record against the audit schema."""
        validator = cls(IMAGE_RENDER_AUDIT_RECORD_SCHEMA)
        validator.validate(instance)
