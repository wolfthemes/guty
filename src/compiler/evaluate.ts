import { readFile } from "node:fs/promises";
import vm from "node:vm";
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
      module: ts.ModuleKind.CommonJS,
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
  const module = { exports: {} as { default?: unknown } };
  const context = vm.createContext({
    module,
    exports: module.exports,
  });

  new vm.Script(output, { filename: filePath }).runInContext(context);

  if (!module.exports.default || typeof module.exports.default !== "object" || !("type" in module.exports.default)) {
    throw new Error(`Template ${filePath} must default export a Guty page.`);
  }

  return module.exports.default as ElementNode;
}
