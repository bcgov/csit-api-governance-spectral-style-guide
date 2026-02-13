const { BaseSpectralTest, Severity } = require('./helpers/base-spectral-test');

class OperationSummaryTest extends BaseSpectralTest {
  constructor() {
    super('spectral/basic-ruleset.yaml', `
rules:
  operation-summary: error
`);
  }

  async beforeAll() {
    await this.setup();
  }
}

const testInstance = new OperationSummaryTest();

describe('Spectral Validation', () => {
  test('valid document should not trigger violation', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  description: Test API definition
servers:
  - url: http://localhost
paths:
  /helloworld:
    get:
      description: Hello World
      operationId: helloWorld
      summary: The Hello World! endpoint
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: string
      `,
      expected: [],
    });
  });

  test('test rule for Swagger 2.0 triggers for invalid document', async () => {
    await testInstance.validateOas({
      oasYaml: `
swagger: '2.0'
info:
  title: Test API
  version: 1.0.0
  description: Test API definition

host: localhost
schemes:
  - http

paths:
  /helloworld:
    get:
      description: Hello World
      operationId: helloWorld
      produces:
        - application/json
      responses:
        '200':
          description: OK
          schema:
            type: string
      `,
      expected: [
        ['operation-summary', Severity.Error, 'Operation is missing a summary or it is empty.', '/paths/~1helloworld/get'],
      ],
    });
  });

  test('test rule for OpenAPI 3.0.3 triggers for invalid document', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.0.3
info:
  title: Test API
  version: 1.0.0
  description: Test API definition
servers:
  - url: http://localhost
paths:
  /helloworld:
    get:
      description: Hello World
      operationId: helloWorld
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: string
      `,
      expected: [
        ['operation-summary', Severity.Error, 'Operation is missing a summary or it is empty.', '/paths/~1helloworld/get'],
      ],
    });
  });

  test('test rule for OpenAPI 3.1.0 triggers for invalid document', async () => {
    await testInstance.validateOas({
      oasYaml: `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
  description: Test API definition
servers:
  - url: http://localhost
paths:
  /helloworld:
    get:
      description: Hello World
      operationId: helloWorld
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: string
      `,
      expected: [
        ['operation-summary', Severity.Error, 'Operation is missing a summary or it is empty.', '/paths/~1helloworld/get'],
      ],
    });
  });
});