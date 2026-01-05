const fs = require('fs');
const path = require('path');

const { Spectral, DiagnosticSeverity } = require('@stoplight/spectral-core');
const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');
const { bundleAndLoadRuleset } = require('@stoplight/spectral-ruleset-bundler/with-loader');
const { fetch } = require('@stoplight/spectral-runtime');

global.fail = (message) => { throw new Error(message ?? 'fail() was called'); };

const Severity = {
  Error: 0,
  Warning: 1,
  Info: 2,
  Hint: 3,
};

describe('Spectral Validation Rules', () => {
  let spectral;

  beforeAll(async () => {
    const rulesetFile = path.join(__dirname, '..', '..',  '..', 'spectral', 'strict-ruleset.yaml');
    const ruleset = await bundleAndLoadRuleset(rulesetFile, { fs, fetch });
    spectral = new Spectral();
    await spectral.setRuleset(ruleset);
  });

  test('should fail validation for verbs in paths', async () => {
    const oasFile = path.join(__dirname, '..', 'resources', 'strict', 'verbs', 'invalid.yaml');
    const source = fs.readFileSync(oasFile, 'utf8');
    const document = new Document(source, Parsers.Yaml, oasFile);
    const results = await spectral.run(document);

    const expectedResults = [       
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "checkout-cart" contains blacklisted verb "checkout". Use nouns only.', '/paths/~1carts~1{id}~1checkout-cart'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "create_user" contains blacklisted verb "create". Use nouns only.', '/paths/~1users~1create_user'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "create" contains blacklisted verb "create". Use nouns only.', '/paths/~1users~1create'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "createUser" contains blacklisted verb "create". Use nouns only.', '/paths/~1users~1createUser'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "deleteAccount" contains blacklisted verb "delete". Use nouns only.', '/paths/~1accounts~1{id}~1deleteAccount'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "download-backup" contains blacklisted verb "download". Use nouns only.', '/paths/~1backups~1{id}~1download-backup'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "downloadBackup" contains blacklisted verb "download". Use nouns only.', '/paths/~1backups~1{id}~1downloadBackup'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "DownloadBackup" contains blacklisted verb "download". Use nouns only.', '/paths/~1backups~1{id}~1DownloadBackup'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "force_sync" contains blacklisted verb "sync". Use nouns only.', '/paths/~1caches~1force_sync'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "login_user" contains blacklisted verb "login". Use nouns only.', '/paths/~1sessions~1login_user'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "refresh_cache" contains blacklisted verb "refresh". Use nouns only.', '/paths/~1tokens~1refresh_cache'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "update-profile" contains blacklisted verb "update". Use nouns only.', '/paths/~1profiles~1{id}~1update-profile'],
      ['path-segments-no-verbs-blacklist', Severity.Error, 'Path segment "updateProfile" contains blacklisted verb "update". Use nouns only.', '/paths/~1profiles~1{id}~1updateProfile'],
      ['path-segments-no-verbs-probable', Severity.Warning, 'Path segment "calculate-total" is likely a verb or action (NLP tagged as active verb (VB/VBP/VBZ): "calculate"). Prefer nouns for resources.', '/paths/~1orders~1{id}~1calculate-total'],
      ['path-segments-no-verbs-probable', Severity.Warning, 'Path segment "generate_pdf" is likely a verb or action (NLP tagged as active verb (VB/VBP/VBZ): "generate"). Prefer nouns for resources.', '/paths/~1invoices~1{id}~1generate_pdf'],
      ['path-segments-no-verbs-probable', Severity.Warning, 'Path segment "renderPreview" is likely a verb or action (NLP tagged as active verb (VB/VBP/VBZ): "render"). Prefer nouns for resources.', '/paths/~1documents~1{id}~1renderPreview'],
      ['path-segments-no-verbs-probable', Severity.Warning, 'Path segment "start-processing" is likely a verb or action (NLP tagged as active verb (VB/VBP/VBZ): "start"). Prefer nouns for resources.', '/paths/~1jobs~1{id}~1start-processing'],
      ['path-segments-no-verbs-probable', Severity.Warning, 'Path segment "startProcessing" is likely a verb or action (NLP tagged as active verb (VB/VBP/VBZ): "start"). Prefer nouns for resources.', '/paths/~1jobs~1{id}~1startProcessing'],
      ['path-segments-no-verbs-probable', Severity.Warning, 'Path segment "synchronize" is likely a verb or action (verb-like suffix: "synchronize"). Prefer nouns for resources.', '/paths/~1caches~1synchronize'],
      ['path-segments-no-verbs-probable', Severity.Warning, 'Path segment "triggerExport" is likely a verb or action (NLP tagged as active verb (VB/VBP/VBZ): "trigger"). Prefer nouns for resources.', '/paths/~1reports~1{id}~1triggerExport'],
    ];

    logActualResults(results);

    expect(results).toHaveLength(expectedResults.length);

    for (const expectedResult of expectedResults) {
      
      const result = results.find(r => r.code === expectedResult[0] && r.message === expectedResult[2] && (expectedResult.length < 4 || expectedResult[3] == yamlPathToString(r.path)));
      if (result) {
        expect(getSeverityName(result.severity)).toBe(getSeverityName(expectedResult[1]));
      } else {

        fail("Expected to find result: code: " + expectedResult[0] + " msg: '" + expectedResult[2] + "' path: '" + expectedResult[3] + "'");
      }
    }
  });

  test('should pass validation for verbs in paths', async () => {
    const oasFile = path.join(__dirname, '..', 'resources', 'strict', 'verbs', 'valid.yaml');
    const source = fs.readFileSync(oasFile, 'utf8');
    const document = new Document(source, Parsers.Yaml, oasFile);
    const results = await spectral.run(document);

    const expectedResults = [
      ['path-segments-no-verbs-probable', Severity.Warning, 'Path segment "import-file" is likely a verb or action (disallowed word: "import"). Prefer nouns for resources.', '/paths/~1uploads~1import-file'],
      ['path-segments-no-verbs-probable', Severity.Warning, 'Path segment "totals" is likely a verb or action (NLP tagged as active verb (VB/VBP/VBZ): "totals"). Prefer nouns for resources.', '/paths/~1orders~1{id}~1totals'],
    ];

    logActualResults(results);

    expect(results).toHaveLength(expectedResults.length);

    for (const expectedResult of expectedResults) {
      
      const result = results.find(r => r.code === expectedResult[0] && r.message === expectedResult[2] && (expectedResult.length < 4 || expectedResult[3] == yamlPathToString(r.path)));
      if (result) {
        expect(getSeverityName(result.severity)).toBe(getSeverityName(expectedResult[1]));
      } else {

        fail("Expected to find result: code: " + expectedResult[0] + " msg: '" + expectedResult[2] + "' path: '" + expectedResult[3] + "'");
      }
    }
  });
  
  function getSeverityName(value) {
    return Object.keys(Severity).find(key => Severity[key] === value) ?? 'Unknown';
  }

  function yamlPathToString(pathArray) {
    if (!pathArray || pathArray.length === 0) return "<root>";

    return (
      "/" +
      pathArray
        .map(segment =>
          String(segment)
            .replace(/~/g, "~0")
            .replace(/\//g, "~1")
        )
        .join("/")
    );
  }

  function logActualResults(results) {

    results.sort((a, b) => {
      if (a.severity !== b.severity) {
        return a.severity - b.severity;
      }
      if (a.code !== b.code) {
        return a.code.localeCompare(b.code);
      }
      return a.message.localeCompare(b.message); 
    });

    let actualResults = expect.getState().currentTestName + "\nconst actualResults = [\n";
    for (const result of results) {

      const message = result.message
        .replace(/\\/g, '\\\\')   // escape backslashes first
        .replace(/'/g, "\\'")     // escape single quotes
        .replace(/\n/g, '\\n')    // optional: escape newlines
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\f/g, '\\f')
        .replace(/\v/g, '\\v')
        .replace(/\0/g, '\\0');

      actualResults += "  ['" + result.code + "', Severity."+getSeverityName(result.severity)+", '" + message + "', '" + yamlPathToString(result.path) + "'],\n";
    }
    actualResults += "];"
    console.debug(actualResults);
  }
});