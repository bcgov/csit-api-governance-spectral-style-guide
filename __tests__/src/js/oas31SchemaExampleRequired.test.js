const { BaseSpectralTest, Severity } = require('./helpers/base-spectral-test');

class Oas31SchemaExampleRequiredTest extends BaseSpectralTest {
  constructor() {
    super('spectral/basic-ruleset.yaml', `
rules:
  oas3_1-schema-requires-example: error
`);
  }

  async beforeAll() {
    await this.setup();
  }
}

const testInstance = new Oas31SchemaExampleRequiredTest();

describe('Spectral Validation', () => {

  test('valid document should not trigger violation (example)', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  description: Test API definition

paths:
  /product:
    get:
      summary: Retrieve a single product
      description: Get Product
      operationId: getProduct
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  productId: { type: integer }
                example:
                  productId: 42531
          headers:
            X-Product-Header:
              schema:
                type: object
                properties:
                  headerValue: { type: string }
                example:
                  headerValue: "prod-meta-abc123"

  /items:
    get:
      summary: List all items
      description: Get Items
      operationId: getItems
      parameters:
        - name: active
          in: query
          description: Filter to active items only
          schema:
            type: object
            properties:
              activeInd: { type: boolean }
            example:
              activeInd: true
        - name: X-Auth-Token
          in: header
          description: Authentication token
          schema:
            type: object
            properties:
              tokenValue: { type: string }
            example:
              tokenValue: "eyJh...zI1NiJ9..."
        - name: sessionId
          in: cookie
          description: Session identifier
          schema:
            type: object
            properties:
              sessionValue: { type: string }
            example:
              sessionValue: "sess_abc123xyz"
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    itemId: { type: integer }
                example:
                  - itemId: 789
                  - itemId: 790

  /items/{itemId}:
    get:
      summary: Get a single item by ID
      description: Get Item
      operationId: getItem
      parameters:
        - name: itemId
          in: path
          required: true
          description: Unique identifier of the item
          schema:
            type: object
            properties:
              parameterValue: { type: string }
            example:
              parameterValue: "item-2025-xyz"
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                additionalProperties:
                  type: object
                  properties:
                    dynamicProp: { type: string }
                example:
                  someKey1: { dynamicProp: "value-1" }
                  someKey2: { dynamicProp: "value-2" }

  /upload:
    post:
      summary: Upload a new file
      description: Upload File
      operationId: uploadFile
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                fileName: { type: string }
              example:
                fileName: "invoice-2026-Q1.pdf"
            encoding:
              fileName:
                headers:
                  X-File-Metadata:
                    schema:
                      type: object
                      properties:
                        metadataValue: { type: string }
                      example:
                        metadataValue: "confidential"
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RefSchema'

  /ref-test:
    get:
      summary: Test endpoint using schema references
      description: Reference Test
      operationId: refTest
      responses:
        '200':
          $ref: '#/components/responses/ReusableResponse'

components:
  schemas:
    ItemIdSchema:
      type: object
      properties:
        itemId: { type: integer }
      example:
        itemId: 9999

    RefSchema:
      type: object
      properties:
        refProp: { type: string }
      example:
        refProp: "example-reference-value"

  parameters:
    SkipParam:
      name: skipItem
      in: query
      description: Number of items to skip
      schema:
        type: object
        properties:
          skipItem: { type: integer }
        example:
          skipItem: 50

  requestBodies:
    CreateBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              itemId: { type: integer }
            example:
              itemId: 3001

  responses:
    ReusableResponse:
      description: Reusable OK
      content:
        application/json:
          schema:
            type: object
            properties:
              reusableProp: { type: string }
            example:
              reusableProp: "operation-completed"
      headers:
        X-Reusable-Header:
          schema:
            type: object
            properties:
              reusableHeaderValue: { type: boolean }
            example:
              reusableHeaderValue: true

  headers:
    AuthHeader:
      schema:
        type: object
        properties:
          authValue: { type: string }
        example:
          authValue: "Bearer xyz789token"
      `,
      notExpected: ["oas3_1-schema-requires-example",]
    });
  });  

  test('valid document should not trigger violation (examples)', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  description: Test API definition

paths:
  /product:
    get:
      summary: Retrieve a single product
      description: Get Product
      operationId: getProduct
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  productId: { type: integer }
                examples:
                  - productId: 42531
                  - productId: 67890
          headers:
            X-Product-Header:
              schema:
                type: object
                properties:
                  headerValue: { type: string }
                examples:
                  - headerValue: "prod-meta-abc123"
                  - headerValue: "prod-meta-def456"

  /items:
    get:
      summary: List all items
      description: Get Items
      operationId: getItems
      parameters:
        - name: active
          in: query
          description: Filter to active items only
          schema:
            type: object
            properties:
              activeInd: { type: boolean }
            examples:
              - activeInd: true
              - activeInd: false
        - name: X-Auth-Token
          in: header
          description: Authentication token
          schema:
            type: object
            properties:
              tokenValue: { type: string }
            examples:
              - tokenValue: "eyJh...zI1NiJ9..."
              - tokenValue: "eyJh...abcDEF456"
        - name: sessionId
          in: cookie
          description: Session identifier
          schema:
            type: object
            properties:
              sessionValue: { type: string }
            examples:
              - sessionValue: "sess_abc123xyz"
              - sessionValue: "sess_def789uvw"
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    itemId: { type: integer }
                examples:
                  - [ { itemId: 789 }, { itemId: 790 } ]
                  - [ { itemId: 100 }, { itemId: 101 } ]

  /items/{itemId}:
    get:
      summary: Get a single item by ID
      description: Get Item
      operationId: getItem
      parameters:
        - name: itemId
          in: path
          required: true
          description: Unique identifier of the item
          schema:
            type: object
            properties:
              parameterValue: { type: string }
            examples:
              - parameterValue: "item-2025-xyz"
              - parameterValue: "item-2026-abc"
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                additionalProperties:
                  type: object
                  properties:
                    dynamicProp: { type: string }
                examples:
                  - someKey1: { dynamicProp: "value-1" }
                    someKey2: { dynamicProp: "value-2" }
                  - someKeyA: { dynamicProp: "alpha" }
                    someKeyB: { dynamicProp: "beta" }

  /upload:
    post:
      summary: Upload a new file
      description: Upload File
      operationId: uploadFile
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                fileName: { type: string }
              examples:
                - fileName: "invoice-2026-Q1.pdf"
                - fileName: "report-2026-annual.xlsx"
            encoding:
              fileName:
                headers:
                  X-File-Metadata:
                    schema:
                      type: object
                      properties:
                        metadataValue: { type: string }
                      examples:
                        - metadataValue: "confidential"
                        - metadataValue: "public"
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RefSchema'

  /ref-test:
    get:
      summary: Test endpoint using schema references
      description: Reference Test
      operationId: refTest
      responses:
        '200':
          $ref: '#/components/responses/ReusableResponse'

components:
  schemas:
    ItemIdSchema:
      type: object
      properties:
        itemId: { type: integer }
      examples:
        - itemId: 9999
        - itemId: 10000

    RefSchema:
      type: object
      properties:
        refProp: { type: string }
      examples:
        - refProp: "example-reference-value"
        - refProp: "another-ref-example"

  parameters:
    SkipParam:
      name: skipItem
      in: query
      description: Number of items to skip
      schema:
        type: object
        properties:
          skipItem: { type: integer }
        examples:
          - skipItem: 50
          - skipItem: 100

  requestBodies:
    CreateBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              itemId: { type: integer }
            examples:
              - itemId: 3001
              - itemId: 4002

  responses:
    ReusableResponse:
      description: Reusable OK
      content:
        application/json:
          schema:
            type: object
            properties:
              reusableProp: { type: string }
            examples:
              - reusableProp: "operation-completed"
              - reusableProp: "success"
      headers:
        X-Reusable-Header:
          schema:
            type: object
            properties:
              reusableHeaderValue: { type: boolean }
            examples:
              - reusableHeaderValue: true
              - reusableHeaderValue: false

  headers:
    AuthHeader:
      schema:
        type: object
        properties:
          authValue: { type: string }
        examples:
          - authValue: "Bearer xyz789token"
          - authValue: "Bearer abc123token"
      `,
      notExpected: ["oas3_1-schema-requires-example",]
    });
  });  

  test('test rule for OpenAPI 3.1.0 triggers for invalid document (undefined example)', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  description: Test API definition

paths:
  /product:
    get:
      summary: Retrieve a single product
      description: Get Product
      operationId: getProduct
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  productId: { type: integer }
                example:
          headers:
            X-Product-Header:
              schema:
                type: object
                properties:
                  headerValue: { type: string }
                example:

  /items:
    get:
      summary: List all items
      description: Get Items
      operationId: getItems
      parameters:
        - name: active
          in: query
          description: Filter to active items only
          schema:
            type: object
            properties:
              activeInd: { type: boolean }
            example:
        - name: X-Auth-Token
          in: header
          description: Authentication token
          schema:
            type: object
            properties:
              tokenValue: { type: string }
            example:
        - name: sessionId
          in: cookie
          description: Session identifier
          schema:
            type: object
            properties:
              sessionValue: { type: string }
            example:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    itemId: { type: integer }
                example:

  /items/{itemId}:
    get:
      summary: Get a single item by ID
      description: Get Item
      operationId: getItem
      parameters:
        - name: itemId
          in: path
          required: true
          description: Unique identifier of the item
          schema:
            type: object
            properties:
              parameterValue: { type: string }
            example:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                additionalProperties:
                  type: object
                  properties:
                    dynamicProp: { type: string }
                example:

  /upload:
    post:
      summary: Upload a new file
      description: Upload File
      operationId: uploadFile
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                fileName: { type: string }
              example:
            encoding:
              fileName:
                headers:
                  X-File-Metadata:
                    schema:
                      type: object
                      properties:
                        metadataValue: { type: string }
                      example:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RefSchema'

  /ref-test:
    get:
      summary: Test endpoint using schema references
      description: Reference Test
      operationId: refTest
      responses:
        '200':
          $ref: '#/components/responses/ReusableResponse'

components:
  schemas:
    ItemIdSchema:
      type: object
      properties:
        itemId: { type: integer }
      example:

    RefSchema:
      type: object
      properties:
        refProp: { type: string }
      example:

  parameters:
    SkipParam:
      name: skipItem
      in: query
      description: Number of items to skip
      schema:
        type: object
        properties:
          skipItem: { type: integer }
        example:

  requestBodies:
    CreateBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              itemId: { type: integer }
            example:

  responses:
    ReusableResponse:
      description: Reusable OK
      content:
        application/json:
          schema:
            type: object
            properties:
              reusableProp: { type: string }
            example:
      headers:
        X-Reusable-Header:
          schema:
            type: object
            properties:
              reusableHeaderValue: { type: boolean }
            example:

  headers:
    AuthHeader:
      schema:
        type: object
        properties:
          authValue: { type: string }
        example:
      `,
      // An undefined 'example' is a type violation and is captured by "oas3-valid-schema-example" - ""example" property type must be <type>.
      notExpected: ['oas3_1-schema-requires-example'],
      expected: [
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be array', '/paths/~1items/get/responses/200/content/application~1json/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/paths/~1product/get/responses/200/content/application~1json/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/paths/~1product/get/responses/200/headers/X-Product-Header/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/paths/~1items/get/parameters/0/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/paths/~1items/get/parameters/1/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/paths/~1items/get/parameters/2/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/paths/~1items~1{itemId}/get/parameters/0/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/paths/~1items~1{itemId}/get/responses/200/content/application~1json/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/paths/~1upload/post/requestBody/content/multipart~1form-data/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/paths/~1upload/post/requestBody/content/multipart~1form-data/encoding/fileName/headers/X-File-Metadata/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/components/schemas/ItemIdSchema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/components/schemas/RefSchema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/components/parameters/SkipParam/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/components/requestBodies/CreateBody/content/application~1json/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/components/responses/ReusableResponse/content/application~1json/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/components/responses/ReusableResponse/headers/X-Reusable-Header/schema/example'],
        ['oas3-valid-schema-example', Severity.Warning, '"example" property type must be object', '/components/headers/AuthHeader/schema/example'],
      ]
    });
  });  

  test('test rule for OpenAPI 3.1.0 triggers for invalid document (no example or examples)', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  description: Test API definition

paths:
  /product:
    get:
      summary: Retrieve a single product
      description: Get Product
      operationId: getProduct
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:                                          # requires example 1
                type: object
                properties:
                  productId: { type: integer }
          headers:
            X-Product-Header:
              schema:                                          # requires example 2
                type: object
                properties:
                  headerValue: { type: string }

  /items:
    get:
      summary: List all items
      description: Get Items
      operationId: getItems
      parameters:
        - name: active
          in: query
          description: Filter to active items only
          schema:                                          # requires example 3
            type: object
            properties:
              activeInd: { type: boolean }
        - name: X-Auth-Token
          in: header
          description: Authentication token
          schema:                                          # requires example 4
            type: object
            properties:
              tokenValue: { type: string }
        - name: sessionId
          in: cookie
          description: Session identifier
          schema:                                          # requires example 5
            type: object
            properties:
              sessionValue: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:                                          # requires example 6
                type: array
                items:                                          # Not required on sub schema
                  type: object
                  properties:
                    itemId: { type: integer }

  /items/{itemId}:
    get:
      summary: Get a single item by ID
      description: Get Item
      operationId: getItem
      parameters:
        - name: itemId
          in: path
          required: true
          description: Unique identifier of the item
          schema:                                          # requires example 7
            type: object
            properties:
              parameterValue: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:                                          # requires example 8
                type: object
                additionalProperties:                              # Not required on sub schema
                  type: object
                  properties:
                    dynamicProp: { type: string }

  /upload:
    post:
      summary: Upload a new file
      description: Upload File
      operationId: uploadFile
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:                                          # requires example 9
              type: object
              properties:
                fileName: { type: string }
            encoding:
              fileName:
                headers:
                  X-File-Metadata:
                    schema:                                          # requires example 10
                      type: object
                      properties:
                        metadataValue: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:                                                 # not required for $ref
                $ref: '#/components/schemas/RefSchema'

  /ref-test:
    get:
      summary: Test endpoint using schema references
      description: Reference Test
      operationId: refTest
      responses:
        '200':
          $ref: '#/components/responses/ReusableResponse'

components:
  schemas:
    ItemIdSchema:                                          # requires example 11
      type: object
      properties:
        itemId: { type: integer }

    RefSchema:                                          # requires example 12
      type: object
      properties:
        refProp: { type: string }

  parameters:
    SkipParam:
      name: skipItem
      in: query
      description: Number of items to skip
      schema:                                          # requires example 13
        type: object
        properties:
          skipItem: { type: integer }

  requestBodies:
    CreateBody:
      required: true
      content:
        application/json:
          schema:                                          # requires example 14
            type: object
            properties:
              itemId: { type: integer }

  responses:
    ReusableResponse:
      description: Reusable OK
      content:
        application/json:
          schema:                                          # requires example 15
            type: object
            properties:
              reusableProp: { type: string }
      headers:
        X-Reusable-Header:
          schema:                                          # requires example 16
            type: object
            properties:
              reusableHeaderValue: { type: boolean }

  headers:
    AuthHeader:
      schema:                                          # requires example 17
        type: object
        properties:
          authValue: { type: string }
      `,
      expected: [
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1product/get/responses/200/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1product/get/responses/200/headers/X-Product-Header/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items/get/parameters/0/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items/get/parameters/1/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items/get/parameters/2/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items/get/responses/200/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items~1{itemId}/get/parameters/0/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items~1{itemId}/get/responses/200/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1upload/post/requestBody/content/multipart~1form-data/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1upload/post/requestBody/content/multipart~1form-data/encoding/fileName/headers/X-File-Metadata/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/schemas/ItemIdSchema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/schemas/RefSchema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/parameters/SkipParam/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/requestBodies/CreateBody/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/responses/ReusableResponse/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/responses/ReusableResponse/headers/X-Reusable-Header/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/headers/AuthHeader/schema'],
      ],
    });
  });

  test('test rule for OpenAPI 3.1.0 triggers for invalid document (undefined examples)', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  description: Test API definition

paths:
  /product:
    get:
      summary: Retrieve a single product
      description: Get Product
      operationId: getProduct
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  productId: { type: integer }
                examples:
          headers:
            X-Product-Header:
              schema:
                type: object
                properties:
                  headerValue: { type: string }
                examples:

  /items:
    get:
      summary: List all items
      description: Get Items
      operationId: getItems
      parameters:
        - name: active
          in: query
          description: Filter to active items only
          schema:
            type: object
            properties:
              activeInd: { type: boolean }
            examples:
        - name: X-Auth-Token
          in: header
          description: Authentication token
          schema:
            type: object
            properties:
              tokenValue: { type: string }
            examples:
        - name: sessionId
          in: cookie
          description: Session identifier
          schema:
            type: object
            properties:
              sessionValue: { type: string }
            examples:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    itemId: { type: integer }
                examples:

  /items/{itemId}:
    get:
      summary: Get a single item by ID
      description: Get Item
      operationId: getItem
      parameters:
        - name: itemId
          in: path
          required: true
          description: Unique identifier of the item
          schema:
            type: object
            properties:
              parameterValue: { type: string }
            examples:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                additionalProperties:
                  type: object
                  properties:
                    dynamicProp: { type: string }
                examples:

  /upload:
    post:
      summary: Upload a new file
      description: Upload File
      operationId: uploadFile
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                fileName: { type: string }
              examples:
            encoding:
              fileName:
                headers:
                  X-File-Metadata:
                    schema:
                      type: object
                      properties:
                        metadataValue: { type: string }
                      examples:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RefSchema'

  /ref-test:
    get:
      summary: Test endpoint using schema references
      description: Reference Test
      operationId: refTest
      responses:
        '200':
          $ref: '#/components/responses/ReusableResponse'

components:
  schemas:
    ItemIdSchema:
      type: object
      properties:
        itemId: { type: integer }
      examples:

    RefSchema:
      type: object
      properties:
        refProp: { type: string }
      examples:

  parameters:
    SkipParam:
      name: skipItem
      in: query
      description: Number of items to skip
      schema:
        type: object
        properties:
          skipItem: { type: integer }
        examples:

  requestBodies:
    CreateBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              itemId: { type: integer }
            examples:

  responses:
    ReusableResponse:
      description: Reusable OK
      content:
        application/json:
          schema:
            type: object
            properties:
              reusableProp: { type: string }
            examples:
      headers:
        X-Reusable-Header:
          schema:
            type: object
            properties:
              reusableHeaderValue: { type: boolean }
            examples:

  headers:
    AuthHeader:
      schema:
        type: object
        properties:
          authValue: { type: string }
        examples:
      `,
      // An undefined 'examples' is a schema violation and not a content violation so it is captured by "oas3-schema" - "examples" property must be array.
      notExpected: ['oas3_1-schema-requires-example'],
      expected: [
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1product/get/responses/200/content/application~1json/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1product/get/responses/200/headers/X-Product-Header/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1items/get/parameters/0/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1items/get/parameters/1/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1items/get/parameters/2/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1items/get/responses/200/content/application~1json/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1items~1{itemId}/get/parameters/0/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1items~1{itemId}/get/responses/200/content/application~1json/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1upload/post/requestBody/content/multipart~1form-data/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/paths/~1upload/post/requestBody/content/multipart~1form-data/encoding/fileName/headers/X-File-Metadata/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/components/schemas/ItemIdSchema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/components/schemas/RefSchema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/components/parameters/SkipParam/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/components/requestBodies/CreateBody/content/application~1json/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/components/responses/ReusableResponse/content/application~1json/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/components/responses/ReusableResponse/headers/X-Reusable-Header/schema/examples'],
        ['oas3-schema', Severity.Error, '"examples" property must be array.', '/components/headers/AuthHeader/schema/examples'],
      ]
    });
  });  

  test('test rule for OpenAPI 3.1.0 triggers for invalid document (empty examples)', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  description: Test API definition

paths:
  /product:
    get:
      summary: Retrieve a single product
      description: Get Product
      operationId: getProduct
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  productId: { type: integer }
                examples: []
          headers:
            X-Product-Header:
              schema:
                type: object
                properties:
                  headerValue: { type: string }
                examples: []

  /items:
    get:
      summary: List all items
      description: Get Items
      operationId: getItems
      parameters:
        - name: active
          in: query
          description: Filter to active items only
          schema:
            type: object
            properties:
              activeInd: { type: boolean }
            examples: []
        - name: X-Auth-Token
          in: header
          description: Authentication token
          schema:
            type: object
            properties:
              tokenValue: { type: string }
            examples: []
        - name: sessionId
          in: cookie
          description: Session identifier
          schema:
            type: object
            properties:
              sessionValue: { type: string }
            examples: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    itemId: { type: integer }
                examples: []

  /items/{itemId}:
    get:
      summary: Get a single item by ID
      description: Get Item
      operationId: getItem
      parameters:
        - name: itemId
          in: path
          required: true
          description: Unique identifier of the item
          schema:
            type: object
            properties:
              parameterValue: { type: string }
            examples: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                additionalProperties:
                  type: object
                  properties:
                    dynamicProp: { type: string }
                examples: []

  /upload:
    post:
      summary: Upload a new file
      description: Upload File
      operationId: uploadFile
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                fileName: { type: string }
              examples: []
            encoding:
              fileName:
                headers:
                  X-File-Metadata:
                    schema:
                      type: object
                      properties:
                        metadataValue: { type: string }
                      examples: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RefSchema'

  /ref-test:
    get:
      summary: Test endpoint using schema references
      description: Reference Test
      operationId: refTest
      responses:
        '200':
          $ref: '#/components/responses/ReusableResponse'

components:
  schemas:
    ItemIdSchema:
      type: object
      properties:
        itemId: { type: integer }
      examples: []

    RefSchema:
      type: object
      properties:
        refProp: { type: string }
      examples: []

  parameters:
    SkipParam:
      name: skipItem
      in: query
      description: Number of items to skip
      schema:
        type: object
        properties:
          skipItem: { type: integer }
        examples: []

  requestBodies:
    CreateBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              itemId: { type: integer }
            examples: []

  responses:
    ReusableResponse:
      description: Reusable OK
      content:
        application/json:
          schema:
            type: object
            properties:
              reusableProp: { type: string }
            examples: []
      headers:
        X-Reusable-Header:
          schema:
            type: object
            properties:
              reusableHeaderValue: { type: boolean }
            examples: []

  headers:
    AuthHeader:
      schema:
        type: object
        properties:
          authValue: { type: string }
        examples: []
      `,
      expected: [
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1product/get/responses/200/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1product/get/responses/200/headers/X-Product-Header/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items/get/parameters/0/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items/get/parameters/1/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items/get/parameters/2/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items/get/responses/200/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items~1{itemId}/get/parameters/0/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1items~1{itemId}/get/responses/200/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1upload/post/requestBody/content/multipart~1form-data/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/paths/~1upload/post/requestBody/content/multipart~1form-data/encoding/fileName/headers/X-File-Metadata/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/schemas/ItemIdSchema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/schemas/RefSchema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/parameters/SkipParam/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/requestBodies/CreateBody/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/responses/ReusableResponse/content/application~1json/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/responses/ReusableResponse/headers/X-Reusable-Header/schema'],
        ['oas3_1-schema-requires-example', Severity.Error, 'Schema is missing either \'example\' or \'examples\' (OAS 3.1 style)', '/components/headers/AuthHeader/schema'],
      ]
    });
  });  
});