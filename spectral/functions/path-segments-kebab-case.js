var pathSegmentsKebabCase = (targetVal, _, context) => {
  const results = [];

  const fullPath = context.path[context.path.length - 1]; // The full path string, e.g. "/users/{id}/Profile"

  // Split the path into segments, remove leading/trailing empty strings
  const segments = fullPath.split('/').filter(Boolean);

  segments.forEach((segment, index) => {
    // Skip parameters (wrapped in {})
    if (segment.startsWith('{') && segment.endsWith('}')) {
      return;
    }

    // Check if static segment is valid kebab-case
    const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

    if (!kebabRegex.test(segment)) {

      results.push({
        message: `Static path segment '${segment}' should be kebab-case (lowercase letters, numbers, hyphens only)`,
        path: context.path, // Keep logical path at the operation level
      });
    }
  });

  return results;
};

export { pathSegmentsKebabCase as default };
