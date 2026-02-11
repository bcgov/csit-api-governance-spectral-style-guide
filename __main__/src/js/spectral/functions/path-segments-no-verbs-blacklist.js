// functions/path-segments-no-verbs-blacklist.js

import { isBlacklisted } from './shared-path-helpers.js';

/**
 * Spectral rule function: Prevents the use of blacklisted verb-like words in static path segments.
 *
 * RESTful APIs should use nouns for resources in paths, with HTTP methods indicating actions.
 * This rule flags paths that contain common action verbs (e.g. "create", "get", "update")
 * in static (non-parameter) segments.
 *
 * Uses shared helpers from `shared-path-helpers.js`:
 * - `isBlacklisted`: returns the first blacklisted verb found (or null)
 *
 * Behavior:
 * - Only static segments are checked (skips `{param}` placeholders)
 * - Case-insensitive matching (handled by helper)
 * - Reports violation at the path level (entire path key highlighted)
 *
 * Example violations:
 *   /users/create               → flagged ("create")
 *   /orders/submit-payment      → flagged ("submit")
 *   /items/findByName           → flagged ("find")
 *
 * Valid examples:
 *   /users
 *   /user-profiles
 *   /orders/{orderId}/items
 *   /search-queries             → not flagged ("search" as noun)
 *
 * @param {string} schema - The path string (e.g. "/users/create")
 * @param {object} opts - Rule options
 * @param {boolean} [opts.debug=false] - Enable detailed console logging
 * @param {object} context - Spectral context
 * @param {Array} context.path - JSON path to the path item
 * @returns {Array<{message: string, path: Array}>} Validation errors (empty if valid)
 */
export default (schema, opts, context) => {
  const results = [];

  const {
    debug = false,
  } = opts || {};

  // Conditional logging helper
  const log = (...args) => {
    if (debug) {
      console.log(...args);
    }
  };

  const fullPath = context.path[context.path.length - 1];
  if (!fullPath || typeof fullPath !== 'string') return results;

  const segments = fullPath.split('/').filter(Boolean);

  segments.forEach((segment) => {
    if (segment.startsWith('{') && segment.endsWith('}')) {
      return;
    }

    const badWord = isBlacklisted(segment);

    if (badWord) {
      if (debug) {
        log(`[BLACKLIST] Found verb "${badWord}" in segment "${segment}"`);
      }

      results.push({
        message: `Path segment "${segment}" contains blacklisted verb "${badWord}". Use nouns only.`,
        path: context.path,
      });
    }
  });

  return results;
};