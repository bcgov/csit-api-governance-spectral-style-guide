/**
 * Spectral custom function to detect empty string property names
 * 
 * The rule must set 'resolved' to false to avoid violations being detected twice when $ref is used.
 */
var noEmptyPropertyNames = (schema, _, context) => {
  
  const results = [];

  if (!schema || typeof schema !== 'object') {
    return results;
  }

  const { path: propertiesPath } = context;

  Object.keys(schema).forEach((key) => {
    if (key === '') {

      // Point the violation directly at the empty key for precise highlighting
      const violationPath = [...propertiesPath, ''];

      results.push({
        message: `Empty string property name found in schema. Use 'additionalProperties' instead for dynamic or arbitrary keys.`,
        path: violationPath,
      });
    }
  });

  return results;
};

export { noEmptyPropertyNames as default };
