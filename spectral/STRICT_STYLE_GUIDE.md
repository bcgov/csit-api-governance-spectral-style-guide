# Strict OpenAPI Style Guide

  

## Basic Warnings elevated to Errors


---

### info-description
#### Severity: <span style="color:red">ERROR</span>

OpenAPI object info description must be present and non-empty string.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### no-eval-in-markdown
#### Severity: <span style="color:red">ERROR</span>

No injecting eval() JavaScript statements
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### no-script-tags-in-markdown
#### Severity: <span style="color:red">ERROR</span>

No injecting script tags
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### openapi-tags-alphabetical
#### Severity: <span style="color:goldenrod">WARN</span>

OpenAPI object should have alphabetical tags.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### openapi-tags-uniqueness
#### Severity: <span style="color:red">ERROR</span>

OpenAPI object must not have duplicated tag names (identifiers).
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### operation-description
#### Severity: <span style="color:red">ERROR</span>

Operation must have a description
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### operation-operationId
#### Severity: <span style="color:red">ERROR</span>

Operation must have an operationId
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### operation-success-response
#### Severity: <span style="color:red">ERROR</span>

Operation must have at least one 2xx or 3xx response.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### path-keys-no-trailing-slash
#### Severity: <span style="color:red">ERROR</span>

Keep trailing slashes off of paths, as it can causes ambiguity.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### array-items
#### Severity: <span style="color:red">ERROR</span>

Schemas with type: array, require a sibling items field.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas3-callbacks-in-callbacks
#### Severity: <span style="color:red">ERROR</span>

A callback should not be defined within another callback.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas3-server-not-example.com
#### Severity: <span style="color:red">ERROR</span>

Server URL should not point to example.com.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas3-server-trailing-slash
#### Severity: <span style="color:red">ERROR</span>

Server URL should not have a trailing slash.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas3-server-variables
#### Severity: <span style="color:red">ERROR</span>

This rule ensures that server variables defined in OpenAPI Specification 3 (OAS3) and 3.1 are valid, not unused, and result in a valid URL.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas3-valid-media-example
#### Severity: <span style="color:red">ERROR</span>

Examples must be valid against their defined schema. This rule is applied to Media Type objects.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas3-valid-schema-example
#### Severity: <span style="color:red">ERROR</span>

Examples must be valid against their defined schema. This rule is applied to Schema objects.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas3_1-callbacks-in-webhook
#### Severity: <span style="color:red">ERROR</span>

Callbacks should not be defined in a webhook.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas3_1-servers-in-webhook
#### Severity: <span style="color:red">ERROR</span>

Servers should not be defined in a webhook.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### operation-id-camel-case
#### Severity: <span style="color:red">ERROR</span>

operationId: camelCase
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### path-segments-kebab-case
#### Severity: <span style="color:red">ERROR</span>

Path segments: kebab-case (lowercase with hyphens)
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### path-param-camel-case
#### Severity: <span style="color:red">ERROR</span>

Path parameters: camelCase
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### query-param-camel-case
#### Severity: <span style="color:red">ERROR</span>

Query parameters: camelCase
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### schema-property-camel-case
#### Severity: <span style="color:red">ERROR</span>

Schema properties (JSON payload fields): camelCase
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### no-empty-property-names
#### Severity: <span style="color:red">ERROR</span>

Schema properties: No empty string property names
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### operation-summary
#### Severity: <span style="color:red">ERROR</span>

Every operation must have a summary (short one-line overview)
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas3-parameter-description
#### Severity: <span style="color:red">ERROR</span>

Parameter objects should have a description.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### oas2-require-openapi-3
#### Severity: <span style="color:red">ERROR</span>

Enforce OpenAPI 3.x only (no Swagger 2.0)
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### path-segments-no-verbs-blacklist
#### Severity: <span style="color:red">ERROR</span>

Strict enforcement: known verb anti-patterns
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

## Recommended Content


---

### openapi-tags
#### Severity: <span style="color:goldenrod">WARN</span>

OpenAPI object should have non-empty tags array.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### operation-singular-tag
#### Severity: <span style="color:goldenrod">WARN</span>

Use just one tag for an operation
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### operation-tag-defined
#### Severity: <span style="color:goldenrod">WARN</span>

Operation should have non-empty tags array.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### operation-tags
#### Severity: <span style="color:goldenrod">WARN</span>

Operation tags should be defined in global tags.
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---

### path-segments-no-verbs-probable
#### Severity: <span style="color:goldenrod">WARN</span>

Softer guidance: probable verbs detected by NLP
See official [Basic Style Guide](https://github.com/bcgov/csit-api-governance-spectral-style-guide/blob/main/STYLE_GUIDE.md)

---
