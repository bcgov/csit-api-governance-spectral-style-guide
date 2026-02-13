const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { Spectral } = require('@stoplight/spectral-core');
const { bundleAndLoadRuleset } = require('@stoplight/spectral-ruleset-bundler/with-loader');
const { fetch } = require('@stoplight/spectral-runtime');
const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');

const Severity = {
  Error: 0,
  Warning: 1,
  Info: 2,
  Hint: 3,
};

class BaseSpectralTest {
  constructor(extendsFilePath, rulesetOverrides = '') {
    this.extendsFilePath = extendsFilePath;
    this.rulesetOverrides = rulesetOverrides;
    this.Severity = Severity;
  }

  async setup() {
    if (this.spectral) return;

    const extendsRealPath = path.resolve(
      path.join(__dirname, '../../../../', this.extendsFilePath)
    );

    const testRuleset = `
extends:
  - ${extendsRealPath.replace(/\\/g, '/')}
${this.rulesetOverrides}
`.trim();

    const customFs = {
      promises: {
        async readFile(p, encoding = 'utf8') {
          if (p === '/rules/test-ruleset.yaml') return testRuleset;
          return fsPromises.readFile(p, encoding);
        },
        async stat(p) {
          if (p === '/rules/test-ruleset.yaml') return { isFile: () => true };
          return fsPromises.stat(p);
        },
      },
      readFileSync(p, encoding = 'utf8') {
        if (p === '/rules/test-ruleset.yaml') return testRuleset;
        return fs.readFileSync(p, encoding);
      },
    };

    const ruleset = await bundleAndLoadRuleset('/rules/test-ruleset.yaml', {
      fs: customFs,
      fetch,
    });

    this.spectral = new Spectral();
    await this.spectral.setRuleset(ruleset);
  }

  getSeverityName(value) {
    return Object.keys(this.Severity).find(key => this.Severity[key] === value) ?? 'Unknown';
  }

  yamlPathToString(pathInput) {
    if (pathInput == null) return "<no-path — likely document-level parser/syntax error>";
    if (typeof pathInput === 'string') return pathInput;
    if (!Array.isArray(pathInput)) {
      console.warn("Unexpected path type in Spectral result:", typeof pathInput, pathInput);
      return `<unexpected-path: ${String(pathInput)}>`;
    }
    if (pathInput.length === 0) return "<root>";

    return "/" + pathInput
      .map(segment => String(segment ?? '').replace(/~/g, "~0").replace(/\//g, "~1"))
      .join("/");
  }

  logActualResults(results) {
    results.sort((a, b) => {
      if (a.severity !== b.severity) return a.severity - b.severity;
      if (a.code !== b.code) return a.code.localeCompare(b.code);
      return a.message.localeCompare(b.message);
    });

    let output = `${expect.getState().currentTestName}\nconst actualResults = [\n`;
    for (const result of results) {
      const safePath = this.yamlPathToString(result.path);
      const escapedMessage = (result.message || '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');

      output += `  ['${result.code}', Severity.${this.getSeverityName(result.severity)}, '${escapedMessage}', '${safePath}'],\n`;
    }
    output += "];";
    console.debug(output);
  }

  /**
   * Validates OAS YAML against the Spectral ruleset with per-code strict matching.
   */
  async validateOas({ oasYaml, expected, notExpected }) {
    const safeExpected    = Array.isArray(expected)    ? expected    : [];
    const safeNotExpected = Array.isArray(notExpected) ? notExpected : [];

    await this.setup();

    const document = new Document(oasYaml.trim(), Parsers.Yaml, 'test-oas.yaml');
    const results = await this.spectral.run(document);

    this.logActualResults(results);

    // ── Early validation of expected entries ─────────────────────────────
    safeExpected.forEach((entry, index) => {
      if (!Array.isArray(entry) || entry.length < 4) {
        throw new Error(
          `Invalid 'expected' entry at index ${index}: ` +
          `must be an array of exactly 4 elements [code, severity, message, path]. ` +
          `Received: ${JSON.stringify(entry)}`
        );
      }
      const [code, severity] = entry;
      if (typeof code !== 'string' || code.trim() === '') {
        throw new Error(`Invalid code in expected entry #${index}: must be non-empty string`);
      }
      if (!Number.isInteger(severity) || severity < 0 || severity > 3) {
        throw new Error(`Invalid severity in expected entry #${index}: must be integer 0–3 (got ${severity})`);
      }
    });

    // ── Configuration sanity check ───────────────────────────────────────
    const overlap = safeExpected
      .map(([code]) => code)
      .filter(code => safeNotExpected.includes(code));

    if (overlap.length > 0) {
      throw new Error(
        `Invalid test configuration: codes appear in both 'expected' and 'notExpected':\n` +
        overlap.map(c => `  - ${c}`).join('\n') +
        `\n\nCannot expect and forbid the same code in one test.`
      );
    }

    // ── Group expected violations by code ────────────────────────────────
    const expectedByCode = new Map();
    for (const [code, severity, message, path] of safeExpected) {
      if (!expectedByCode.has(code)) expectedByCode.set(code, []);
      expectedByCode.get(code).push({
        severity,
        message,
        path: this.yamlPathToString(path),
        original: [code, severity, message, path],
      });
    }

    // ── Group actual results by code ─────────────────────────────────────
    const actualByCode = new Map();
    for (const r of results) {
      const code = r.code;
      if (!actualByCode.has(code)) actualByCode.set(code, []);
      actualByCode.get(code).push({
        severity: r.severity,
        message: r.message,
        path: this.yamlPathToString(r.path),
        result: r,
      });
    }

    // ── 1. Enforce forbidden codes ───────────────────────────────────────
    for (const forbiddenCode of safeNotExpected) {
      const actuals = actualByCode.get(forbiddenCode) || [];
      if (actuals.length > 0) {
        const details = actuals
          .map(a => `  - ${a.message} @ ${a.path} (sev ${this.getSeverityName(a.severity)})`)
          .join('\n');
        throw new Error(
          `Forbidden code "${forbiddenCode}" appeared (${actuals.length} times):\n${details || '(no details)'}\n`
        );
      }
    }

    // ── 2. Enforce expected codes ────────────────────────────────────────
    for (const [code, expectations] of expectedByCode) {
      const actuals = actualByCode.get(code) || [];

      const foundExpected = new Set();
      const unmatchedActual = [...actuals];

      for (const exp of expectations) {
        const matching = actuals.filter(a =>
          a.severity === exp.severity &&
          a.message === exp.message &&
          a.path === exp.path
        );

        if (matching.length === 1) {
          foundExpected.add(exp);
          const idx = unmatchedActual.indexOf(matching[0]);
          if (idx !== -1) unmatchedActual.splice(idx, 1);
        }
      }

      const missing = expectations.filter(exp => !foundExpected.has(exp));
      const extra = unmatchedActual;

      if (missing.length === 0 && extra.length === 0) continue;

      let errorMsg = `Mismatch for code "${code}" (expected ${expectations.length}, found ${actuals.length})\n`;

      if (missing.length > 0) {
        errorMsg += `\nMissing expected violations (${missing.length}):\n` +
          missing.map(e => `  - ${e.message} @ ${e.path} (sev ${this.getSeverityName(e.severity)})`).join('\n') + '\n';
      }

      if (extra.length > 0) {
        errorMsg += `\nExtra violations (${extra.length}):\n` +
          extra.map(a => `  - ${a.message} @ ${a.path} (sev ${this.getSeverityName(a.severity)})`).join('\n') + '\n';
      }

      throw new Error(errorMsg.trim());
    }

    // All checks passed
  }
}

module.exports = {
  BaseSpectralTest,
  Severity,
};