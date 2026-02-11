/**
 * Shared utility functions for path-related Spectral rules, particularly those
 * enforcing RESTful naming conventions (e.g. no verbs in path segments).
 *
 * These helpers are used by rules such as:
 * - path-segments-no-verbs-blacklist
 * - (potentially) path-segments-no-verbs-probable or similar NLP-based checks
 *
 * Main features:
 * - Splits path segments into individual words, handling common separators
 *   and camelCase boundaries
 * - Checks words against a shared blacklist of common action verbs
 *
 * The goal is to encourage noun-based, resource-oriented paths (e.g. /users, /orders)
 * and discourage verb-based, RPC-style paths (e.g. /users/create, /orders/submit).
 */

const blacklistedVerbs = new Set([
  'get', 'create', 'update', 'delete', 'patch', 'put', 'post',
  'list', 'add', 'remove', 'edit', 'view', 'search', 'find',
  'retrieve', 'save', 'modify', 'archive', 'activate', 'deactivate',
  'validate', 'approve', 'reject', 'cancel', 'send', 'run', 'execute',
  'login', 'checkout', 'download', 'sync', 'refresh',
]);

/**
 * Splits a path segment into individual words for verb detection.
 *
 * Handles multiple conventions:
 * - Hyphens:           user-profiles → ['user', 'profiles']
 * - Underscores:       user_profiles → ['user', 'profiles']
 * - CamelCase:         userProfiles   → ['user', 'Profiles']
 * - PascalCase:        UserProfiles   → ['User', 'Profiles']
 * - Mixed:             createUserOrder → ['create', 'User', 'Order']
 *
 * All resulting words are converted to lowercase and empty strings are filtered out.
 *
 * @param {string} segment - A single path segment (e.g. "userProfiles", "create-order")
 * @returns {string[]} Array of lowercase words extracted from the segment
 *
 * @example
 * splitIntoWords("createUserOrder") // → ['create', 'user', 'order']
 * splitIntoWords("user-profiles")   // → ['user', 'profiles']
 * splitIntoWords("GetUsers")        // → ['get', 'users']
 */
const splitIntoWords = (segment) => {
  let words = segment.split(/[-_]/);

  words = words.flatMap(word =>
    word.split(/(?=[A-Z])/).filter(Boolean)
  );

  return words
    .map(w => w.toLowerCase())
    .filter(w => w.length > 0);
};

/**
 * Checks whether a path segment contains any blacklisted verb words and returns
 * the first matching blacklisted word if found.
 *
 * Uses `splitIntoWords` to break the segment into words, then tests each word
 * against the predefined set of forbidden action verbs (case-insensitive).
 *
 * @param {string} segment - The path segment to check (e.g. "createUser", "list-orders")
 * @returns {string | null} The first blacklisted verb found (lowercase), or `null` if none
 *
 * @example
 * isBlacklisted("createUser")       // → "create"
 * isBlacklisted("user-profiles")    // → null
 * isBlacklisted("GetAllItems")      // → "get"
 * isBlacklisted("activate-account") // → "activate"
 */
const isBlacklisted = (segment) => {
  const words = splitIntoWords(segment);

  for (const word of words) {
    if (blacklistedVerbs.has(word)) {
      return word; // return the first matching blacklisted word
    }
  }

  return null;
};

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
var pathSegmentsNoVerbsBlacklist = (schema, opts, context) => {
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

export { pathSegmentsNoVerbsBlacklist as default };
