// functions/path-segments-no-verbs-probable.js

import posTagger from 'wink-pos-tagger';
import { isBlacklisted, splitIntoWords } from './path-segments-no-verbs-blacklist.js';

// Initialize wink-pos-tagger (lightweight, no model loading needed)
const tagger = posTagger();

// Verb-like suffixes (excluding 'ing' as previously requested)
const verbLikeSuffixes = ['ate', 'ize', 'ise', 'ify', 'en'];

const hasVerbLikeSuffix = (word) => {
  const lower = word.toLowerCase();
  return verbLikeSuffixes.some(suffix =>
    lower.endsWith(suffix) && lower.length > suffix.length + 2
  );
};

export default (_, options = {}, context) => {
  const results = [];

  const {
    skipBlacklisted = true,
    allowed = [],
    disallowed = [],
  } = options;

  const allowSet = new Set(allowed.map(w => w.toLowerCase()));
  const disallowedSet = new Set(disallowed.map(w => w.toLowerCase()));

  const fullPath = context.path[context.path.length - 1];
  if (!fullPath || typeof fullPath !== 'string') {
    console.log('No valid fullPath found:', context.path);
    return results;
  }

  console.log('\n--- Processing path:', fullPath);

  const segments = fullPath.split('/').filter(Boolean);

  segments.forEach((segment) => {
    if (segment.startsWith('{') && segment.endsWith('}')) {
      console.log(`  Skipping parameter: ${segment}`);
      return;
    }

    console.log(`\n  [PROBABLE] Analyzing segment: "${segment}"`);

    if (skipBlacklisted && isBlacklisted(segment)) {
      console.log(`    Skipped: blacklisted verb (${segment})`);
      return;
    }

    const words = splitIntoWords(segment);
    console.log(`    [PROBABLE] Split into words: [${words.join(', ')}]`);

    let isProbableVerb = false;
    let reason = '';
    let triggerWord = '';

    // 1. POS tagging with wink-pos-tagger: per word
    for (const word of words) {
      if (word.length < 3) continue;

      // Skip if any word matches an allowed noun
      const isAllowedWord = allowSet.has(word.toLowerCase());
      
      if (isAllowedWord) {
        console.log(`    [PROBABLE]   Skipping allowed word: "${word}"`);
      } else {

        try {
          // wink-pos-tagger works on raw strings — returns array of token objects
          const tagged = tagger.tagRawTokens([word]);

          // Extract the Penn Treebank POS tag (e.g., 'VBD', 'VBN', 'VB', 'JJ')
          const posTag = tagged[0]?.pos || 'UNKNOWN';

          console.log(`    [PROBABLE]   Word "${word}" → POS tag: ${posTag}`);

          // Only flag active verb forms:
          // VB  → base/infinitive (create, update)
          // VBP → present non-3rd (create)
          // VBZ → present 3rd (creates)
          // VBG → gerund (creating) — optional, can be noun-like
          //
          // EXCLUDE:
          // VBD → past tense (created, updated) → often adjective
          // VBN → past participle (created, taken) → often adjective
          // JJ  → adjective (updated profile)

          if (['VB', 'VBP', 'VBZ'].includes(posTag)) {
            isProbableVerb = true;
            reason = 'NLP tagged as active verb (VB/VBP/VBZ)';
            triggerWord = word;
            console.log(`    [PROBABLE]   ACTIVE VERB DETECTED: "${word}" (${posTag})`);
            break;
          }

          // Optional: flag gerunds (VBG) if you want to be stricter
          // if (posTag === 'VBG') {
          //   isProbableVerb = true;
          //   reason = 'NLP tagged as gerund (VBG)';
          //   triggerWord = word;
          //   break;
          // }

          if (posTag === 'VBD' || posTag === 'VBN') {
            console.log(`    [PROBABLE]   Skipping past tense/participle: "${word}" (${posTag}) — likely adjective`);
          }

        } catch (err) {
          console.log(`    [PROBABLE]   Tagging error on word "${word}": ${err.message}`);
        }

        // 2. Suffix heuristic fallback (for words not caught by POS)
        if (!isProbableVerb) {
          
          if(disallowedSet.has(word.toLowerCase())) {
            isProbableVerb = true;
            reason = 'disallowed word';
            triggerWord = word;
            console.log(`    [PROBABLE]   DISALLOWED WORD: "${word}"`);
            break;
          }

          if (hasVerbLikeSuffix(word)) {
            isProbableVerb = true;
            reason = 'verb-like suffix';
            triggerWord = word;
            console.log(`    [PROBABLE]   VERB-LIKE SUFFIX FOUND: "${word}"`);
            break;
          }
        }
      }
    }

    if (isProbableVerb) {
      console.log(`    [PROBABLE] PROBABLE VERB DETECTED → ${reason} ("${triggerWord}")`);
      results.push({
        message: `Path segment "${segment}" is likely a verb or action (${reason}: "${triggerWord}"). Prefer nouns for resources.`,
        path: context.path,
      });
    } else {
      console.log(`    [PROBABLE] No probable verb detected`);
    }
  });

  console.log(`\nFinished path "${fullPath}" → ${results.length} warning(s) generated\n`);
  return results;
};