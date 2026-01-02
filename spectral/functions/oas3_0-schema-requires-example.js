// functions/oas3_0-schema-requires-example.js

var oas3_0SchemaRequiresExample = (schema, _, context) => {
  const results = [];

  // Skip if this is literally a $ref object (unresolved reference)
  if (schema && typeof schema === 'object' && '$ref' in schema) {
    return results;
  }

  // Only continue if this looks like a real schema object
  if (!schema || typeof schema !== 'object') {
    return results;
  }

  // Check if the 'example' KEY exists at all
  // → undefined or null value is now allowed (treated as present but empty)
  const hasExampleKey = 'example' in schema;

  if (!hasExampleKey) {
    results.push({
      message: "Schema is missing a required 'example' (OAS 3.0 style)"
    });
  }

  return results;
};

export { oas3_0SchemaRequiresExample as default };
