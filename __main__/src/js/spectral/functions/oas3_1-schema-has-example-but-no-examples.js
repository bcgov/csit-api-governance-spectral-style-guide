// functions/schema-has-example-but-no-examples.js

export default (schema) => {
  // Skip if schema is not an object
  if (!schema || typeof schema !== 'object') {
    return [];
  }

  const hasExample = 'example' in schema && schema.example !== undefined;
  const hasExamples = 'examples' in schema && schema.examples !== undefined;

  // Only warn when 'example' exists BUT 'examples' does NOT
  if (hasExample && !hasExamples) {
    return [{
      message: "Prefer 'examples' over (or in addition to) the deprecated 'example' in OAS 3.1 schemas"
    }];
  }

  // No violation in all other cases:
  // - only examples
  // - both example and examples
  // - neither
  return [];
};