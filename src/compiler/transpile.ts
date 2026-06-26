import ts from "typescript";

/**
 * Transpile a TSX source string to CommonJS, emitting JSX as `createElement` /
 * `Fragment` calls. Shared by the template evaluator and the block-save loader.
 */
export function transpileToCjs(source: string, fileName: string): string {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.React,
      jsxFactory: "createElement",
      jsxFragmentFactory: "Fragment",
      strict: true,
    },
    fileName,
    reportDiagnostics: true,
  });

  if (result.diagnostics?.length) {
    const message = ts.formatDiagnosticsWithColorAndContext(result.diagnostics, {
      getCanonicalFileName: (value) => value,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => "\n",
    });

    throw new Error(`Failed to transpile ${fileName}\n${message}`);
  }

  return result.outputText;
}
