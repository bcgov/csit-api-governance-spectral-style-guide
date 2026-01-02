# Basic OpenAPI Style Guide

This Spectral ruleset enforces a clean, consistent, and modern OpenAPI (OAS 2 and OAS 3) style focused on developer experience and code-generation friendliness.  
Key conventions enforced:  
operationId: camelCase (starting with lowercase, alphanumeric only)  
Static path segments: kebab-case (lowercase letters, numbers, and hyphens only)  
Path and query parameter names: camelCase  
Schema property names (request/response bodies): camelCase  
No empty property names in schemas  
In addition to these custom naming rules, it includes a comprehensive set of Spectral’s built-in oas rules covering:  
Structural validity and well-formedness (e.g., unique operationIds, proper $ref usage, correct path parameter declarations)  
Prevention of common mistakes (e.g., duplicated enum values, invalid examples, misplaced query strings in paths)  
Recommended best practices as warnings (e.g., requiring info description, operation descriptions, success responses, avoiding trailing slashes, example.com hosts, and unused components)  
This ruleset encourages code-friendly identifiers (operationIds, parameters, payload fields) while using kebab-case for URL paths, aligning with widely adopted practices in JavaScript/TypeScript ecosystems and major API style guides.  

## Well-formedness rules

This is the description for the section.  

---

### duplicated-entry-in-enum
#### Severity: <span style="color:red">ERROR</span>

Each value of an enum must be different from one another.

**Valid example:**
```yaml
components:
  schemas:
    Status:
      type: string
      enum: [active, inactive, pending]
```

**Invalid example:**
```yaml
components:
  schemas:
    Status:
      type: string
      enum: [active, inactive, active]
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### no-$ref-siblings
#### Severity: <span style="color:red">ERROR</span>

$ref siblings are ignored before 3.1.0

**Valid example:**
```yaml
components:
  schemas:
    User:
      $ref: '#/components/schemas/UserRef'
```

**Invalid example:**
```yaml
components:
  schemas:
    User:
      $ref: '#/components/schemas/UserRef'
      type: object
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-operationId-unique
#### Severity: <span style="color:red">ERROR</span>

Every operation must have a unique operationId.

**Valid example:**
```yaml
paths:
  /users:
    get:
      operationId: listUsers
  /admins:
    get:
      operationId: listAdmins
```

**Invalid example:**
```yaml
paths:
  /users:
    get:
      operationId: listUsers
  /admins:
    get:
      operationId: listUsers
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-operationId-valid-in-url
#### Severity: <span style="color:red">ERROR</span>

Operation ID must avoid non-URL-safe characters

**Valid example:**
```yaml
paths:
  /users:
    get:
      operationId: listUsers_v2
```

**Invalid example (space):**
```yaml
paths:
  /users:
    get:
      operationId: list Users
```

**Invalid example (bracket):**
```yaml
paths:
  /users:
    get:
      operationId: list<Users
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-parameters
#### Severity: <span style="color:red">ERROR</span>

Operation parameters are unique and non-repeating
1. Operation must have unique name + in parameters.
2. Operation cannot have both in: body and in: formData parameters. (OpenAPI v2.0)
3. Operation must have only one in: body parameter. (OpenAPI v2.0)

**Valid example:**
```yaml
paths:
  /users/{id}:
    get:
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
```

**Invalid example (duplicate):**
```yaml
paths:
  /users:
    get:
      parameters:
        - name: page
          in: query
        - name: page
          in: query
```

**Invalid example (body and formData in OAS2):**
```yaml
swagger: '2.0'
paths:
  /users:
    post:
      parameters:
        - name: payload
          in: body
          schema:
            type: object
        - name: file
          in: formData
          type: file
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### path-declarations-must-exist
#### Severity: <span style="color:red">ERROR</span>

Path parameter declarations cannot be empty, ex./given/{} is invalid.

**Valid example:**
```yaml
paths:
  /users/{userId}:
    get:
      operationId: getUser
```

**Invalid example:**
```yaml
paths:
  /users/{}:
    get:
      operationId: getUser
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### path-not-include-query
#### Severity: <span style="color:red">ERROR</span>

Don't put query string items in the path, they belong in parameters.

**Valid example:**
```yaml
paths:
  /users:
    get:
      parameters:
        - name: active
          in: query
          schema:
            type: boolean
```

**Invalid example:**
```yaml
paths:
  /users?active=true:
    get:
      operationId: listActiveUsers
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### path-params
#### Severity: <span style="color:red">ERROR</span>

Path parameters are correct and valid.
1. For every parameter referenced in the path string (i.e: /users/{userId}), the parameter must be defined in either path.parameters,
   or operation.parameters objects (non-standard HTTP operations will be silently ignored.)
2. Every path.parameters and operation.parameters parameter must be used in the path string.

**Valid example:**
```yaml
paths:
  /users/{userId}:
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
    get:
      operationId: getUser
```

**Invalid example (not defined):**
```yaml
paths:
  /users/{userId}:
    get:
      operationId: getUser
```

**Invalid example (not used):**
```yaml
paths:
  /users:
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
    get:
      operationId: getUser
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### typed-enum
#### Severity: <span style="color:red">ERROR</span>

Enum values should respect the type specifier.

**Valid example:**
```yaml
components:
  schemas:
    Size:
      type: string
      enum: [small, medium, large]
```

**Invalid example:**
```yaml
components:
  schemas:
    Code:
      type: string
      enum: [200, 404, 500]
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-anyOf
#### Severity: <span style="color:red">ERROR</span>

OpenAPI v3 keyword anyOf detected in OpenAPI v2 document.

**Valid example:**
```yaml
swagger: '2.0'
info:
  title: API
  version: 1.0.0
```

**Invalid example:**
```yaml
swagger: '2.0'
components:
  schemas:
    Pet:
      anyOf:
        - $ref: '#/components/schemas/Cat'
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-oneOf
#### Severity: <span style="color:red">ERROR</span>

OpenAPI v3 keyword oneOf detected in OpenAPI v2 document.

**Valid example:**
```yaml
swagger: '2.0'
info:
  title: API
  version: 1.0.0
```

**Invalid example:**
```yaml
swagger: '2.0'
components:
  schemas:
    Response:
      oneOf:
        - $ref: '#/components/schemas/Success'
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-schema
#### Severity: <span style="color:red">ERROR</span>

Validate structure of OpenAPI v2 specification.

**Valid example:**
```yaml
swagger: '2.0'
info:
  title: Test
  version: '1.0'
paths: {}
```

**Invalid example:**
```yaml
swagger: '2.0'
info:
  version: '1.0'
paths: {}
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-examples-value-or-externalValue
#### Severity: <span style="color:red">ERROR</span>

Examples for requestBody or response examples can have an externalValue or a value, but they cannot have both.

**Valid example:**
```yaml
components:
  responses:
    UserResponse:
      content:
        application/json:
          example:
            value:
              id: 123
```

**Invalid example:**
```yaml
components:
  responses:
    UserResponse:
      content:
        application/json:
          example:
            value:
              id: 123
            externalValue: 'https://example.com/example.json'
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-operation-security-defined
#### Severity: <span style="color:red">ERROR</span>

Operation security values must match a scheme defined in the components.securitySchemes object.

**Valid example:**
```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
paths:
  /admin:
    get:
      security:
        - bearerAuth: []
```

**Invalid example:**
```yaml
components:
  securitySchemes:
    apiKey:
      type: apiKey
paths:
  /admin:
    get:
      security:
        - bearerAuth: []
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-schema
#### Severity: <span style="color:red">ERROR</span>

Validate structure of OpenAPI v3 specification.

**Valid example:**
```yaml
openapi: 3.0.3
info:
  title: Test API
  version: 1.0.0
paths: {}
```

**Invalid example:**
```yaml
openapi: 3.0.3
info:
  version: 1.0.0
paths: {}
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

## Required Content


---

## Recommended Content


---

### info-description
#### Severity: <span style="color:goldenrod">WARN</span>

OpenAPI object info description must be present and non-empty string.

**Valid example:**
```yaml
info:
  title: My API
  description: A description of my API
  version: 1.0.0
```

**Invalid example:**
```yaml
info:
  title: My API
  version: 1.0.0
```

**Invalid example (empty):**
```yaml
info:
  title: My API
  description: ""
  version: 1.0.0
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### no-eval-in-markdown
#### Severity: <span style="color:goldenrod">WARN</span>

No injecting eval() JavaScript statements

**Valid example:**
```yaml
info:
  description: Safe text.
```

**Invalid example:**
```yaml
info:
  description: "Use eval(`dangerous`)."
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### no-script-tags-in-markdown
#### Severity: <span style="color:goldenrod">WARN</span>

No injecting script tags

**Valid example:**
```yaml
info:
  description: Regular text.
```

**Invalid example:**
```yaml
info:
  description: <script>alert()</script>
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### openapi-tags-alphabetical
#### Severity: <span style="color:goldenrod">WARN</span>

OpenAPI object should have alphabetical tags.

**Valid example:**
```yaml
tags:
  - name: admins
  - name: users
```

**Invalid example:**
```yaml
tags:
  - name: users
  - name: admins
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### openapi-tags-uniqueness
#### Severity: <span style="color:goldenrod">WARN</span>

OpenAPI object must not have duplicated tag names (identifiers).

**Valid example:**
```yaml
tags:
  - name: users
  - name: admins
```

**Invalid example:**
```yaml
tags:
  - name: users
  - name: users
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-description
#### Severity: <span style="color:goldenrod">WARN</span>

Operation must have a description

**Valid example:**
```yaml
paths:
  /users:
    get:
      description: List all users
```

**Invalid example:**
```yaml
paths:
  /users:
    get:
      summary: List users
```

**Invalid example (empty):**
```yaml
paths:
  /users:
    get:
      description: ""
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-operationId
#### Severity: <span style="color:goldenrod">WARN</span>

Operation must have an operationId

**Valid example:**
```yaml
paths:
  /users:
    get:
      operationId: listUsers
```

**Invalid example:**
```yaml
paths:
  /users:
    get:
      summary: List users
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-success-response
#### Severity: <span style="color:goldenrod">WARN</span>

Operation must have at least one 2xx or 3xx response.

**Valid example:**
```yaml
paths:
  /users:
    get:
      responses:
        '200':
          description: OK
```

**Invalid example:**
```yaml
paths:
  /users:
    get:
      responses:
        '400':
          description: Bad Request
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### path-keys-no-trailing-slash
#### Severity: <span style="color:goldenrod">WARN</span>

Keep trailing slashes off of paths, as it can causes ambiguity.

**Valid example:**
```yaml
paths:
  /users:
    get:
      operationId: listUsers
```

**Invalid example:**
```yaml
paths:
  /users/:
    get:
      operationId: listUsers
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### array-items
#### Severity: <span style="color:goldenrod">WARN</span>

Schemas with type: array, require a sibling items field.

**Valid example:**
```yaml
components:
  schemas:
    UserList:
      type: array
      items:
        type: string
```

**Invalid example:**
```yaml
components:
  schemas:
    UserList:
      type: array
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-api-host
#### Severity: <span style="color:goldenrod">WARN</span>

OpenAPI host must be present and non-empty string.

**Valid example:**
```yaml
swagger: '2.0'
host: example.com
```

**Invalid example (missing):**
```yaml
swagger: '2.0'
```

**Invalid example (empty):**
```yaml
swagger: '2.0'
host: ""
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-api-schemes
#### Severity: <span style="color:goldenrod">WARN</span>

OpenAPI host schemes must be present and non-empty array.

**Valid example:**
```yaml
swagger: '2.0'
schemes:
  - https
```

**Invalid example (missing):**
```yaml
swagger: '2.0'
```

**Invalid example (empty):**
```yaml
swagger: '2.0'
schemes: []
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-discriminator
#### Severity: <span style="color:goldenrod">WARN</span>

The discriminator property MUST be defined at this schema and it MUST be in the required property list.

**Valid example:**
```yaml
swagger: '2.0'
definitions:
  Pet:
    discriminator: petType
    properties:
      petType:
        type: string
    required:
      - petType
```

**Invalid example:**
```yaml
swagger: '2.0'
definitions:
  Pet:
    discriminator: petType
    properties:
      petType:
        type: string
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-host-not-example
#### Severity: <span style="color:goldenrod">WARN</span>

Server URL should not point to example.com.

**Valid example:**
```yaml
swagger: '2.0'
host: api.com
```

**Invalid example:**
```yaml
swagger: '2.0'
host: example.com
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-host-trailing-slash
#### Severity: <span style="color:goldenrod">WARN</span>

Server URL should not have a trailing slash.

**Valid example:**
```yaml
swagger: '2.0'
host: api.com
```

**Invalid example:**
```yaml
swagger: '2.0'
host: api.com/
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-operation-formData-consume-check
#### Severity: <span style="color:goldenrod">WARN</span>

Operations with an in: formData parameter must include application/x-www-form-urlencoded or multipart/form-data in their consumes property.

**Valid example:**
```yaml
swagger: '2.0'
paths:
  /upload:
    post:
      consumes:
        - multipart/form-data
      parameters:
        - name: file
          in: formData
          type: file
```

**Invalid example:**
```yaml
swagger: '2.0'
paths:
  /upload:
    post:
      parameters:
        - name: file
          in: formData
          type: file
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-operation-security-defined
#### Severity: <span style="color:goldenrod">WARN</span>

Operation security values must match a scheme defined in the securityDefinitions object.

**Valid example:**
```yaml
swagger: '2.0'
securityDefinitions:
  bearerAuth:
    type: basic
paths:
  /admin:
    get:
      security:
        - bearerAuth: []
```

**Invalid example:**
```yaml
swagger: '2.0'
securityDefinitions:
  apiKey:
    type: apiKey
paths:
  /admin:
    get:
      security:
        - bearerAuth: []
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-unused-definition
#### Severity: <span style="color:goldenrod">WARN</span>

Potential unused reusable definition entry has been detected.

**Valid example:**
```yaml
swagger: '2.0'
definitions:
  User:
    type: object
paths:
  /users:
    get:
      responses:
        '200':
          schema:
            $ref: '#/definitions/User'
```

**Invalid example:**
```yaml
swagger: '2.0'
definitions:
  User:
    type: object
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-valid-media-example
#### Severity: <span style="color:goldenrod">WARN</span>

Examples must be valid against their defined schema.  This rule is applied to Media Type objects.
Common reasons you may see errors are:
The value used for property examples is not the same type indicated in the schema (string vs. integer, for example).
Examples contain properties not included in the schema.

**Valid example:**
```yaml
swagger: '2.0'
paths:
  /users:
    get:
      produces:
        - application/json
      responses:
        '200':
          schema:
            type: object
            properties:
              id:
                type: integer
          examples:
            application/json:
              id: 1
```

**Invalid example:**
```yaml
swagger: '2.0'
paths:
  /users:
    get:
      produces:
        - application/json
      responses:
        '200':
          schema:
            type: object
            properties:
              id:
                type: integer
          examples:
            application/json:
              id: "one"
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-valid-schema-example
#### Severity: <span style="color:goldenrod">WARN</span>

Examples must be valid against their defined schema. This rule is applied to Schema objects.

**Valid example:**
```yaml
swagger: '2.0'
definitions:
  User:
    type: object
    properties:
      id:
        type: integer
    example:
      id: 1
```

**Invalid example:**
```yaml
swagger: '2.0'
definitions:
  User:
    type: object
    properties:
      id:
        type: integer
    example:
      id: "one"
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-callbacks-in-callbacks
#### Severity: <span style="color:goldenrod">WARN</span>

A callback should not be defined within another callback.

**Valid example:**
```yaml
openapi: 3.0.0
paths:
  /webhook:
    post:
      callbacks:
        onData:
          '{$request.body#/callbackUrl}':
            post:
              responses:
                '200':
                  description: OK
```

**Invalid example:**
```yaml
openapi: 3.0.0
paths:
  /webhook:
    post:
      callbacks:
        onData:
          '{$request.body#/callbackUrl}':
            post:
              callbacks:
                nested:
                  '{$request.body#/nestedUrl}':
                    post:
                      responses:
                        '200':
                          description: OK
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-server-not-example.com
#### Severity: <span style="color:goldenrod">WARN</span>

Server URL should not point to example.com.

**Valid example:**
```yaml
openapi: 3.0.0
servers:
  - url: https://api.com
```

**Invalid example:**
```yaml
openapi: 3.0.0
servers:
  - url: https://example.com
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-server-trailing-slash
#### Severity: <span style="color:goldenrod">WARN</span>

Server URL should not have a trailing slash.

**Valid example:**
```yaml
openapi: 3.0.0
servers:
  - url: https://api.com
```

**Invalid example:**
```yaml
openapi: 3.0.0
servers:
  - url: https://api.com/
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-server-variables
#### Severity: <span style="color:goldenrod">WARN</span>

This rule ensures that server variables defined in OpenAPI Specification 3 (OAS3) and 3.1 are valid, not unused, and result in a valid URL.

**Valid example:**
```yaml
openapi: 3.0.0
servers:
  - url: https://{subdomain}.api.com
    variables:
      subdomain:
        default: demo
```

**Invalid example (unused variable):**
```yaml
openapi: 3.0.0
servers:
  - url: https://api.com
    variables:
      subdomain:
        default: demo
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-unused-component
#### Severity: <span style="color:goldenrod">WARN</span>

Potential unused reusable components entry has been detected.

**Valid example:**
```yaml
openapi: 3.0.0
components:
  schemas:
    User:
      type: object
paths:
  /users:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
```

**Invalid example:**
```yaml
openapi: 3.0.0
components:
  schemas:
    User:
      type: object
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-valid-media-example
#### Severity: <span style="color:goldenrod">WARN</span>

Examples must be valid against their defined schema. This rule is applied to Media Type objects.

**Valid example:**
```yaml
openapi: 3.0.0
paths:
  /users:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
              example:
                id: 1
```

**Invalid example:**
```yaml
openapi: 3.0.0
paths:
  /users:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
              example:
                id: "one"
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-valid-schema-example
#### Severity: <span style="color:goldenrod">WARN</span>

Examples must be valid against their defined schema. This rule is applied to Schema objects.

**Valid example:**
```yaml
openapi: 3.0.0
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
      example:
        id: 1
```

**Invalid example:**
```yaml
openapi: 3.0.0
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
      example:
        id: "one"
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3_1-callbacks-in-webhook
#### Severity: <span style="color:goldenrod">WARN</span>

Callbacks should not be defined in a webhook.

**Valid example:**
```yaml
openapi: 3.1.0
webhooks:
  newPet:
    post:
      responses:
        '200':
          description: OK
```

**Invalid example:**
```yaml
openapi: 3.1.0
webhooks:
  newPet:
    post:
      callbacks:
        onData:
          '{$request.body#/callbackUrl}':
            post:
              responses:
                '200':
                  description: OK
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3_1-servers-in-webhook
#### Severity: <span style="color:goldenrod">WARN</span>

Servers should not be defined in a webhook.

**Valid example:**
```yaml
openapi: 3.1.0
webhooks:
  newPet:
    post:
      responses:
        '200':
          description: OK
```

**Invalid example:**
```yaml
openapi: 3.1.0
webhooks:
  newPet:
    post:
      servers:
        - url: https://api.com
      responses:
        '200':
          description: OK
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-parameter-description
#### Severity: <span style="color:goldenrod">WARN</span>

Parameter objects should have a description.

**Valid example:**
```yaml
parameters:
  - name: userId
    in: path
    required: true
    description: The unique identifier of the user
    schema:
      type: string
      format: uuid
```


**Invalid example (missing description):**
```yaml
parameters:
  - name: userId
    in: path
    required: true
    # Missing description
    schema:
      type: string
      format: uuid
```


**Invalid example (empty description):**
```yaml
parameters:
  - name: userId
    in: path
    required: true
    description: ""
    schema:
      type: string
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-id-camel-case
#### Severity: <span style="color:goldenrod">WARN</span>

operationId: camelCase
CamelCase is the most widely adopted convention for operationId across major API providers
and SDK generators. It maps naturally to method names in JavaScript/TypeScript, Java, C#, etc.
Starting with a lowercase letter avoids conflicts and follows the official OpenAPI Petstore examples.

**Valid example:**
```yaml
paths:
  /users:
    get:
      operationId: listUsers
```

**Invalid example (uppercase start):**
```yaml
paths:
  /users:
    get:
      operationId: ListUsers
```

**Invalid example (hyphen):**
```yaml
paths:
  /users:
    get:
      operationId: list-users
```

---

### path-segments-kebab-case
#### Severity: <span style="color:goldenrod">WARN</span>

Path segments: kebab-case (lowercase with hyphens)
Industry consensus (Google, Microsoft, Zalando, etc.) strongly recommends lowercase
hyphenated paths for readability, SEO-friendliness, and to avoid case-sensitivity issues.
This rule ONLY checks static path segments (outside of {}).
Path parameters ({...}) are completely ignored — any content (including empty {}, hyphens,
uppercase, underscores, special chars) is allowed inside braces.
Also allows:
- root path "/"
- optional trailing slash
- optional query string at the end

**Valid example:**
```yaml
paths:
  /user-profiles/{userId}:
    get:
      operationId: getUserProfile
```

**Invalid example (uppercase):**
```yaml
paths:
  /UserProfiles/{userId}:
    get:
      operationId: getUserProfile
```

**Invalid example (underscore):**
```yaml
paths:
  /user_profiles/{userId}:
    get:
      operationId: getUserProfile
```

---

### path-param-camel-case
#### Severity: <span style="color:goldenrod">WARN</span>

Path parameters: camelCase
Path parameter names appear in generated client code and URLs. camelCase aligns with
JSON payload properties and operationId, providing consistency across the API surface.

**Valid example:**
```yaml
paths:
  /users/{userId}:
    parameters:
      - name: userId
        in: path
```

**Invalid example (hyphen):**
```yaml
paths:
  /users/{user-id}:
    parameters:
      - name: user-id
        in: path
```

**Invalid example (uppercase start):**
```yaml
paths:
  /users/{UserId}:
    parameters:
      - name: UserId
        in: path
```

---

### query-param-camel-case
#### Severity: <span style="color:goldenrod">WARN</span>

Query parameters: camelCase
Consistency with path parameters, operationId, and payload properties is key for developer
experience. camelCase is the dominant choice in modern JavaScript/TypeScript ecosystems.

**Valid example:**
```yaml
paths:
  /users:
    get:
      parameters:
        - name: pageNumber
          in: query
```

**Invalid example (snake_case):**
```yaml
paths:
  /users:
    get:
      parameters:
        - name: page_number
          in: query
```

**Invalid example (uppercase start):**
```yaml
paths:
  /users:
    get:
      parameters:
        - name: PageNumber
          in: query
```

---

### schema-property-camel-case
#### Severity: <span style="color:goldenrod">WARN</span>

Schema properties (JSON payload fields): camelCase
JSON payload field names become object properties in generated SDKs and client code.
camelCase is the most common convention in public APIs and avoids issues with languages that
don't support hyphens or underscores in identifiers.

**Valid example:**
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        userId: { type: string }
```

**Invalid example (snake_case):**
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        user_id: { type: string }
```

**Invalid example (uppercase start):**
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        UserId: { type: string }
```

---

### no-empty-property-names
#### Severity: <span style="color:goldenrod">WARN</span>

Schema properties: No empty string property names
OpenAPI schemas should not use an empty string ("") as a property name.
Empty property keys are invalid in actual JSON payloads (most parsers reject { "": "value" }),
break code generators, and are poorly supported by documentation tools.
This pattern sometimes appears as a workaround to model "a single arbitrary key with a string value",
but the correct approach is to use `additionalProperties` with constraints (e.g., minProperties/maxProperties: 1).

**Valid example (using additionalProperties):**
```yaml
Diff:
  type: object
  additionalProperties:
    type: string
    description: Description of the changes in correction filing.
  minProperties: 1
  maxProperties: 1
```

**Invalid example (empty string key):**
```yaml
Diff:
  anyOf:
    - properties:
        '':                     # <-- disallowed
          type: string
          description: Description of the changes in correction filing.
```

---

### operation-summary
#### Severity: <span style="color:goldenrod">WARN</span>

Every operation must have a summary (short one-line overview)
Summary is ideal for list views and quick scanning in tools like Swagger UI.


**Valid example:**
```yaml
paths:
  /users:
    get:
      summary: List all users
      description: Returns a paginated list of users.
```


**Invalid example:**
```yaml
paths:
  /users:
    get:
      # Missing summary
      description: Returns a paginated list of users.
```

**Invalid example (empty):**
```yaml
paths:
  /users:
    get:
      summary: ""
      description: Returns a paginated list of users.
```

---

### oas3_0-schema-requires-example
#### Severity: <span style="color:goldenrod">WARN</span>

Every top-level schema object in OpenAPI 3.0.x documents should include a non-empty
'example' to improve API documentation clarity, enable better code generation, and help
API consumers quickly understand the expected data shape and realistic values.

This rule applies ONLY to top-level schemas (not to nested properties/items/allOf/anyOf/oneOf subschemas).


**Valid example:**
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
      example:          # ← required here
        id: 123
        name: "Alice Smith"
```

Also valid (inline in response):
```yaml
paths:
  /users/{id}:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: string
              example:          # ← required here
                data: "success"
```

Invalid examples:
```yaml
components:
  schemas:
    Product:
      type: object
      properties:
        sku:
          type: string
        price:
          type: number
      # missing example
```

```yaml
paths:
  /items:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
            # missing example on the top-level array schema
```

---

### oas3_1-schema-requires-example
#### Severity: <span style="color:goldenrod">WARN</span>

Every top-level schema object in OpenAPI 3.1.x documents should include at least one
example to improve API documentation clarity, support better mocking/code generation,
and help consumers understand realistic data shapes and values.

In OpenAPI 3.1:
  • The singular `example` field is DEPRECATED inside Schema Objects
  • Use `examples` (plural) instead — it accepts an array of values
    (JSON Schema Draft 2020-12 behavior)

This rule enforces presence of EITHER `example` OR `examples` (non-empty)
on top-level schemas only — not on nested subschemas (properties, items,
allOf/anyOf/oneOf, etc.).


**Valid example (reusable schema using preferred `examples`):**
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      examples:                        # ← preferred in 3.1 (array)
        - id: 789
          name: "Charlie Brown"
        - id: 101
          name: "Dana White"
```

Also valid (using deprecated `example` — still allowed but not recommended):
```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
      example:                         # ← still passes the rule
        name: "Max the Dog"
```

Valid inline response example:
```yaml
paths:
  /status:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  online:
                    type: boolean
              examples:
                healthy:
                  value:
                    online: true
```

Invalid examples (missing both `example` and `examples` on top-level schema):
```yaml
components:
  schemas:
    Order:
      type: object
      properties:
        orderId:
          type: string
        amount:
          type: number
      # no example or examples → violation
```

```yaml
paths:
  /products:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
            # no example/examples on top-level array schema → violation
```

---

### oas3_1-prefer-examples-over-example
#### Severity: <span style="color:goldenrod">WARN</span>

In OpenAPI 3.1.x, the singular `example` keyword inside Schema Objects is deprecated
in favor of the standard JSON Schema `examples` (plural) keyword, which supports
multiple named or unnamed examples as an array.

This rule warns ONLY when:
  • `example` is present
  • `examples` is NOT present (or is empty)

It does NOT warn if:
  • Only `examples` is used (preferred)
  • Both are present (allowed, but `examples` takes precedence in most tools)
  • Neither is present (that's handled by separate rules like requires-example)

Goal: Encourage migration to `examples` for better future-proofing and JSON Schema
compatibility without being overly strict.

Valid & preferred (OpenAPI 3.1 style):
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id: { type: integer }
        name: { type: string }
      examples:                    # ← modern, preferred
        - id: 1001
          name: "Alice"
        - id: 1002
          name: "Bob"
```

Also valid (no warning):
```yaml
      example:                     # both present → no warning
        id: 999
        name: "Legacy"
      examples:
        - id: 1001
          name: "Alice"
```

Warning triggered (uses deprecated `example` alone):
```yaml
components:
  schemas:
    Product:
      type: object
      properties:
        sku: { type: string }
      example:                     # ← deprecated & alone → warns
        sku: "ABC-123"
      # no examples field
```

No warning (no examples at all — handled by other rules):
```yaml
      type: string
      # neither example nor examples → no warning here
```

---

### oas2-require-openapi-3
#### Severity: <span style="color:goldenrod">WARN</span>

Enforce OpenAPI 3.x only (no Swagger 2.0)
OpenAPI 3.x documents use a top-level "openapi" key with a value like "3.0.3" or "3.1.0".
Swagger 2.0 documents use a top-level "swagger" key (usually "2.0").


**Valid example:**
```yaml
openapi: 3.0.3
info:
  title: My API
  version: 1.0.0
paths: {}
```


**Invalid example:**
```yaml
swagger: '2.0'
info:
  title: My API
  version: 1.0.0
paths: {}
```

---

### path-segments-no-verbs-blacklist
#### Severity: <span style="color:goldenrod">WARN</span>

Strict enforcement: known verb anti-patterns
Common verbs that should never appear in path segments are treated as errors.

**Valid example:**
```yaml
paths:
  /users:
    post: ...
  /users/{id}:
    put: ...
```

**Invalid example:**
```yaml
paths:
  /createUser:
    post: ...
  /updateProfile/{id}:
    put: ...
```

---

## Optional Content


---

### contact-properties
#### Severity: OFF

A contact object is required, including name, url, and email.
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### info-contact
#### Severity: OFF

Info object should contain contact object.
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### info-license
#### Severity: OFF

The info object should have a license key.
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### license-url
#### Severity: OFF

Mentioning a license is only useful if people know what the license means, so add a link to the full text for those who need it.
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### openapi-tags
#### Severity: OFF

OpenAPI object should have non-empty tags array.
Ensures the root `tags` array is present and contains at least one tag.
This helps documentation tools group operations effectively.


**Valid example:**
```yaml
openapi: 3.0.3
info:
  title: Example API
  version: 1.0.0
tags:
  - name: users
    description: Operations about users
paths: {}
```


**Invalid example:**
```yaml
openapi: 3.0.3
info:
  title: Example API
  version: 1.0.0
# Missing tags entirely or empty array
tags: []
paths: {}
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-singular-tag
#### Severity: OFF

Use just one tag for an operation
Each operation should have exactly one tag (or up to 3 in some versions) to avoid ambiguity in documentation grouping.


**Valid example:**
```yaml
paths:
  /users:
    get:
      tags:
        - users
      summary: List users
```


**Invalid example:**
```yaml
paths:
  /users:
    get:
      tags:
        - users
        - admin
        - reports
      summary: List users
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-tag-defined
#### Severity: OFF

Operation should have non-empty tags array.
Every operation must define at least one tag for proper grouping in generated documentation.


**Valid example:**
```yaml
paths:
  /users:
    get:
      tags:
        - users
      summary: List users
```


**Invalid example:**
```yaml
paths:
  /users:
    get:
      # Missing tags or empty array
      tags: []
      summary: List users
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### operation-tags
#### Severity: OFF

Operation tags should be defined in global tags.
All tags used in operations must be declared in the root `tags` array for consistency and richer descriptions.


**Valid example:**
```yaml
tags:
  - name: users
    description: User-related endpoints
paths:
  /users:
    get:
      tags:
        - users
```


**Invalid example:**
```yaml
# Missing global declaration of 'users'
paths:
  /users:
    get:
      tags:
        - users
```
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### tag-description
#### Severity: OFF

A tag should have a description.
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas2-parameter-description
#### Severity: OFF

Parameter objects should have a description.
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### oas3-api-servers
#### Severity: OFF

OpenAPI servers must be present and non-empty array.
See official [Spectral documentation](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules)for details.

---

### path-segments-no-verbs-probable
#### Severity: OFF

Softer guidance: probable verbs detected by NLP
Uses heuristic/NLP analysis to catch less obvious verbs or verb forms.
Already blacklisted verbs are skipped to avoid duplicate messages.
Allows common exceptions (e.g., "file" in /uploadFile) and explicitly disallows others.

**Valid example:**
```yaml
paths:
  /uploadFile:
    post: ...
  /reports/export:
    get: ...
```

**Invalid example:**
```yaml
paths:
  /importData:
    post: ...
  /generateReport:
    get: ...
```

---

### oas3_0-problem-details-response-structure
#### Severity: <span style="color:goldenrod">WARN</span>

Enforces that 400 and 422 error responses in OpenAPI 3.0 documents follow the canonical
Problem Details structure as defined in RFC 9457 (application/problem+json style).
Uses a custom schema-matching function to verify that the response schema contains
the required fields (type, title, status, errors), correct types, and respects
nullable/optional fields as defined in the reference schema.
Allows additional properties for future extension but prevents breaking the core contract.


**Valid example:**
```yaml
responses:
  '400':
    description: Bad Request
    content:
      application/json:
        schema:
          type: object
          required: [type, title, status, errors]
          properties:
            type: { type: string }
            title: { type: string }
            status: { type: integer }
            detail: { type: string, nullable: true }
            errors:
              type: array
              items: { $ref: '#/components/schemas/ErrorItem' }
```


**Invalid example:**
```yaml
responses:
  '400':
    content:
      application/json:
        schema:
          type: object
          required: [type, title, status]          # missing 'errors'
          properties:
            type: { type: string }
            title: { type: string }
            status: { type: string }                # wrong type
            detail: { type: string }
```

---

### oas3_1-problem-details-response-structure
#### Severity: <span style="color:goldenrod">WARN</span>

Enforces that 400 and 422 error responses in OpenAPI 3.1 documents follow the canonical
Problem Details structure as defined in RFC 9457 (application/problem+json style).
Uses a custom schema-matching function to verify that the response schema contains
the required fields (type, title, status, errors), correct types, and respects
nullable/optional fields as defined in the reference schema.
Allows additional properties for future extension but prevents breaking the core contract.


**Valid example:**
```yaml
responses:
  '422':
    description: Unprocessable Entity
    content:
      application/json:
        schema:
          type: object
          required: [type, title, status, errors]
          properties:
            type: { type: string }
            title: { type: string }
            status: { type: integer }
            detail: { anyOf: [{type: string}, {type: 'null'}] }
            errors:
              type: array
              minItems: 1
              items: { $ref: '#/components/schemas/ErrorItem' }
```


**Invalid example:**
```yaml
responses:
  '422':
    content:
      application/json:
        schema:
          type: object
          required: [type, title, status, errors]
          properties:
            type: { type: string }
            title: { type: string }
            status: { type: string }                    # wrong type
            detail: { type: string }                    # missing null option
            errors: { type: object }                    # wrong type
```

---

### oas3_0-internal-error-response-structure
#### Severity: <span style="color:goldenrod">WARN</span>

Enforces that 500 error responses in OpenAPI 3.0 documents follow the canonical
Error structure.
Uses a custom schema-matching function to verify that the response schema contains
the required fields (error, message), correct types, and respects
nullable/optional fields as defined in the reference schema.
Allows additional properties for future extension but prevents breaking the core contract.


**Valid example:**
```yaml
responses:
  '500':
    description: Internal Server Error
    content:
      application/json:
        schema:
          type: object
          required: [error, message]
          properties:
            error: { type: string }
            message: { type: string }
            details:
              type: object
              additionalProperties: true
              nullable: true
```


**Invalid example:**
```yaml
responses:
  '500':
    content:
      application/json:
        schema:
          type: object
          required: [message]           # missing 'error'
          properties:
            message: { type: string }
            details: { type: string }   # wrong type
```

---

### oas3_1-internal-error-response-structure
#### Severity: <span style="color:goldenrod">WARN</span>

Enforces that 500 error responses in OpenAPI 3.1 documents follow the canonical
Error structure.
Uses a custom schema-matching function to verify that the response schema contains
the required fields (error, message), correct types, and respects
nullable/optional fields as defined in the reference schema.
Allows additional properties for future extension but prevents breaking the core contract.


**Valid example:**
```yaml
responses:
  '500':
    description: Internal Server Error
    content:
      application/json:
        schema:
          type: object
          required: [error, message]
          properties:
            error: { type: string }
            message: { type: string }
            details:
              anyOf:
                - type: object
                  additionalProperties: true
                - type: 'null'
```


**Invalid example:**
```yaml
responses:
  '500':
    content:
      application/json:
        schema:
          type: object
          required: [error, message]
          properties:
            error: { type: string }
            message: { type: number }   # wrong type
            details: { type: array }    # wrong type
```

---
