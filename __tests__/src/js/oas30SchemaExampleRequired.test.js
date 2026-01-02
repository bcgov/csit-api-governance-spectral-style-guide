const { BaseSpectralTest, Severity } = require('./helpers/base-spectral-test');

class Oas30SchemaExampleRequiredTest extends BaseSpectralTest {
  constructor() {
    super('spectral/basic-ruleset.yaml', `
rules:
  oas3_0-schema-requires-example: error
`);
  }

  async beforeAll() {
    await this.setup();
  }
}

const testInstance = new Oas30SchemaExampleRequiredTest();

describe('Spectral Validation', () => {
  test('valid document should not trigger violation', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.0.3
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
        refProp: "reference-value"

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
      notExpected: ["oas3_0-schema-requires-example",]
    });
  });  

  test('test rule for OpenAPI 3.0.3 triggers for invalid document (undefined example)', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.0.3
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
      notExpected: ['oas3_0-schema-requires-example'],
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

  test('test rule for OpenAPI 3.0.3 triggers for invalid document (no example)', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.0.3
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
              schema:                                       # requires example 1
                type: object
                properties:
                  productId: { type: integer }
          headers:
            X-Product-Header:
              schema:                                       # requires example 2
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
          schema:                                       # requires example 3
            type: object
            properties:
              activeInd: { type: boolean }
        - name: X-Auth-Token
          in: header
          description: Authentication token
          schema:                                       # requires example 4
            type: object
            properties:
              tokenValue: { type: string }
        - name: sessionId
          in: cookie
          description: Session identifier
          schema:                                       # requires example 5
            type: object
            properties:
              sessionValue: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:                                       # requires example 6
                type: array
                items:
                  type: object                              # Not required on sub schema
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
          schema:                                       # requires example 7
            type: object
            properties:
              parameterValue: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:                                       # requires example 8
                type: object
                additionalProperties:
                  type: object                                       # Not required on sub schema
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
            schema:                                       # requires example 9
              type: object
              properties:
                fileName: { type: string }
            encoding:
              fileName:
                headers:
                  X-File-Metadata:
                    schema:                                       # requires example 10
                      type: object
                      properties:
                        metadataValue: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:                                       # Does not require an example becuase it is a $ref
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
    ItemIdSchema:                                       # requires example 11
      type: object
      properties:
        itemId: { type: integer }

    RefSchema:                                       # requires example 12
      type: object
      properties:
        refProp: { type: string }

  parameters:
    SkipParam:
      name: skipItem
      in: query
      description: Number of items to skip
      schema:                                       # requires example 13
        type: object
        properties:
          skipItem: { type: integer }

  requestBodies:
    CreateBody:
      required: true
      content:
        application/json:
          schema:                                       # requires example 14
            type: object
            properties:
              itemId: { type: integer }

  responses:
    ReusableResponse:
      description: Reusable OK
      content:
        application/json:
          schema:                                       # requires example 15
            type: object
            properties:
              reusableProp: { type: string }
      headers:
        X-Reusable-Header:
          schema:                                       # requires example 16
            type: object
            properties:
              reusableHeaderValue: { type: boolean }

  headers:
    AuthHeader:
      schema:                                       # requires example 17
        type: object
        properties:
          authValue: { type: string }
      `,
      expected: [
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1product/get/responses/200/content/application~1json/schema'], // requires example 1
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1product/get/responses/200/headers/X-Product-Header/schema'], // requires example 2
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1items/get/parameters/0/schema'], // requires example 3
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1items/get/parameters/1/schema'], // requires example 4
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1items/get/parameters/2/schema'], // requires example 5
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1items/get/responses/200/content/application~1json/schema'], // requires example 6
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1items~1{itemId}/get/parameters/0/schema'], // requires example 7
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1items~1{itemId}/get/responses/200/content/application~1json/schema'], // requires example 8
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1upload/post/requestBody/content/multipart~1form-data/schema'], // requires example 9
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/paths/~1upload/post/requestBody/content/multipart~1form-data/encoding/fileName/headers/X-File-Metadata/schema'], // requires example 10
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/components/schemas/ItemIdSchema'], // requires example 11
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/components/schemas/RefSchema'], // requires example 12
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/components/parameters/SkipParam/schema'], // requires example 13
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/components/requestBodies/CreateBody/content/application~1json/schema'], // requires example 14
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/components/responses/ReusableResponse/content/application~1json/schema'], // requires example 15
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/components/responses/ReusableResponse/headers/X-Reusable-Header/schema'], // requires example 16
        ['oas3_0-schema-requires-example', Severity.Error, 'Schema is missing a required \'example\' (OAS 3.0 style)', '/components/headers/AuthHeader/schema'], // requires example 17
      ],
    });
  });
});