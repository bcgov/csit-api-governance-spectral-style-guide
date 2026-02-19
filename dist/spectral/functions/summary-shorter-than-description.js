/**
 * Spectral rule function: Ensures that an operation's `summary` is shorter than its `description`.
 *
 * In OpenAPI, the `summary` field is meant to be a concise, one-line overview of the operation,
 * while the `description` provides more detailed information. This rule enforces that the summary
 * is meaningfully shorter than the description to prevent redundancy and encourage proper usage.
 *
 * Behavior:
 * - Only applies when both `summary` and `description` are non-empty strings
 * - Compares the **trimmed** length of both fields
 * - Reports a violation if `summary.length >= description.length`
 * - Skips evaluation if either field is missing, not a string, or empty after trimming
 * - Reports at the level of the object containing both fields (usually an Operation Object)
 *
 * Purpose:
 * - Promote clear separation between short overview (`summary`) and detailed explanation (`description`)
 * - Prevent summaries that are as long as (or longer than) descriptions
 * - Improve readability in API documentation tools, consoles, and generated UIs
 *
 * Valid examples:
 *   summary: "Get user by ID"
 *   description: "Retrieves the details of a specific user identified by their unique ID. Returns 404 if not found."
 *   → valid (short summary, longer description)
 *
 * Invalid examples:
 *   summary: "This endpoint retrieves the details of a user by their ID and returns the full user object."
 *   description: "Fetches user data."
 *   → violation (summary is longer)
 *
 *   summary: "Retrieve user"
 *   description: "Retrieve user"
 *   → violation (same length)
 *
 * @param {object} targetVal - The object containing `summary` and `description` (typically an Operation Object)
 * @param {object} _ - Unused options object (Spectral convention)
 * @param {object} context - Spectral context (path, document, etc.)
 * @returns {Array<{message: string}>} Array of validation errors (empty if valid)
 */
var summaryShorterThanDescription = (targetVal, _, context) => {
  if (!targetVal || typeof targetVal !== 'object') {
    return [];
  }

  const summary = targetVal.summary;
  const description = targetVal.description;

  if (
    typeof summary !== 'string' ||
    typeof description !== 'string' ||
    summary.trim() === '' ||
    description.trim() === ''
  ) {
    return [];
  }

  const summaryLen = summary.trim().length;
  const descriptionLen = description.trim().length;

  if (summaryLen >= descriptionLen) {
    return [
      {
        message: `Summary (${summaryLen} chars) is not shorter than description (${descriptionLen} chars)`
      }
    ];
  }

  return [];
};

export { summaryShorterThanDescription as default };
