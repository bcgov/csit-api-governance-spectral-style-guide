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
    const rulesetFile = path.join(__dirname, '..', '..',  '..', 'spectral', 'basic-ruleset.yaml');
    const ruleset = await bundleAndLoadRuleset(rulesetFile, { fs, fetch });
    spectral = new Spectral();
    await spectral.setRuleset(ruleset);
  });

  test('business-spec', async () => {
    const oasFile = path.join(__dirname, '..', 'resources', 'registry', 'business-spec.yaml');
    const source = fs.readFileSync(oasFile, 'utf8');
    const document = new Document(source, Parsers.Yaml, oasFile);
    const results = await spectral.run(document);

    const expectedResults = [
      ['no-empty-property-names', Severity.Warning, 'Empty string property name found in schema \'components/schemas/Diff/anyOf/0/properties\'. Use \'additionalProperties\' instead for dynamic or arbitrary keys.', '/components/schemas/Diff/anyOf/0/properties/'],
      ['no-empty-property-names', Severity.Warning, 'Empty string property name found in schema \'components/schemas/filing_header/properties\'. Use \'additionalProperties\' instead for dynamic or arbitrary keys.', '/components/schemas/filing_header/properties/'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-business\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-addresses\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}~1addresses/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-document-documentName\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}~1documents~1{documentName}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-filings-filingId-document\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}~1filings~1{filingId}~1documents~1{documentName}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-filings-filingId-documents\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}~1filings~1{filingId}~1documents/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-filings\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}~1filings/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-parties\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}~1parties/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-search\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1search/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-business\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-businesses-identifier-filings\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}~1filings/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'put-businesses-identifier-filings-filingId\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}~1filings~1{filingId}/put/operationId'],
      ['query-param-camel-case', Severity.Warning, 'Query parameter \'only_validate\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1{identifier}~1filings/post/parameters/1/name'],
      ['query-param-camel-case', Severity.Warning, 'Query parameter \'only_validate\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses/post/parameters/1/name'],
      ['schema-property-camel-case', Severity.Warning, 'Schema property \'\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/components/schemas/Diff/anyOf/0/properties/'],
      ['schema-property-camel-case', Severity.Warning, 'Schema property \'\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/components/schemas/filing_header/properties/'],
      ['schema-property-camel-case', Severity.Warning, 'Schema property \'BN\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/components/schemas/Suggestion_item/properties/BN'],
      ['schema-property-camel-case', Severity.Warning, 'Schema property \'QTime\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1search/get/responses/200/content/application~1json/schema/properties/responseHeader/properties/QTime'],
      ['schema-property-camel-case', Severity.Warning, 'Schema property \'search-term\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1businesses~1search/get/responses/200/content/application~1json/schema/properties/suggest/properties/search-term'],
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

  test('connect-spec', async () => {
    const oasFile = path.join(__dirname, '..', 'resources', 'registry', 'connect-spec.yaml');
    const source = fs.readFileSync(oasFile, 'utf8');
    const document = new Document(source, Parsers.Yaml, oasFile);
    const results = await spectral.run(document);

    const expectedResults = [
      ['oas3-schema', Severity.Error, '"application~1json" property must be object.', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}/patch/requestBody/content/application~1json'],
      ['oas3-schema', Severity.Error, '"application~1json" property must not be valid.', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}/patch/requestBody/content/application~1json'],
      ['oas3-schema', Severity.Error, '"required" property must be array.', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1contacts/put/requestBody/content/application~1json/schema/properties/email/required'],
      ['oas3-schema', Severity.Error, '"required" property must be array.', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1contacts/put/requestBody/content/application~1json/schema/properties/phone/required'],
      ['oas3-schema', Severity.Error, '"required" property must be array.', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1contacts/put/requestBody/content/application~1json/schema/properties/phoneExtension/required'],
      ['oas3-schema', Severity.Error, '"type" property must be equal to one of the allowed values: "array", "boolean", "integer", "number", "object", "string". Did you mean "boolean"?.', '/components/schemas/AffiliationInvitationResponse/properties/isDeleted/type'],
      ['oas3-schema', Severity.Error, 'Property "401" is not expected to be here.', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations~1{business_identifier}/get/responses/400/401'],
      ['oas3-schema', Severity.Error, 'Property "401" is not expected to be here.', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1authorization~1{authorize_action}/patch/responses/400/401'],
      ['oas3-schema', Severity.Error, 'Property "403" is not expected to be here.', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1authentication/get/responses/401/403'],
      ['oas3-schema', Severity.Error, 'Property "403" is not expected to be here.', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations~1{business_identifier}/get/responses/400/403'],
      ['oas3-schema', Severity.Error, 'Property "403" is not expected to be here.', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1authorization~1{authorize_action}/patch/responses/400/403'],
      ['oas3-schema', Severity.Error, 'Property "404" is not expected to be here.', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1authentication/get/responses/401/404'],
      ['oas3-schema', Severity.Error, 'Property "tags" is not expected to be here.', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations/tags'],
      ['oas3-unused-component', Severity.Warning, 'Potentially unused component has been detected.', '/components/schemas/AffiliationSearchResponse'],
      ['oas3-valid-media-example', Severity.Warning, '"fromOrgId" property type must be string', '/paths/~1auth~1api~1v1~1affiliationInvitations/post/requestBody/content/application~1json/examples/magic-link/value/fromOrgId'],
      ['oas3-valid-media-example', Severity.Warning, '"fromOrgId" property type must be string', '/paths/~1auth~1api~1v1~1affiliationInvitations/post/requestBody/content/application~1json/examples/delegation-request/value/fromOrgId'],
      ['oas3-valid-media-example', Severity.Warning, '"value" property must have required property "passCode"', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations/post/requestBody/content/application~1json/examples/bc-ben-passcode/value'],
      ['oas3-valid-media-example', Severity.Warning, '"value" property must have required property "passCode"', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations/post/requestBody/content/application~1json/examples/sp-gp-passcode/value'],
      ['oas3-valid-media-example', Severity.Warning, '"value" property must have required property "passCode"', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations/post/requestBody/content/application~1json/examples/sp-gp-passcode-organization/value'],
      ['oas3-valid-schema-example', Severity.Warning, '"example" property must be equal to one of the allowed values: "EMAIL", "REQUEST". Did you mean "REQUEST"?', '/components/schemas/AffiliationInvitationCreateResponse/properties/type/example'],
      ['oas3-valid-schema-example', Severity.Warning, 'schema is invalid: data/required must be array', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1contacts/put/requestBody/content/application~1json/schema/properties/email/example'],
      ['oas3-valid-schema-example', Severity.Warning, 'schema is invalid: data/required must be array', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1contacts/put/requestBody/content/application~1json/schema/properties/phone/example'],
      ['oas3-valid-schema-example', Severity.Warning, 'schema is invalid: data/required must be array', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1contacts/put/requestBody/content/application~1json/schema/properties/phoneExtension/example'],
      ['oas3-valid-schema-example', Severity.Warning, 'schema is invalid: data/type must be equal to one of the allowed values, data/type must be array, data/type must match a schema in anyOf', '/components/schemas/AffiliationInvitationResponse/properties/isDeleted/default'],
      ['operation-description', Severity.Warning, 'Operation "description" must be present and non-empty string.', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations~1{business_identifier}/get'],
      ['operation-description', Severity.Warning, 'Operation "description" must be present and non-empty string.', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations/post'],
      ['operation-description', Severity.Warning, 'Operation "description" must be present and non-empty string.', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1authorization~1{authorize_action}/patch'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'accept_affiliation_invitation_token\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1token~1{token}/put/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'delete_affiliation_invitation\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}/delete/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get_affiliation_invitation\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get_affiliation_invitations\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get_entity_authentication\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1authentication/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'patch_affiliation_invitation_authorization\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1authorization~1{authorize_action}/patch/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'patch_AffiliationInvitation\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}/patch/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post_affiliation_invitation\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-affiliation\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations/post/operationId'],
      ['operation-operationId', Severity.Warning, 'Operation must have "operationId".', '/paths/~1auth~1api~1v1~1orgs~1affiliation~1{business_identifier}/get'],
      ['operation-operationId', Severity.Warning, 'Operation must have "operationId".', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations~1{business_identifier}/get'],
      ['operation-operationId', Severity.Warning, 'Operation must have "operationId".', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1contacts/put'],
      ['operation-operationId', Severity.Warning, 'Operation must have "operationId".', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations/get'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'account_id\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations~1{business_identifier}/get/parameters/0/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'account_id\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations/parameters/0/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'affiliation_invitation_id\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}/parameters/0/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'affiliation_invitation_id\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1token~1{token}/parameters/0/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'affiliation_invitation_id\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1authorization~1{authorize_action}/parameters/0/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'authorize_action\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1authorization~1{authorize_action}/parameters/1/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'business_identifier\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1orgs~1affiliation~1{business_identifier}/parameters/0/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'business_identifier\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1authentication/parameters/0/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'business_identifier\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1orgs~1{account_id}~1affiliations~1{business_identifier}/get/parameters/1/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'business_identifier\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1auth~1api~1v1~1entities~1{business_identifier}~1contacts/put/parameters/0/name'],
      ['path-segments-kebab-case', Severity.Warning, 'Static path segment \'affiliationInvitations\' should be kebab-case (lowercase letters, numbers, hyphens only)', '/paths/~1auth~1api~1v1~1affiliationInvitations'],
      ['path-segments-kebab-case', Severity.Warning, 'Static path segment \'affiliationInvitations\' should be kebab-case (lowercase letters, numbers, hyphens only)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}'],
      ['path-segments-kebab-case', Severity.Warning, 'Static path segment \'affiliationInvitations\' should be kebab-case (lowercase letters, numbers, hyphens only)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1token~1{token}'],
      ['path-segments-kebab-case', Severity.Warning, 'Static path segment \'affiliationInvitations\' should be kebab-case (lowercase letters, numbers, hyphens only)', '/paths/~1auth~1api~1v1~1affiliationInvitations~1{affiliation_invitation_id}~1authorization~1{authorize_action}'],
      ['schema-property-camel-case', Severity.Warning, 'Schema property \'business_identifier\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/components/schemas/AffiliationInvitationResponse/properties/entity/properties/business_identifier'],
      ['schema-property-camel-case', Severity.Warning, 'Schema property \'corp_type\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/components/schemas/AffiliationInvitationResponse/properties/entity/properties/corp_type'],
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

  test('mhr-spec', async () => {
    const oasFile = path.join(__dirname, '..', 'resources', 'registry', 'mhr-spec.yaml');
    const source = fs.readFileSync(oasFile, 'utf8');
    const document = new Document(source, Parsers.Yaml, oasFile);
    const results = await spectral.run(document);

    const expectedResults = [
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-searches-select-results\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1mhr~1api~1v1~1search-results~1{searchId}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'list-search-history\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1mhr~1api~1v1~1search-history/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-search\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1mhr~1api~1v1~1searches/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-searches-select-results\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1mhr~1api~1v1~1search-results~1{searchId}/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'put-update-search-select\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1mhr~1api~1v1~1searches~1{searchId}/put/operationId'],
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

  test('payment-spec', async () => {
    const oasFile = path.join(__dirname, '..', 'resources', 'registry', 'payment-spec.yaml');
    const source = fs.readFileSync(oasFile, 'utf8');
    const document = new Document(source, Parsers.Yaml, oasFile);
    const results = await spectral.run(document);

    const expectedResults = [
      ['oas3-unused-component', Severity.Warning, 'Potentially unused component has been detected.', '/components/responses/NotFound'],
      ['oas3-unused-component', Severity.Warning, 'Potentially unused component has been detected.', '/components/responses/InternalServerError'],
      ['oas3-valid-schema-example', Severity.Warning, '"default" property type must be integer', '/paths/~1pay~1api~1v1~1accounts~1{accountId}~1payments~1queries/post/parameters/1/schema/default'],
      ['oas3-valid-schema-example', Severity.Warning, '"default" property type must be integer', '/components/schemas/TransactionReports/properties/limit/default'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'create_transaction\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1payment-requests/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'delete_payment_request\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1payment-requests~1{invoice_identifier}/delete/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get_fees\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1fees~1{business_type}~1{filing_type}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get_payment_request\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1payment-requests~1{invoice_identifier}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'Get_Receipt\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1payment-requests~1{invoice_identifier}~1receipts/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get_statement\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1accounts~1{accountId}~1statements~1{statementId}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get_statements\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1accounts~1{accountId}~1statements/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'Post_Receipt\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1payment-requests~1{invoice_identifier}~1receipts/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'transaction_queries\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1accounts~1{accountId}~1payments~1queries/post/operationId'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'business_type\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1fees~1{business_type}~1{filing_type}/parameters/0/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'filing_type\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1fees~1{business_type}~1{filing_type}/parameters/1/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'invoice_identifier\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1payment-requests~1{invoice_identifier}/parameters/0/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'invoice_identifier\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1pay~1api~1v1~1payment-requests~1{invoice_identifier}~1receipts/parameters/0/name'],
      ['schema-property-camel-case', Severity.Warning, 'Schema property \'_links\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/components/schemas/Transaction/properties/_links'],
      // TODO The warning on object Links appears to be caused by the Invoice $ref using the invalid name '_links' and not the object itself.
      ['schema-property-camel-case', Severity.Warning, 'Schema property \'Links\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/components/schemas/Links'],
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

  test('platform', async () => {
    const oasFile = path.join(__dirname, '..', 'resources', 'registry', 'platform.yaml');
    const source = fs.readFileSync(oasFile, 'utf8');
    const document = new Document(source, Parsers.Yaml, oasFile);
    const results = await spectral.run(document);

    const expectedResults = [
      ['no-$ref-siblings', Severity.Error, '$ref must not be placed next to any other properties', '/paths/~1permits~1:batchValidate/post/callbacks/notification/{$request.body#~1control~1callBackUrl}/post/requestBody/content/application~1json/schema/properties/control/type'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'address-requirements\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1address~1:requirements/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'batch-validate-permit\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1permits~1:batchValidate/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'validate-permit\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1permits~1:validatePermit/post/operationId'],
      ['path-segments-kebab-case', Severity.Warning, 'Static path segment \':batchValidate\' should be kebab-case (lowercase letters, numbers, hyphens only)', '/paths/~1permits~1:batchValidate'],
      ['path-segments-kebab-case', Severity.Warning, 'Static path segment \':requirements\' should be kebab-case (lowercase letters, numbers, hyphens only)', '/paths/~1address~1:requirements'],
      ['path-segments-kebab-case', Severity.Warning, 'Static path segment \':validatePermit\' should be kebab-case (lowercase letters, numbers, hyphens only)', '/paths/~1permits~1:validatePermit'],
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

  test('ppr-spec', async () => {
    const oasFile = path.join(__dirname, '..', 'resources', 'registry', 'ppr-spec.yaml');
    const source = fs.readFileSync(oasFile, 'utf8');
    const document = new Document(source, Parsers.Yaml, oasFile);
    const results = await spectral.run(document);

    const expectedResults = [
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'delete-account-registration\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1registrations~1{registration_num}/delete/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'delete-financing-draft\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1drafts~1{document_id}/delete/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-account-codes\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1party-codes~1accounts/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-account-registration\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1registrations~1{registration_num}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-amendment-statement\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1amendments~1{amendment_registration_num}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-change-statement\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1changes~1{change_registration_num}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-debtor-names\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1debtorNames/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-discharge-statement\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1discharges~1{discharge_registration_num}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-draft-by-id\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1drafts~1{document_id}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-drafts\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1drafts/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-financing-statement\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-head-office-codes\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1party-codes~1head-offices~1{nameOrCode}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-party-codes-code\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1party-codes~1{code}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-renewal-statement\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1renewals~1{renewal_registration_num}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-searches-select-results\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1search-results~1{searchId}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-user-profile\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1user-profile/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'list-financing-statements\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'list-registrations\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1registrations/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'list-search-history\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1search-history/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-account-registration\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1registrations~1{registration_num}/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-amendment-statement\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1amendments/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-draft\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1drafts/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-financing-statements\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-search\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1searches/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-searches-select-results\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1search-results~1{searchId}/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-statement-discharge\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1discharges/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-statement-renewal\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1renewals/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'put-draft\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1drafts~1{document_id}/put/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'put-update-search-select\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1searches~1{searchId}/put/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'update-user-profile\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1user-profile/patch/operationId'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'amendment_registration_num\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1amendments~1{amendment_registration_num}/get/parameters/3/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'change_registration_num\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1changes~1{change_registration_num}/get/parameters/3/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'discharge_registration_num\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1discharges~1{discharge_registration_num}/get/parameters/3/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'document_id\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/components/parameters/document_id/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'registration_num\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/components/parameters/registration_num/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'renewal_registration_num\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1renewals~1{renewal_registration_num}/get/parameters/3/name'],
      ['path-segments-kebab-case', Severity.Warning, 'Static path segment \'debtorNames\' should be kebab-case (lowercase letters, numbers, hyphens only)', '/paths/~1ppr~1api~1v1~1financing-statements~1{registration_num}~1debtorNames'],
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

  test('regsearch-spec', async () => {
    const oasFile = path.join(__dirname, '..', 'resources', 'registry', 'regsearch-spec.yaml');
    const source = fs.readFileSync(oasFile, 'utf8');
    const document = new Document(source, Parsers.Yaml, oasFile);
    const results = await spectral.run(document);

    const expectedResults = [
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-document-data-v2\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1businesses~1{identifier}~1documents~1{document_key}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-document-data\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1businesses~1{identifier}~1documents~1{document_key}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-document-filings-filingId-filingName-v2\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1businesses~1{identifier}~1documents~1filings~1{filing_id}~1{filing_name}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-document-filings-filingId-filingName\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1businesses~1{identifier}~1documents~1filings~1{filing_id}~1{filing_name}/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-document-requests-v2\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1businesses~1{identifier}~1documents~1requests/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-businesses-identifier-document-requests\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1businesses~1{identifier}~1documents~1requests/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-purchases-v2\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1purchases/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'get-purchases\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1purchases/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-businesses-requests-v2\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1businesses~1{identifier}~1documents~1requests/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-businesses-requests\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1businesses~1{identifier}~1documents~1requests/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-v2-search-businesses-bulk\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1search~1businesses~1bulk/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-v2-search-businesses\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1search~1businesses/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'post-v2-search-parties\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1search~1parties/post/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'search_facets\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1businesses~1search~1facets/get/operationId'],
      ['operation-id-camel-case', Severity.Warning, 'Operation ID \'search_parties\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1businesses~1search~1parties/get/operationId'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'document_key\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1businesses~1{identifier}~1documents~1{document_key}/parameters/1/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'document_key\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1businesses~1{identifier}~1documents~1{document_key}/parameters/1/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'filing_id\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1businesses~1{identifier}~1documents~1filings~1{filing_id}~1{filing_name}/parameters/1/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'filing_id\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1businesses~1{identifier}~1documents~1filings~1{filing_id}~1{filing_name}/parameters/1/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'filing_name\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v1~1businesses~1{identifier}~1documents~1filings~1{filing_id}~1{filing_name}/parameters/2/name'],
      ['path-param-camel-case', Severity.Warning, 'Path parameter name \'filing_name\' should be camelCase (start with lowercase letter, no special characters except letters and numbers)', '/paths/~1v2~1businesses~1{identifier}~1documents~1filings~1{filing_id}~1{filing_name}/parameters/2/name'],
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