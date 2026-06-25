import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { compileDocument } from "./compile.js";
import { evaluateTemplate } from "./evaluate.js";
import { serializeDocument } from "./serialize.js";

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

function getOutputPath(inputDir: string, outputDir: string, templatePath: string): string {
  const relativePath = path.relative(inputDir, templatePath);
  const htmlName = relativePath.slice(0, -TEMPLATE_EXTENSION.length) + ".html";
  return path.join(outputDir, htmlName);
}

export interface BuildResult {
  inputPath: string;
  outputPath: string;
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
      const html = serializeDocument(document);
      const outputPath = getOutputPath(inputDir, outputDir, templatePath);

      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, html, "utf8");

      return {
        inputPath: templatePath,
        outputPath,
      };
    }),
  );
}
