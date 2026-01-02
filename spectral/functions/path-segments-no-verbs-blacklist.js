// src/functions/shared-path-helpers.js

const splitIntoWords = (segment) => {
  let words = segment.split(/[-_]/);

  words = words.flatMap(word =>
    word.split(/(?=[A-Z])/).filter(Boolean)
  );

  return words
    .map(w => w.toLowerCase())
    .filter(w => w.length > 0);
};

// functions/path-segments-no-verbs-blacklist.js

const blacklistedVerbs = new Set([
  'get', 'create', 'update', 'delete', 'patch', 'put', 'post',
  'list', 'add', 'remove', 'edit', 'view', 'search', 'find',
  'retrieve', 'save', 'modify', 'archive', 'activate', 'deactivate',
  'validate', 'approve', 'reject', 'cancel', 'send', 'run', 'execute',
  'login', 'checkout', 'download', 'sync', 'refresh',
]);

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

    log(`\n[BLACKLIST] Analyzing segment: "${segment}"`);

    const words = splitIntoWords(segment);
    log(`[BLACKLIST]   Split into words: [${words.join(', ')}]`);

    let foundBlacklisted = false;
    let badWord = null;

    for (const word of words) {
      
      log(`[BLACKLIST]     Checking word: "${word}"`);

      if (blacklistedVerbs.has(word)) {
        foundBlacklisted = true;
        badWord = word;
        log(`[BLACKLIST]     BLACKLISTED VERB FOUND: "${badWord}"`);
        break;
      } else {
        log(`[BLACKLIST]     Not blacklisted`);
      }
    }

    if (foundBlacklisted) {
      results.push({
        message: `Path segment "${segment}" contains blacklisted verb "${badWord}". Use nouns only.`,
        path: context.path,
      });
    } else {
      log(`[BLACKLIST]   No blacklisted verb detected`);
    }
  });

  return results;
};

export { pathSegmentsNoVerbsBlacklist as default };
