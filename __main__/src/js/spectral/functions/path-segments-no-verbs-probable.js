import posTagger from 'wink-pos-tagger';

import { splitIntoWords, isBlacklisted } from './shared-path-helpers.js';

// Initialize wink-pos-tagger (lightweight, no model loading needed)
const tagger = posTagger();

// Verb-like suffixes
const verbLikeSuffixes = ['ate', 'ize', 'ise', 'ify', 'en'];

const hasVerbLikeSuffix = (word) => {
  const lower = word.toLowerCase();
  return verbLikeSuffixes.some(suffix =>
    lower.endsWith(suffix) && lower.length > suffix.length + 2
  );
};

/**
 * Spectral rule function: Detects **probable verbs** or action-oriented words in static path segments
 * using a combination of lightweight NLP (POS tagging) and heuristic rules.
 *
 * This is a **softer / advisory** complement to `path-segments-no-verbs-blacklist`.
 * It flags segments that are **likely** verbs or actions, even if not in the strict blacklist.
 *
 * Detection methods (applied per word):
 * 1. POS tagging (via wink-pos-tagger): flags VB, VBP, VBZ as probable verbs
 *    (VBD/VBN are skipped — often adjectives in path context)
 * 2. Explicit disallowed words list (via rule options)
 * 3. Verb-like suffix heuristic (e.g. activate, organize, simplify, strengthen)
 *
 * Features:
 * - Skips path parameters ({id}, {userId}, etc.)
 * - Optionally skips segments already caught by the blacklist (configurable)
 * - Supports allow-list and disallow-list overrides via options
 * - Reports at path level (entire path key highlighted)
 *
 * Recommended use: warn severity (soft guidance)
 *
 * @example Violations
 *   /users/activate           → flagged ("activate" → suffix + likely VB)
 *   /orders/submit            → flagged ("submit" → disallowed or POS)
 *   /items/organizeByDate     → flagged ("organize" → suffix + VB)
 *
 * @example Valid
 *   /users
 *   /user-profiles
 *   /orders/{orderId}/status
 *   /activation-keys          → "activation" is noun, suffix not triggered
 *
 * @param {any} _ - Unused target value (rule runs on path key)
 * @param {object} opts - Configuration options
 * @param {boolean} [opts.skipBlacklisted=true] - Skip segments already blacklisted
 * @param {string[]} [opts.allowed=[]] - Words to explicitly allow
 * @param {string[]} [opts.disallowed=[]] - Extra words to disallow
 * @param {boolean} [opts.debug=false] - Enable verbose console logging
 * @param {object} context - Spectral context
 * @param {Array} context.path - JSON path (last element = full path string)
 * @returns {Array<{message: string, path: Array}>} Validation warnings (empty if clean)
 */
export default (_, opts, context) => {
  const results = [];

  const {
    skipBlacklisted = true,
    allowed = [],
    disallowed = [],
    debug = false,
  } = opts || {};

  // Conditional logging helper
  const log = (...args) => {
    if (debug) {
      console.log(...args);
    }
  };

  const allowSet = new Set(allowed.map(w => w.toLowerCase()));
  const disallowedSet = new Set(disallowed.map(w => w.toLowerCase()));

  const fullPath = context.path[context.path.length - 1];
  if (!fullPath || typeof fullPath !== 'string') {
    log('No valid fullPath found:', context.path);
    return results;
  }

  log('\n--- Processing path:', fullPath);

  const segments = fullPath.split('/').filter(Boolean);

  segments.forEach((segment) => {
    if (segment.startsWith('{') && segment.endsWith('}')) {
      log(`  Skipping parameter: ${segment}`);
      return;
    }

    log(`\n  [PROBABLE] Analyzing segment: "${segment}"`);

    if (skipBlacklisted && isBlacklisted(segment)) {
      log(`    Skipped: blacklisted verb (${segment})`);
      return;
    }

    const words = splitIntoWords(segment);
    log(`    [PROBABLE] Split into words: [${words.join(', ')}]`);

    let isProbableVerb = false;
    let reason = '';
    let triggerWord = '';

    // 1. POS tagging with wink-pos-tagger: per word
    for (const word of words) {
      if (word.length < 3) continue;

      const isAllowedWord = allowSet.has(word.toLowerCase());
      
      if (isAllowedWord) {
        log(`    [PROBABLE]   Skipping allowed word: "${word}"`);
      } else {
        try {
          const tagged = tagger.tagRawTokens([word]);
          const posTag = tagged[0]?.pos || 'UNKNOWN';

          log(`    [PROBABLE]   Word "${word}" → POS tag: ${posTag}`);

          if (['VB', 'VBP', 'VBZ'].includes(posTag)) {
            isProbableVerb = true;
            reason = 'NLP tagged as active verb (VB/VBP/VBZ)';
            triggerWord = word;
            log(`    [PROBABLE]   ACTIVE VERB DETECTED: "${word}" (${posTag})`);
            break;
          }

          if (posTag === 'VBD' || posTag === 'VBN') {
            log(`    [PROBABLE]   Skipping past tense/participle: "${word}" (${posTag}) — likely adjective`);
          }

        } catch (err) {
          log(`    [PROBABLE]   Tagging error on word "${word}": ${err.message}`);
        }

        // 2. Suffix heuristic and disallowed list (fallback)
        if (!isProbableVerb) {
          if (disallowedSet.has(word.toLowerCase())) {
            isProbableVerb = true;
            reason = 'disallowed word';
            triggerWord = word;
            log(`    [PROBABLE]   DISALLOWED WORD: "${word}"`);
            break;
          }

          if (hasVerbLikeSuffix(word)) {
            isProbableVerb = true;
            reason = 'verb-like suffix';
            triggerWord = word;
            log(`    [PROBABLE]   VERB-LIKE SUFFIX FOUND: "${word}"`);
            break;
          }
        }
      }
    }

    if (isProbableVerb) {
      log(`    [PROBABLE] PROBABLE VERB DETECTED → ${reason} ("${triggerWord}")`);
      results.push({
        message: `Path segment "${segment}" is likely a verb or action (${reason}: "${triggerWord}"). Prefer nouns for resources.`,
        path: context.path,
      });
    } else {
      log(`    [PROBABLE] No probable verb detected`);
    }
  });

  log(`\nFinished path "${fullPath}" → ${results.length} warning(s) generated\n`);
  return results;
};