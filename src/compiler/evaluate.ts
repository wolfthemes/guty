import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

import type { ElementNode } from "../types.js";

const RUNTIME_PREAMBLE = `
const Page = "Page";
const Section = "Section";
const Container = "Container";
const Heading = "Heading";
const Paragraph = "Paragraph";
function normalizeChildren(input) {
  const result = [];
  for (const child of input) {
    if (Array.isArray(child)) {
      result.push(...normalizeChildren(child));
      continue;
    }
    if (child === null || child === undefined || typeof child === "boolean") {
      continue;
    }
    if (typeof child === "number") {
      result.push(String(child));
      continue;
    }
    result.push(child);
  }
  return result;
}
function createElement(type, props, ...children) {
  return {
    type,
    props: props ?? {},
    children: normalizeChildren(children),
  };
}
`;

function transpileSource(source: string, filePath: string): string {
  const wrappedSource = `${RUNTIME_PREAMBLE}\n${source}`;
  const result = ts.transpileModule(wrappedSource, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.React,
      jsxFactory: "createElement",
      strict: true,
    },
    fileName: filePath,
    reportDiagnostics: true,
  });

  if (result.diagnostics?.length) {
    const message = ts.formatDiagnosticsWithColorAndContext(result.diagnostics, {
      getCanonicalFileName: (value) => value,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => "\n",
    });

    throw new Error(`Failed to transpile ${filePath}\n${message}`);
  }

  return result.outputText;
}

export async function evaluateTemplate(filePath: string): Promise<ElementNode> {
  const source = await readFile(filePath, "utf8");
  const output = transpileSource(source, filePath);
  const tempDir = await mkdtemp(path.join(tmpdir(), "guty-"));
  const tempFile = path.join(tempDir, "template.mjs");

  try {
    await writeFile(tempFile, output, "utf8");
    const module = (await import(pathToFileURL(tempFile).href)) as { default?: unknown };

    if (!module.default || typeof module.default !== "object" || !("type" in module.default)) {
      throw new Error(`Template ${filePath} must default export a Guty page.`);
    }

    return module.default as ElementNode;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
