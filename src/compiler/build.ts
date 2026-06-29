import { watch, type FSWatcher } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { createBlockRenderer, loadBlockRegistry } from "./blocks.js";
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

async function collectDirectories(inputDir: string): Promise<string[]> {
	const entries = await readdir(inputDir, { withFileTypes: true });
	const children = await Promise.all(
		entries.map(async (entry) => {
			if (!entry.isDirectory()) {
				return [];
			}

			const fullPath = path.join(inputDir, entry.name);
			return collectDirectories(fullPath);
		}),
	);

	return [inputDir, ...children.flat()].sort();
}

export interface BuildResult {
	inputPath: string;
	outputPath: string;
	target: OutputTargetKind;
}

export interface BuildOptions {
	// Directories scanned for custom block sources (block.json + save.js).
	blockSources?: string[];
}

export interface WatchOptions extends BuildOptions {
	debounceMs?: number;
	onBuildStart?: () => void;
	onBuildEnd?: (results: BuildResult[]) => void;
	onBuildError?: (error: unknown) => void;
}

export interface BuildWatcher {
	readonly closed: boolean;
	close: () => void;
}

export async function buildDirectory(
	inputDir: string,
	outputDir: string,
	options: BuildOptions = {},
): Promise<BuildResult[]> {
	const templates = await collectTemplates(inputDir);

	if (templates.length === 0) {
		throw new Error(`No ${TEMPLATE_EXTENSION} files found in ${inputDir}.`);
	}

	const registry = await loadBlockRegistry(options.blockSources ?? []);
	const renderBlock = createBlockRenderer(registry);

	return Promise.all(
		templates.map(async (templatePath) => {
			const page = await evaluateTemplate(templatePath);
			const target = resolveOutputTarget(inputDir, outputDir, templatePath);
			const document = compileDocument(page, { renderBlock, outputKind: target.kind });
			const markup = serializeDocument(document);
			const output = await target.render(markup);

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

function shouldRebuild(filename: string | Buffer | null): boolean {
	if (!filename) {
		return true;
	}

	const value = filename.toString();

	return (
		value.endsWith(TEMPLATE_EXTENSION) ||
		value.endsWith(".js") ||
		value.endsWith(".jsx") ||
		value.endsWith(".ts") ||
		value.endsWith(".tsx") ||
		value === "block.json"
	);
}

export async function watchDirectory(
	inputDir: string,
	outputDir: string,
	options: WatchOptions = {},
): Promise<BuildWatcher> {
	const debounceMs = options.debounceMs ?? 100;
	const blockSources = options.blockSources ?? [];
	const watchRoots = [inputDir, ...blockSources];
	const watchers = new Map<string, FSWatcher>();
	let closed = false;
	let timer: NodeJS.Timeout | undefined;
	let running = false;
	let queued = false;

	const scheduleBuild = (): void => {
		if (closed) {
			return;
		}

		if (timer) {
			clearTimeout(timer);
		}

		timer = setTimeout(() => {
			timer = undefined;
			void runBuild();
		}, debounceMs);
	};

	const refreshWatchers = async (): Promise<void> => {
		const directories = (await Promise.all(watchRoots.map((root) => collectDirectories(root)))).flat();

		for (const directory of directories) {
			if (watchers.has(directory)) {
				continue;
			}

			const watcher = watch(directory, (event, filename) => {
				if (event !== "rename" && !shouldRebuild(filename)) {
					return;
				}

				scheduleBuild();
			});

			watchers.set(directory, watcher);
		}
	};

	const runBuild = async (): Promise<void> => {
		if (closed) {
			return;
		}

		if (running) {
			queued = true;
			return;
		}

		running = true;
		options.onBuildStart?.();

		try {
			await refreshWatchers();
			const results = await buildDirectory(inputDir, outputDir, { blockSources });
			options.onBuildEnd?.(results);
		} catch (error) {
			options.onBuildError?.(error);
		} finally {
			running = false;

			if (queued) {
				queued = false;
				scheduleBuild();
			}
		}
	};

	await refreshWatchers();
	await runBuild();

	return {
		get closed() {
			return closed;
		},
		close: () => {
			closed = true;

			if (timer) {
				clearTimeout(timer);
				timer = undefined;
			}

			for (const watcher of watchers.values()) {
				watcher.close();
			}

			watchers.clear();
		},
	};
}
