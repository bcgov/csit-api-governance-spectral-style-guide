// src/functions/shared-path-helpers.js
// Shared helpers for path verb rules

const blacklistedVerbs = new Set([
  'get', 'create', 'update', 'delete', 'patch', 'put', 'post',
  'list', 'add', 'remove', 'edit', 'view', 'search', 'find',
  'retrieve', 'save', 'modify', 'archive', 'activate', 'deactivate',
  'validate', 'approve', 'reject', 'cancel', 'send', 'run', 'execute',
  'login', 'checkout', 'download', 'sync', 'refresh',
]);

export const splitIntoWords = (segment) => {
  let words = segment.split(/[-_]/);

  words = words.flatMap(word =>
    word.split(/(?=[A-Z])/).filter(Boolean)
  );

  return words
    .map(w => w.toLowerCase())
    .filter(w => w.length > 0);
};

export const isBlacklisted = (segment) => {
  const words = splitIntoWords(segment);

  for (const word of words) {
    if (blacklistedVerbs.has(word)) {
      return true;
    }
  }

  return false;
};
