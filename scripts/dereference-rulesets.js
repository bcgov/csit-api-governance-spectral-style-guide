// dereference-rulesets.js
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import yaml from 'js-yaml';
import { Resolver } from '@stoplight/json-ref-resolver';

const INPUT_BASE = path.join(process.cwd(), '__main__', 'src', 'yaml', 'spectral');
const OUTPUT_BASE = path.join(process.cwd(), 'spectral');

async function dereferenceFile(inputFile) {
  const relative = path.relative(INPUT_BASE, inputFile);
  const outputFile = path.join(OUTPUT_BASE, relative);
  const baseDir = path.dirname(inputFile);

  console.log(`Dereferencing: ${relative}`);

  const content = await fs.readFile(inputFile, 'utf8');
  const parsed = yaml.load(content);

  const resolver = new Resolver({
    // Define explicit resolver for 'file' scheme and relative paths
    resolvers: {
      file: {
        resolve: async (ref) => {
          let refPath = ref.path();  // e.g. "schemas/problem-details.yaml"

          // If no scheme or relative, treat as file path relative to baseDir
          if (!ref.scheme() || ref.scheme() === 'file') {
            refPath = path.resolve(baseDir, refPath);
          }

          try {
            const raw = await fs.readFile(refPath, 'utf8');
            return yaml.load(raw);
          } catch (err) {
            throw new Error(`Failed to read referenced file ${refPath}: ${err.message}`);
          }
        },
      },
      // Optional: Add 'http'/'https' if you ever have remote refs
    },
  });

  const resolved = await resolver.resolve(parsed, {
    baseUri: `file://${inputFile}`,  // Ensures relative refs anchor correctly
  });

  if (resolved.errors.length > 0) {
    console.warn(`Resolution issues for ${relative}:`, resolved.errors.map(e => ({
      code: e.code,
      message: e.message,
      path: e.path?.join('.') || 'root',
    })));
  }

  await fs.mkdir(path.dirname(outputFile), { recursive: true });

  const outputYaml = `---
# Fully dereferenced Spectral ruleset (all $ref resolved)
# Original: ${relative}
# Generated: ${new Date().toISOString()}
${yaml.dump(resolved.result, { lineWidth: -1, indent: 2, noRefs: true })}`;

  await fs.writeFile(outputFile, outputYaml, 'utf8');

  console.log(`  → Wrote dereferenced file: ${path.relative(process.cwd(), outputFile)}`);
}

async function main() {
  console.log('Dereferencing Spectral rulesets recursively...\n');

  const files = await glob('**/*ruleset.{yaml,yml}', { cwd: INPUT_BASE, absolute: true });

  if (files.length === 0) {
    console.log('No matching ruleset files found.');
    return;
  }

  console.log(`Found ${files.length} files to process.`);

  for (const file of files) {
    await dereferenceFile(file).catch(err => {
      console.error(`Error on ${path.relative(INPUT_BASE, file)}:`, err.message);
    });
  }

  console.log('\nDereferencing complete.');
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});