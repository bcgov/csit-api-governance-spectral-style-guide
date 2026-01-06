# csit-api-governance-spectral-style-guide

This repository provides a **style guide** for developing REST APIs and a Spectral ruleset that can be used to provide guidance and enforce 
adherence.

A markdown formatted version of the style guide can be found in STYLE_GUIDE.md in the root of the repository.  

The **style guide** builds on Spectral's built-in OAS ruleset which can be found here:
```
https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules
```

The Spectral ruleset file can be found here:

```
https://raw.githubusercontent.com/bcgov/csit-api-governance-spectral-style-guide/spectral/basic-ruleset.yaml
```

This ruleset is intended to be reused across API projects and tooling to ensure consistent API governance and linting behavior.

Below are the supported ways to reference and consume this ruleset.  Additional information can be found by referencing [Stoplight Spectral documentation](https://stoplight.io/open-source/spectral).

---

## 1. Referencing the Ruleset from an API’s Default Ruleset File

Most API projects define a local Spectral ruleset (for example `.spectral.yaml`) that can extend one or more shared rulesets.

You can reference the shared ruleset using Spectral’s `extends` mechanism.

### Example: `.spectral.yaml`

```yaml
extends:
  - https://raw.githubusercontent.com/bcgov/csit-api-governance-spectral-style-guide/spectral/basic-ruleset.yaml
```

### Notes

* Multiple rulesets can be combined by adding additional entries under `extends`.
* Local rules can still be added or overridden in the API-specific ruleset file.

---

## 2. Using the Ruleset with the VS Code Spectral Plugin

The VS Code Spectral extension can be configured to use a custom ruleset file.

### Steps

1. Install the **Spectral** extension from the VS Code Marketplace.
2. Open your workspace containing this repository.
3. Configure the Spectral ruleset path in your workspace settings.

### Example: `.vscode/settings.json`

```json
{
  "spectral.rulesetFile": "https://raw.githubusercontent.com/bcgov/csit-api-governance-spectral-style-guide/spectral/basic-ruleset.yaml"
}
```

### Notes

* If your API project has its own `.spectral.yaml`, that file can `extends` the shared ruleset instead.
* Changes to the ruleset are picked up automatically when the file is saved.

---

## 3. Using the Ruleset with the IntelliJ Spectral Plugin

The IntelliJ Spectral plugin (for IntelliJ IDEA and other JetBrains IDEs) also supports custom ruleset files.

### Steps

1. Install the **Spectral** plugin from *Settings → Plugins*.
2. Open the project containing this repository.
3. Open *Settings → Tools → Spectral*.
4. Set the **Ruleset file** to point to the shared ruleset:

```
https://raw.githubusercontent.com/bcgov/csit-api-governance-spectral-style-guide/spectral/basic-ruleset.yaml
```

### Alternative: Project Ruleset

If your project already uses a local `.spectral.yaml`, configure that file in IntelliJ instead, and have it extend the shared ruleset:

```yaml
extends:
  - https://raw.githubusercontent.com/bcgov/csit-api-governance-spectral-style-guide/spectral/basic-ruleset.yaml
```

### Notes

* IntelliJ will re-run Spectral automatically when supported API files change.

---

## Summary

| Use Case                      | Recommended Approach                                             |
| ----------------------------- | ---------------------------------------------------------------- |
| Shared governance across APIs | Extend `basic-ruleset.yaml` from a local ruleset                 |
| VS Code users                 | Configure `spectral.rulesetFile` or extend from `.spectral.yaml` |
| IntelliJ users                | Point plugin to the ruleset or extend from a project ruleset     |

By centralizing common rules in `/spectral/basic-ruleset.yaml`, teams can enforce consistent API standards while still allowing project-specific customization.

## Running Spectral on the CLI

Example ```
npx @stoplight/spectral-cli lint __tests__/src/resources/strict/verbs/invalid.yaml --ruleset spectral/strict-ruleset.yaml --verbose
```
