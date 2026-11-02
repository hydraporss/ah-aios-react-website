"""AH-AIOS Visual Generation Subsystem Integration (AH-VIS-INTEGRATION-001).

Implements the model-independent visual generation subsystem for AFTER HUMANITY
image production, following AH-VIS-GEN-001 protocol.

Pipeline:
WORLD MODEL → GENERATED WORLD STATE → VISUAL BRIEF → MODEL ADAPTER → IMAGE RENDERING → VISUAL AUDIT → HUMAN REVIEW

Components:
- VisualBrief: Structured, model-independent visual specification
- VisualBriefSchema: JSON schema for brief validation
- ModelAdapter: Provider-neutral interface for image-generation providers
- VisualValidator: Specification validation (not image inspection)
- VisualIntegration: Connects world generation to visual generation
"""
from .engine import VisualBrief, ModelAdapter, VisualValidator, VisualIntegration
from .prompt_bible import (
    PromptBibleRenderInput,
    PromptBibleRenderSchema,
    canonicalize_input,
    input_sha256,
    prompt_text_sha256,
    PROMPT_BIBLE_RENDER_INPUT_SCHEMA,
)
from .audit_pb import (
    ImageRenderAuditRecord,
    ImageRenderAuditSchema,
    IMAGE_RENDER_AUDIT_RECORD_SCHEMA,
    canonicalize,
    audit_full_sha256,
)
from .openai_adapter import OpenAIImageRenderer
from .render_engine import ImageRenderWorkflow

__all__ = [
    "VisualBrief",
    "VisualBriefSchema",
    "ModelAdapter",
    "VisualValidator",
    "VisualIntegration",
    "PromptBibleRenderInput",
    "PromptBibleRenderSchema",
    "ImageRenderAuditRecord",
    "ImageRenderAuditSchema",
    "OpenAIImageRenderer",
    "ImageRenderWorkflow",
    "canonicalize_input",
    "input_sha256",
    "prompt_text_sha256",
    "canonicalize",
    "audit_full_sha256",
]
