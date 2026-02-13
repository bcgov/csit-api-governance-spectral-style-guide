/**
 * Spectral rule function: Enforces that every schema object in an OpenAPI 3.1 document
 * must provide either `example` (deprecated but still allowed) **or** `examples`,
 * with specific rules applied to `examples`.
 *
 * This rule helps ensure schemas include at least one concrete example value,
 * improving documentation clarity and API discoverability.
 *
 * Validation rules:
 * - Skips `$ref` objects (unresolved references)
 * - Ignores non-object or invalid schema inputs
 * - `example`: considered present if the key exists and value is not `undefined`
 * - `examples`:
 *   - `null` → treated as valid (explicitly no examples)
 *   - empty array `[]` → treated as invalid (meaningless placeholder)
 *   - empty object `{}` → treated as valid (placeholder for future examples)
 *   - any non-empty value (object with named examples, array with unnamed, etc.) → valid
 *
 * Violation occurs only when **both** are missing according to the above rules:
 * - No `example` key (or `example: undefined`)
 * - AND `examples` is either missing, `[]`, or otherwise invalid per the logic
 *
 * Purpose:
 * Supports OpenAPI 3.1 migration (where `example` is deprecated in favor of `examples`)
 * while still allowing legacy `example` usage, but ensuring at least one form of example is provided.
 *
 * Example violations:
 * ```yaml
 * type: string
 * # neither example nor examples → flagged
 * ```
 *
 * ```yaml
 * type: string
 * examples: []           # empty array → flagged
 * ```
 *
 * Valid cases:
 * ```yaml
 * type: string
 * example: "hello"
 * ```
 *
 * ```yaml
 * type: string
 * examples:
 *   basic: "hello"
 *   upper: "HELLO"
 * ```
 *
 * ```yaml
 * type: string
 * examples: null         # explicitly no examples → allowed
 * ```
 *
 * ```yaml
 * type: string
 * examples: {}           # empty map → allowed as placeholder
 * ```
 *
 * @param {object} schema - The schema object being evaluated
 * @param {object} _ - Unused options object (Spectral convention)
 * @param {object} context - Spectral context (path, document, etc.)
 * @returns {Array<{message: string}>} Array of validation errors (empty if valid)
 */
export default (schema, _, context) => {
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