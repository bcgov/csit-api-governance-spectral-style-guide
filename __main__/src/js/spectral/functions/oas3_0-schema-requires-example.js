/**
 * Spectral rule function: Enforces that every schema object in an OpenAPI 3.0 document
 * includes an `example` key (even if its value is `null` or `undefined`).
 *
 * This rule helps ensure that schemas are self-documenting with at least one concrete
 * example value, improving API usability and reducing ambiguity for consumers.
 *
 * Behavior:
 * - Passes if the schema has an `example` property (any value, including null).
 * - Fails if the `example` key is completely missing.
 * - Skips `$ref` objects (unresolved references) to avoid false positives.
 * - Ignores non-object values and invalid schema structures.
 *
 * Example violations:
 *   type: string           → missing example
 *   type: object, properties: { ... } → missing example
 *
 * Valid cases:
 *   type: string, example: "hello"
 *   type: number, example: null
 *   $ref: '#/components/schemas/Foo'  → skipped (no example required here)
 *
 * @param {object} schema - The schema object being evaluated (from Spectral context)
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

  // Check if the 'example' KEY exists at all
  // → undefined or null value is now allowed (treated as present but empty)
  const hasExampleKey = 'example' in schema;

  if (!hasExampleKey) {
    results.push({
      message: "Schema is missing a required 'example' (OAS 3.0 style)"
    });
  }

  return results;
};