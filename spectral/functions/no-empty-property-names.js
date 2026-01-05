/**
 * Spectral custom function to detect empty string property names
 * 
 * The rule must set 'resolved' to false to avoid violations being detected twice when $ref is used.
 */
export default (targetVal, _, context) => {
  
  const results = [];

  if (!targetVal || typeof targetVal !== 'object') {
    return results;
  }

  const { path: propertiesPath } = context;

  Object.keys(targetVal).forEach((key) => {
    if (key === '') {

      // Extract readable schema name
      let schemaName = context.path.join('/');

      // Point the violation directly at the empty key for precise highlighting
      const violationPath = [...propertiesPath, ''];

      results.push({
        message: `Empty string property name found in schema '${schemaName}'. Use 'additionalProperties' instead for dynamic or arbitrary keys.`,
        path: violationPath,
      });
    }
  });

  return results;
}