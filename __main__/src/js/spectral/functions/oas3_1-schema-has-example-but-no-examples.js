/**
 * Spectral rule function: Encourages use of `examples` (plural) over the deprecated `example` (singular)
 * in OpenAPI 3.1 schema objects.
 *
 * In OpenAPI 3.1, the `example` field is deprecated in favor of `examples`, which allows multiple
 * named examples and is more flexible. This rule flags schemas that still use the old `example`
 * field without also providing `examples`.
 *
 * Behavior:
 * - Reports a violation only when `example` exists (and is defined) **and** `examples` is missing.
 * - Does **not** complain if:
 *   - Only `examples` is present (preferred modern style)
 *   - Both `example` and `examples` are present (transitional case)
 *   - Neither is present
 *   - The schema is not an object
 *
 * Purpose:
 * Helps teams migrate to OpenAPI 3.1 best practices and prepares schemas for better tooling support,
 * richer documentation, and future-proofing.
 *
 * Example violation:
 * ```yaml
 * type: string
 * example: "hello-world"           # ← flagged: prefer examples
 * ```
 *
 * Valid / preferred cases:
 * ```yaml
 * type: string
 * examples:
 *   basic: "hello-world"
 *   upper: "HELLO WORLD"
 * ```
 *
 * ```yaml
 * type: string
 * example: "hello-world"           # allowed (transitional)
 * examples:
 *   basic: "hello-world"
 * ```
 *
 * @param {object} schema - The schema object being evaluated
 * @returns {Array<{message: string}>} Array of validation messages (empty if no issue)
 */
export default (schema) => {
  // Skip if schema is not an object
  if (!schema || typeof schema !== 'object') {
    return [];
  }

  const hasExample = 'example' in schema && schema.example !== undefined;
  const hasExamples = 'examples' in schema && schema.examples !== undefined;

  // Only warn when 'example' exists BUT 'examples' does NOT
  if (hasExample && !hasExamples) {
    return [{
      message: "Prefer 'examples' over (or in addition to) the deprecated 'example' in OAS 3.1 schemas"
    }];
  }

  // No violation in all other cases:
  // - only examples
  // - both example and examples
  // - neither
  return [];
};