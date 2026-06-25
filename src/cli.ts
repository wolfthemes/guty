#!/usr/bin/env node

import path from "node:path";

import { buildDirectory } from "./compiler/build.js";

interface Args {
  command: string | undefined;
  input: string | undefined;
  outputDir: string;
}

function printUsage(): void {
  console.error("Usage: guty build <input-dir> --out <output-dir>");
}

function parseArgs(argv: string[]): Args {
  const [command, input, ...rest] = argv;
  let outputDir = "dist";

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];

    if (arg === "--out") {
      const value = rest[index + 1];

      if (!value) {
        throw new Error("Missing value for --out.");
      }

      outputDir = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { command, input, outputDir };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.command !== "build" || !args.input) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const inputDir = path.resolve(process.cwd(), args.input);
  const outputDir = path.resolve(process.cwd(), args.outputDir);
  const results = await buildDirectory(inputDir, outputDir);

  for (const result of results) {
    console.log(`${path.relative(process.cwd(), result.inputPath)} -> ${path.relative(process.cwd(), result.outputPath)}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
