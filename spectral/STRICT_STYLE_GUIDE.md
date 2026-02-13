# Strict OpenAPI Style Guide

Grok - Add description here

## Basic Warnings elevated to Errors


---

### info-description
#### Severity: <span style="color:red">ERROR</span>

OpenAPI object info description must be present and non-empty string.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#info-description)

---

### no-eval-in-markdown
#### Severity: <span style="color:red">ERROR</span>

No injecting eval() JavaScript statements
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#no-eval-in-markdown)

---

### no-script-tags-in-markdown
#### Severity: <span style="color:red">ERROR</span>

No injecting script tags
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#no-script-tags-in-markdown)

---

### openapi-tags-alphabetical
#### Severity: <span style="color:goldenrod">WARN</span>

OpenAPI object should have alphabetical tags. 
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#openapi-tags-alphabetical)

---

### openapi-tags-uniqueness
#### Severity: <span style="color:red">ERROR</span>

OpenAPI object must not have duplicated tag names (identifiers).
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#openapi-tags-uniqueness)

---

### operation-description
#### Severity: <span style="color:red">ERROR</span>

Operation must have a description
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#operation-description)

---

### operation-operationId
#### Severity: <span style="color:red">ERROR</span>

Operation must have an operationId
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#operation-operationId)

---

### operation-success-response
#### Severity: <span style="color:red">ERROR</span>

Operation must have at least one 2xx or 3xx response.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#operation-success-response)

---

### path-keys-no-trailing-slash
#### Severity: <span style="color:red">ERROR</span>

Keep trailing slashes off of paths, as it can causes ambiguity.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#path-keys-no-trailing-slash)

---

### array-items
#### Severity: <span style="color:red">ERROR</span>

Schemas with type: array, require a sibling items field.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#array-items)

---

### oas3-callbacks-in-callbacks
#### Severity: <span style="color:red">ERROR</span>

A callback should not be defined within another callback.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas3-callbacks-in-callbacks)

---

### oas3-server-not-example.com
#### Severity: <span style="color:red">ERROR</span>

Server URL should not point to example.com.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas3-server-not-example.com)

---

### oas3-server-trailing-slash
#### Severity: <span style="color:red">ERROR</span>

Server URL should not have a trailing slash.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas3-server-trailing-slash)

---

### oas3-server-variables
#### Severity: <span style="color:red">ERROR</span>

This rule ensures that server variables defined in OpenAPI Specification 3 (OAS3) and 3.1 are valid, not unused, and result in a valid URL. 
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas3-server-variables)

---

### oas3-valid-media-example
#### Severity: <span style="color:red">ERROR</span>

Examples must be valid against their defined schema. This rule is applied to Media Type objects.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas3-valid-media-example)

---

### oas3-valid-schema-example
#### Severity: <span style="color:red">ERROR</span>

Examples must be valid against their defined schema. This rule is applied to Schema objects.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas3-valid-schema-example)

---

### oas3_1-callbacks-in-webhook
#### Severity: <span style="color:red">ERROR</span>

Callbacks should not be defined in a webhook.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas3_1-callbacks-in-webhook)

---

### oas3_1-servers-in-webhook
#### Severity: <span style="color:red">ERROR</span>

Servers should not be defined in a webhook.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas3_1-servers-in-webhook)

---

### operation-id-camel-case
#### Severity: <span style="color:red">ERROR</span>

operationId: camelCase
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#operation-id-camel-case)

---

### path-segments-kebab-case
#### Severity: <span style="color:red">ERROR</span>

Path segments: kebab-case (lowercase with hyphens)
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#path-segments-kebab-case)

---

### path-param-camel-case
#### Severity: <span style="color:red">ERROR</span>

Path parameters: camelCase
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#path-param-camel-case)

---

### query-param-camel-case
#### Severity: <span style="color:red">ERROR</span>

Query parameters: camelCase
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#query-param-camel-case)

---

### schema-property-camel-case
#### Severity: <span style="color:red">ERROR</span>

Schema properties (JSON payload fields): camelCase
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#schema-property-camel-case)

---

### no-empty-property-names
#### Severity: <span style="color:red">ERROR</span>

Schema properties: No empty string property names
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#no-empty-property-names)

---

### operation-summary
#### Severity: <span style="color:red">ERROR</span>

Every operation must have a summary (short one-line overview)
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#operation-summary)

---

### oas3-parameter-description
#### Severity: <span style="color:red">ERROR</span>

Parameter objects should have a description.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas3-parameter-description)

---

### oas2-require-openapi-3
#### Severity: <span style="color:red">ERROR</span>

Enforce OpenAPI 3.x only (no Swagger 2.0)
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#oas2-require-openapi-3)

---

### path-segments-no-verbs-blacklist
#### Severity: <span style="color:red">ERROR</span>

Strict enforcement: known verb anti-patterns
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#path-segments-no-verbs-blacklist)

---

## Recommended Content


---

### openapi-tags
#### Severity: <span style="color:goldenrod">WARN</span>

OpenAPI object should have non-empty tags array.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#openapi-tags)

---

### operation-singular-tag
#### Severity: <span style="color:goldenrod">WARN</span>

Use just one tag for an operation
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#operation-singular-tag)

---

### operation-tag-defined
#### Severity: <span style="color:goldenrod">WARN</span>

Operation should have non-empty tags array.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#operation-tag-defined)

---

### operation-tags
#### Severity: <span style="color:goldenrod">WARN</span>

Operation tags should be defined in global tags.
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#operation-tags)

---

### path-segments-no-verbs-probable
#### Severity: <span style="color:goldenrod">WARN</span>

Softer guidance: probable verbs detected by NLP 
See [Basic Style Guide](BASIC_STYLE_GUIDE.md#path-segments-no-verbs-probable)

---
