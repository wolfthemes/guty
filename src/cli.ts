#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";

import { buildDirectory, watchDirectory, type BuildResult } from "./compiler/build.js";

interface Args {
  command: string | undefined;
  input: string | undefined;
  outputDir: string;
  blockSources: string[];
  watch: boolean;
}

function printUsage(): void {
  console.error("Usage: guty build <input-dir> --out <output-dir> [--watch] [--blocks <block-src-dir>]...");
  console.error("       guty watch <input-dir> --out <output-dir> [--blocks <block-src-dir>]...");
}

function parseArgs(argv: string[]): Args {
  const [command, input, ...rest] = argv;
  let outputDir = "dist";
  const blockSources: string[] = [];
  let watchMode = false;

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];

    if (arg === "--watch") {
      watchMode = true;
      continue;
    }

    if (arg === "--out") {
      const value = rest[index + 1];

      if (!value) {
        throw new Error("Missing value for --out.");
      }

      outputDir = value;
      index += 1;
      continue;
    }

    if (arg === "--blocks") {
      const value = rest[index + 1];

      if (!value) {
        throw new Error("Missing value for --blocks.");
      }

      blockSources.push(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { command, input, outputDir, blockSources, watch: watchMode };
}

// Optional guty.config.json ({ "blocks": ["..."] }) in the current directory,
// merged with any --blocks flags. Paths are resolved relative to the config file.
function readConfigBlockSources(cwd: string): string[] {
  const configPath = path.join(cwd, "guty.config.json");

  try {
    const config = JSON.parse(readFileSync(configPath, "utf8")) as { blocks?: unknown };

    if (!Array.isArray(config.blocks)) {
      return [];
    }

    return config.blocks
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => path.resolve(cwd, entry));
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if ((args.command !== "build" && args.command !== "watch") || !args.input) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const inputDir = path.resolve(process.cwd(), args.input);
  const outputDir = path.resolve(process.cwd(), args.outputDir);
  const blockSources = [
    ...readConfigBlockSources(process.cwd()),
    ...readConfigBlockSources(inputDir),
    ...args.blockSources.map((source) => path.resolve(process.cwd(), source)),
  ].filter((value, index, values) => values.indexOf(value) === index);
  const logResults = (results: BuildResult[]): void => {
    for (const result of results) {
      console.log(`${path.relative(process.cwd(), result.inputPath)} -> ${path.relative(process.cwd(), result.outputPath)}`);
    }
  };

  if (args.command === "watch" || args.watch) {
    await watchDirectory(inputDir, outputDir, {
      blockSources,
      onBuildStart: () => {
        console.log("Building...");
      },
      onBuildEnd: (results) => {
        logResults(results);
        console.log("Watching for changes...");
      },
      onBuildError: (error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
      },
    });
    return;
  }

  const results = await buildDirectory(inputDir, outputDir, { blockSources });
  logResults(results);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
