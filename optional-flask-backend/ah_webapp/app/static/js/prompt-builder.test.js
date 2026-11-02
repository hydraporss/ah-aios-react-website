/**
 * AI Harness — Prompt Builder Tests
 * Validation engine tests for PB-VAL-001 → PB-VAL-010
 * Version 0.1-Draft — Proposed Architecture, Not Yet Implemented
 */

const TEMPLATES = {
    research: {
        id: "research",
        name: "Research Report",
        description: "Generate a comprehensive research report",
        version: "1.0",
        created: "2026-10-31",
        instructions: "You are a research analyst...",
        variables: ["{{claim_id}}", "{{source_data}}", "{{context_memory}}"]
    },
    analysis: {
        id: "analysis",
        name: "Analysis Report",
        description: "Generate a structured analysis",
        version: "1.0",
        created: "2026-10-31",
        instructions: "You are an analytical assistant...",
        variables: ["{{claim_id}}", "{{source_data}}", "{{context_memory}}"]
    }
};

// Validation rules for PB-VAL-001 through PB-VAL-010
const VALIDATION_RULES = {
    "PB-VAL-001": {
        name: "Template ID Required",
        validate: (data) => {
            return {
                valid: !!data.template_id,
                message: data.template_id ? "Template ID present" : "Template ID is required"
            };
        }
    },
    "PB-VAL-002": {
        name: "Instructions Required",
        validate: (data) => {
            return {
                valid: typeof data.instructions === "string" && data.instructions.trim().length > 0,
                message: data.instructions && data.instructions.trim().length > 0 ? "Instructions provided" : "Instructions are required"
            };
        }
    },
    "PB-VAL-003": {
        name: "Variables Are Valid Placeholders",
        validate: (data) => {
            const pattern = /^\{\{[a-z_]+}}$/;
            const allValid = data.variables.every(v => pattern.test(v));
            return {
                valid: allValid,
                message: allValid ? "All variables are valid placeholders" : "Some variables are invalid"
            };
        }
    },
    "PB-VAL-004": {
        name: "Model Provider Valid",
        validate: (data) => {
            const validModels = ["gpt-4", "gpt-3.5", "claude-3", "gemini", "local"];
            return {
                valid: validModels.includes(data.model),
                message: validModels.includes(data.model) ? `Model ${data.model} is valid` : "Unknown model provider"
            };
        }
    },
    "PB-VAL-005": {
        name: "Context Data Integrity",
        validate: (data) => {
            const requiredFields = ["entity", "evidence", "source"];
            const allPresent = requiredFields.every(field => data.context[field]);
            return {
                valid: allPresent,
                message: allPresent ? "All context fields present" : "Some context fields missing"
            };
        }
    },
    "PB-VAL-006": {
        name: "Variable References Resolved",
        validate: (data) => {
            const template = TEMPLATES[data.template_id];
            if (!template) return { valid: false, message: "Unknown template" };
            
            const missingVars = template.variables.filter(v => !data.context[v.replace('{{', '').replace('}}', '')]);
            return {
                valid: missingVars.length === 0,
                message: missingVars.length === 0 ? "All variables resolved" : `Missing: ${missingVars.join(", ")}`
            };
        }
    },
    "PB-VAL-007": {
        name: "Instructions Length Valid",
        validate: (data) => {
            return {
                valid: data.instructions.length >= 50,
                message: data.instructions.length >= 50 ? "Instructions meet minimum length" : "Instructions too short"
            };
        }
    },
    "PB-VAL-008": {
        name: "Model-Platform Compatibility",
        validate: (data) => {
            const incompatible = ["local", "gemini"];
            const incompatibleModels = incompatible.includes(data.model);
            return {
                valid: !incompatibleModels,
                message: incompatibleModels ? "Model may have compatibility issues" : "Model is compatible"
            };
        }
    },
    "PB-VAL-009": {
        name: "Version Header Present",
        validate: (data) => {
            return {
                valid: data.metadata && data.metadata.version,
                message: data.metadata && data.metadata.version ? "Version header present" : "Version header missing"
            };
        }
    },
    "PB-VAL-010": {
        name: "Ecosystem Context Registered",
        validate: (data) => {
            const context = data.context;
            const hasSystem = context.system || context.execution_context;
            const hasEntity = context.entity || context.worldforge_entity;
            return {
                valid: hasSystem && hasEntity,
                message: hasSystem && hasEntity ? "All ecosystem context registered" : "Missing ecosystem context"
            };
        }
    }
};

// Test runner
function runValidation(testData) {
    const results = [];
    
    for (const [ruleId, rule] of Object.entries(VALIDATION_RULES)) {
        const result = rule.validate(testData);
        results.push({
            rule: ruleId,
            name: rule.name,
            valid: result.valid,
            message: result.message
        });
    }
    
    return results;
}

// Test cases
const testCases = [
    {
        name: "Valid prompt with all fields",
        data: {
            template_id: "research",
            model: "gpt-4",
            instructions: "Generate a comprehensive research report...",
            context: {
                entity: "AH-AIOS Core",
                evidence: "EVIDENCE-001",
                source: "SOURCE-001",
                memory: "MEMORY-001",
                claim: "CLAIM-001"
            },
            variables: ["{{claim_id}}", "{{source_data}}", "{{context_memory}}"],
            metadata: { version: "1.0", created: "2026-10-31T00:00:00Z" }
        }
    },
    {
        name: "Valid prompt missing metadata",
        data: {
            template_id: "analysis",
            model: "gpt-3.5",
            instructions: "Provide a structured analysis...",
            context: {
                entity: "WorldForge",
                evidence: "EVIDENCE-002",
                source: "SOURCE-002",
                memory: "MEMORY-002",
                claim: "CLAIM-002"
            },
            variables: ["{{claim_id}}", "{{source_data}}", "{{context_memory}}"],
            metadata: { version: "1.0" }
        }
    },
    {
        name: "Invalid template ID",
        data: {
            template_id: "invalid",
            model: "gpt-4",
            instructions: "Test instructions...",
            context: {
                entity: "AH-AIOS Core",
                evidence: "EVIDENCE-001",
                source: "SOURCE-001",
                memory: "MEMORY-001",
                claim: "CLAIM-001"
            },
            variables: ["{{claim_id}}"],
            metadata: { version: "1.0" }
        }
    },
    {
        name: "Missing instructions",
        data: {
            template_id: "research",
            model: "gpt-4",
            instructions: "",
            context: {
                entity: "AH-AIOS Core",
                evidence: "EVIDENCE-001",
                source: "SOURCE-001",
                memory: "MEMORY-001",
                claim: "CLAIM-001"
            },
            variables: ["{{claim_id}}"],
            metadata: { version: "1.0" }
        }
    },
    {
        name: "Invalid variable placeholder",
        data: {
            template_id: "research",
            model: "gpt-4",
            instructions: "Test instructions...",
            context: {
                entity: "AH-AIOS Core",
                evidence: "EVIDENCE-001",
                source: "SOURCE-001",
                memory: "MEMORY-001",
                claim: "CLAIM-001"
            },
            variables: ["{{invalid_var}}"],
            metadata: { version: "1.0" }
        }
    }
];

// Run all tests
function runAllTests() {
    console.log("AI Harness Prompt Builder Validation Tests\n");
    console.log("=".repeat(60));
    
    let passed = 0;
    let failed = 0;
    
    for (const testCase of testCases) {
        console.log(`\nTest: ${testCase.name}`);
        console.log("-".repeat(40));
        
        const results = runValidation(testCase.data);
        
        for (const result of results) {
            const status = result.valid ? "PASS" : "FAIL";
            if (result.valid) passed++; else failed++;
            console.log(`  [${status}] ${result.rule}: ${result.message}`);
        }
    }
    
    console.log("\n".repeat(2) + "=".repeat(60));
    console.log(`Total: ${passed + failed} tests, ${passed} passed, ${failed} failed`);
    console.log("=".repeat(60));
    
    return { passed, failed };
}

// Export for use in test framework
if (typeof module !== "undefined") {
    module.exports = {
        TEMPLATES,
        VALIDATION_RULES,
        runValidation,
        runAllTests,
        testCases
    };
}
