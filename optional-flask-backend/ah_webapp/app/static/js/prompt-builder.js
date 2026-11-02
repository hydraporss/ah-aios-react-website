/**
 * AI Harness — Prompt Builder
 * Prototype for PB-VAL-001 → PB-VAL-010 validation engine
 * Version 0.1-Draft — Proposed Architecture, Not Yet Implemented
 */

// Template definitions
const TEMPLATES = {
    research: {
        id: "research",
        name: "Research Report",
        description: "Generate a comprehensive research report with sections for background, methodology, findings, and conclusions.",
        version: "1.0",
        created: "2026-10-31",
        instructions: `You are a research analyst. Generate a research report with the following structure:
        
        1. Executive Summary (3-4 sentences)
        2. Background & Context
        3. Methodology
        4. Key Findings
        5. Recommendations
        6. References
        
        Use the provided context and evidence. Cite all sources.
        `,
        variables: ["{{claim_id}}", "{{source_data}}", "{{context_memory}}", "{{execution_context}}", "{{worldforge_entity}}", "{{evidence_ref}}"]
    },
    analysis: {
        id: "analysis",
        name: "Analysis Report",
        description: "Generate a structured analysis of provided data or claims.",
        version: "1.0",
        created: "2026-10-31",
        instructions: `You are an analytical assistant. Provide a structured analysis:

        1. Problem Statement
        2. Analysis Framework
        3. Findings
        4. Implications
        5. Open Questions
        
        Be objective. Distinguish between facts and inferences.
        `,
        variables: ["{{claim_id}}", "{{source_data}}", "{{context_memory}}", "{{worldforge_entity}}", "{{evidence_ref}}"]
    },
    summary: {
        id: "summary",
        name: "Executive Summary",
        description: "Generate a concise executive summary of complex information.",
        version: "1.0",
        created: "2026-10-31",
        instructions: `You are a senior executive assistant. Create a concise executive summary:

        - 3-5 bullet points of key findings
        - Critical risks or opportunities
        - Recommended actions
        
        Keep it under 500 words. Use clear, direct language.
        `,
        variables: ["{{claim_id}}", "{{source_data}}", "{{context_memory}}", "{{worldforge_entity}}"]
    },
    status: {
        id: "status",
        name: "Status Update",
        description: "Generate a status update for stakeholders.",
        version: "1.0",
        created: "2026-10-31",
        instructions: `You are a project coordinator. Generate a status update:

        - Current status (on track / at risk / blocked)
        - Key accomplishments this period
        - Pending items
        - Upcoming milestones
        
        Keep it concise and actionable.
        `,
        variables: ["{{claim_id}}", "{{source_data}}", "{{context_memory}}", "{{worldforge_entity}}"]
    },
    data: {
        id: "data",
        name: "Data Analysis",
        description: "Analyze provided data and generate insights.",
        version: "1.0",
        created: "2026-10-31",
        instructions: `You are a data analyst. Analyze the provided data:

        1. Summary of key metrics
        2. Trends and patterns
        3. Anomalies or outliers
        4. Recommendations
        
        Include specific data points in your analysis.
        `,
        variables: ["{{source_data}}", "{{context_memory}}", "{{worldforge_entity}}", "{{evidence_ref}}"]
    }
};

// Prompts library
const PROMPTS_LIBRARY = {
    templates: TEMPLATES,
    variables: {
        system: "execution_context",
        entity: "worldforge_entity",
        evidence: "evidence_ref",
        source: "source_data",
        memory: "context_memory",
        claim: "claim_id"
    }
};

// Current state
let currentTemplate = null;
let currentPrompt = "";
let currentModel = "gpt-4";
let validationResults = [];

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    loadDefaultTemplate();
    updatePreview();
});

// Template loading
function loadTemplate() {
    const templateId = document.getElementById("templateSelect").value;
    if (templateId && TEMPLATES[templateId]) {
        currentTemplate = TEMPLATES[templateId];
        document.getElementById("promptInput").value = currentTemplate.instructions;
        updatePreview();
    }
}

function loadDefaultTemplate() {
    if (Object.keys(TEMPLATES).length > 0) {
        const templateId = Object.keys(TEMPLATES)[0];
        document.getElementById("templateSelect").value = templateId;
        loadTemplate();
    }
}

// Variable insertion
function insertVariable(variable) {
    const textarea = document.getElementById("promptInput");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    textarea.value = value.substring(0, start) + variable + value.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + variable.length;
    updatePreview();
}

// Preview update
function updatePreview() {
    const template = TEMPLATES[document.getElementById("templateSelect").value];
    if (!template) {
        document.getElementById("previewOutput").textContent = "Select a template to begin.";
        return;
    }

    let prompt = template.instructions;
    
    // Add template metadata
    prompt += `\n\n## Template Metadata\n`;
    prompt += `- Title: ${template.name}\n`;
    prompt += `- Version: ${template.version}\n`;
    prompt += `- Created: ${template.created}\n`;
    prompt += `- ID: [${template.id}]\n\n`;

    // Add context placeholders
    prompt += "## Context\n";
    prompt += "The following context is available for use:\n";
    for (const varName of template.variables) {
        prompt += `${varName}\n`;
    }
    prompt += "\n";

    // Add user instructions
    const userInput = document.getElementById("promptInput").value;
    if (userInput.trim()) {
        prompt += "\n## User Instructions\n";
        prompt += userInput.trim() + "\n";
    }

    // Add model context
    prompt += "\n## Model Context\n";
    prompt += `Model: ${currentModel}\n`;
    prompt += `System Role: Research/Analysis/Summary/Status/Data\n`;

    document.getElementById("previewOutput").textContent = prompt;
    document.querySelector(".prompt-builder .card-header h2").textContent = `Command Builder — ${template ? template.name : "Select a template..."}`;
}

// Validation
function validatePrompt() {
    const template = TEMPLATES[document.getElementById("templateSelect").value];
    if (!template) {
        showValidationResult("error", "No template selected.");
        return;
    }

    const userInput = document.getElementById("promptInput").value.trim();
    if (!userInput) {
        showValidationResult("warning", "No user instructions provided.");
        return;
    }

    // Run validation checks
    validationResults = [
        { name: "Template Selected", passed: !!template, message: template ? `Using template: ${template.name}` : "No template selected" },
        { name: "Instructions Provided", passed: userInput.length > 0, message: `Instructions: ${userInput.length} characters` },
        { name: "Variable Usage", passed: true, message: `Available variables: ${template.variables.length} defined` },
        { name: "Model Specified", passed: currentModel !== "local", message: `Model: ${currentModel}` },
        { name: "Context Included", passed: true, message: "Context variables available" }
    ];

    renderValidationResults();
    updatePreview();
}

function renderValidationResults() {
    const container = document.getElementById("validationResults");
    container.innerHTML = "";
    for (const result of validationResults) {
        const div = document.createElement("div");
        div.className = `result-item ${result.passed ? "pass" : "fail"}`;
        div.innerHTML = `<span>${result.passed ? "✓" : "✗"}</span> <span>${result.message}</span>`;
        container.appendChild(div);
    }
}

function showValidationResult(type, message) {
    const container = document.getElementById("validationResults");
    container.innerHTML = `<div class="result-item ${type}"><span>${type === "error" ? "✗" : "⚠"}</span> <span>${message}</span></div>`;
}

// Copy preview
function copyPreview() {
    const text = document.getElementById("previewOutput").textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("Prompt copied to clipboard.");
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("Prompt copied to clipboard.");
    });
}

// Export
function exportPrompt() {
    const template = TEMPLATES[document.getElementById("templateSelect").value];
    if (!template) {
        alert("Select a template first.");
        return;
    }

    const promptData = {
        template: template.id,
        model: currentModel,
        instructions: document.getElementById("promptInput").value,
        variables: template.variables,
        created: new Date().toISOString(),
        version: "0.1-DRAFT"
    };

    const blob = new Blob([JSON.stringify(promptData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-harness-prompt-${template.id}-${currentModel}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Sample command
function loadSample() {
    const textarea = document.getElementById("promptInput");
    textarea.value = `You are a research analyst. Provide a comprehensive analysis of the following claim:

"First Settlement was founded in 2184"

Use the provided context and evidence. Cite all sources.
`;
    updatePreview();
}
