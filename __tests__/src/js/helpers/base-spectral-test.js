const { Volume } = require('memfs');
const { Spectral } = require('@stoplight/spectral-core');
const { bundleAndLoadRuleset } = require('@stoplight/spectral-ruleset-bundler/with-loader');
const { fetch } = require('@stoplight/spectral-runtime');
const fs = require('fs');
const path = require('path');
const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');

const Severity = {
  Error: 0,
  Warning: 1,
  Info: 2,
  Hint: 3,
};

/**
 * Base class for Jest tests that validate OpenAPI/Swagger documents against Spectral rulesets.
 *
 * This class provides:
 * - Automatic setup of a virtual in-memory filesystem using `memfs`
 * - Bundling and loading of a test ruleset that `extends` a base ruleset file
 * - Convenient validation of OAS YAML content against the loaded ruleset
 * - Strict checking of **exactly** the expected violations (while ignoring new/unrelated rules)
 * - Helper to log actual results in a copy-paste friendly format for easy test updating
 * - Safe handling of parser (YAML syntax) errors — fails only on unexpected ones
 *
 * Main usage pattern in child test classes:
 *
 * ```js
 * class OperationIdTest extends BaseSpectralTest {
 *   constructor() {
 *     super('spectral/basic-ruleset.yaml');
 *   }
 *
 *   it('rejects snake_case operationIds', async () => {
 *     await this.validateOas({
 *       oasYaml: `
 *         openapi: 3.0.3
 *         paths:
 *           /users:
 *             get:
 *               operationId: list_all_users
 *       `,
 *       expected: [
 *         ['operation-id-camel-case', Severity.Error, 'should be camelCase', '/paths/~1users/get/operationId'],
 *       ]
 *     });
 *   });
 * }
 * ```
 *
 * @important
 * - The class is designed so that **adding new rules to the base/extended ruleset will not break existing tests**
 *   unless those new rules produce violations on the test documents — only explicitly listed `expected` violations are enforced.
 * - Parser/syntax errors cause failure **unless** they are deliberately included in the `expected` array.
 * - All expected violations must match **exactly once**. Extra or missing matches fail the test.
 *
 * @see {@link validateOas} — the primary method used in test cases
 * @see {@link logActualResults} — helpful when updating/creating new tests
 */
class BaseSpectralTest {
  constructor(extendsFilePath, rulesetOverrides = '') {
    this.extendsFilePath = extendsFilePath;
    this.testRuleset = `
extends:
  - ./extended-ruleset.yaml
${rulesetOverrides}
`.trim();

    this.Severity = {
      Error: 0,
      Warning: 1,
      Info: 2,
      Hint: 3,
    };
  }

  async setup() {
    if (this.spectral) return;

    const basicRulesetContent = fs.readFileSync(
      path.join(__dirname, '../../../../', this.extendsFilePath),
      'utf8'
    );

    const vol = Volume.fromJSON({
      '/rules/test-ruleset.yaml': this.testRuleset,
      '/rules/extended-ruleset.yaml': basicRulesetContent,
    });

    const virtualFs = {
      promises: vol.promises,
      readFileSync: (p) => vol.readFileSync(p),
    };

    const ruleset = await bundleAndLoadRuleset('/rules/test-ruleset.yaml', {
      fs: virtualFs,
      fetch,
    });

    this.spectral = new Spectral();
    await this.spectral.setRuleset(ruleset);
  }

  getSeverityName(value) {
    return Object.keys(this.Severity).find(key => this.Severity[key] === value) ?? 'Unknown';
  }

  yamlPathToString(pathArray) {
    if (!pathArray || pathArray.length === 0) return "<root>";
    return "/" + pathArray
      .map(segment => String(segment).replace(/~/g, "~0").replace(/\//g, "~1"))
      .join("/");
  }

  logActualResults(results) {
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
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\f/g, '\\f')
        .replace(/\v/g, '\\v')
        .replace(/\0/g, '\\0');

      actualResults += "  ['" + result.code + "', Severity."+this.getSeverityName(result.severity)+", '" + message + "', '" + this.yamlPathToString(result.path) + "'],\n";
    }
    actualResults += "];"
    console.debug(actualResults);
  }

  /**
   * Validates the provided OAS YAML against the loaded Spectral ruleset.
   *
   * - Any 'parser' errors in the results (e.g. YAML syntax issues) will cause the test to fail,
   *   unless they are explicitly listed in the `expected` array.
   * - All violations listed in the `expected` array must appear **exactly once** in the results,
   *   or the test will fail.
   * - Any other validation errors (non-parser or unlisted) are ignored and will not fail the test.
   * 
   * This will allow the test to continue to pass even as new rules are added to the extended Spectral
   * ruleset while at the same time ensuring that the provided OAS YAML is well formed.
   *
   * @param {Object} options - Validation options
   * @param {string} options.oasYaml - The OAS YAML content as a string
   * @param {Array<Array>} [options.expected=[]] - Array of expected violations.
   *   Each entry: `[code, severity, messagePart, yamlPath]`
   * @throws {Error} If unexpected parser errors occur or expected violations are not exactly matched
   * @async
   */
  async validateOas({ oasYaml, expected}) {
    await this.beforeAll();

    const document = new Document(oasYaml.trim(), Parsers.Yaml, 'test-oas.yaml');
    const results = await this.spectral.run(document);

    this.logActualResults(results);

    const parserErrors = results.filter(r => r.code === 'parser');
    const expectedParserCodes = expected
      .filter(e => e[0] === 'parser')
      .map(e => ({ message: e[2], path: e[3] }));

    const unexpectedParserErrors = parserErrors.filter(r =>
      !expectedParserCodes.some(exp =>
        r.message == exp.message &&
        this.yamlPathToString(r.path) === exp.path
      )
    );

    if (unexpectedParserErrors.length > 0) {
      fail(`Test failed due to unexpected parser error(s):\n` +
        unexpectedParserErrors.map(r =>
          `  - ${r.message} @ ${this.yamlPathToString(r.path)}`
        ).join('\n')
      );
    }

    for (const [code, expectedSeverity, expectedMessage, yamlPath] of expected) {
      const matches = results.filter(r =>
        r.code === code &&
        r.message == expectedMessage &&
        this.yamlPathToString(r.path) === yamlPath &&
        r.severity === expectedSeverity
      );

      expect(matches).toHaveLength(
        1,
        `Test failed - Expected exactly ONE occurrence of:\n` +
        `  code: ${code}\n` +
        `  severity: ${this.getSeverityName(expectedSeverity)}\n` +
        `  message contains: "${expectedMessage}"\n` +
        `  path: ${yamlPath}\n\n` +
        `Found ${matches.length} instead.`
      );
    }
  }
}

module.exports = {
  BaseSpectralTest,
  Severity
};