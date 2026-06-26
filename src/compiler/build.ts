import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { compileDocument } from "./compile.js";
import { evaluateTemplate } from "./evaluate.js";
import { serializeDocument } from "./serialize.js";
import { resolveOutputTarget, type OutputTargetKind } from "./targets.js";

const TEMPLATE_EXTENSION = ".guty.tsx";

async function collectTemplates(inputDir: string): Promise<string[]> {
  const entries = await readdir(inputDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(inputDir, entry.name);

      if (entry.isDirectory()) {
        return collectTemplates(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(TEMPLATE_EXTENSION)) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat().sort();
}

export interface BuildResult {
	inputPath: string;
	outputPath: string;
	target: OutputTargetKind;
}

export async function buildDirectory(inputDir: string, outputDir: string): Promise<BuildResult[]> {
	const templates = await collectTemplates(inputDir);

	if (templates.length === 0) {
		throw new Error(`No ${TEMPLATE_EXTENSION} files found in ${inputDir}.`);
	}

	return Promise.all(
		templates.map(async (templatePath) => {
			const page = await evaluateTemplate(templatePath);
			const document = compileDocument(page);
			const markup = serializeDocument(document);
			const target = resolveOutputTarget(inputDir, outputDir, templatePath);
			const output = target.render(markup);

			await mkdir(path.dirname(target.outputPath), { recursive: true });
			await writeFile(target.outputPath, output, "utf8");

			return {
				inputPath: templatePath,
				outputPath: target.outputPath,
				target: target.kind,
			};
		}),
	);
}
