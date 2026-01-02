// functions/oas3_1-schema-requires-example-or-examples.js

var oas3_1SchemaRequiresExample = (schema, _, context) => {
  const results = [];

  // Skip if this is literally a $ref object (unresolved reference)
  if (schema && typeof schema === 'object' && '$ref' in schema) {
    return results;
  }

  // Only continue if this looks like a real schema object
  if (!schema || typeof schema !== 'object') {
    return results;
  }

  // Check 'example' (deprecated but still valid)
  const hasExample = 'example' in schema && schema.example !== undefined;

  // Check 'examples' — very specific validation rules
  let hasValidExamples = false;

  if ('examples' in schema) {
    const examplesValue = schema.examples;

    // Case 1: examples: null → valid (no violation)
    if (examplesValue === null) {
      hasValidExamples = true;
    }
    // Case 2: examples: [] → invalid (triggers violation)
    // Case 3: examples: {} (empty map) → valid (no violation)
    else if (
      Array.isArray(examplesValue) && examplesValue.length === 0
    ) {
      hasValidExamples = false;
    }
    // Case 4: examples present and non-null/non-empty-array → valid
    else {
      hasValidExamples = true;
    }
  }

  // Enforce: must have either 'example' OR 'examples' (with your exact rules)
  if (!hasExample && !hasValidExamples) {
    results.push({
      message: "Schema is missing either 'example' or 'examples' (OAS 3.1 style)"
    });
  }

  return results;
};

export { oas3_1SchemaRequiresExample as default };
