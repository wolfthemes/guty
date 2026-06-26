import { readFile } from "node:fs/promises";
import path from "node:path";

export type OutputTargetKind = "template" | "part" | "pattern";

export interface OutputTarget {
	kind: OutputTargetKind;
	outputPath: string;
	render(markup: string): Promise<string> | string;
}

const TEMPLATE_EXTENSION = ".guty.tsx";
const PATTERN_DIRECTIVE = "@guty pattern";
const PATTERN_HEADER_FIELDS = [
	"title",
	"slug",
	"description",
	"categories",
	"keywords",
	"viewportWidth",
	"inserter",
	"package",
] as const;

type PatternHeaderField = (typeof PATTERN_HEADER_FIELDS)[number];

interface PatternMetadata {
	title: string;
	slug: string;
	description?: string;
	categories?: string;
	keywords?: string;
	viewportWidth?: string;
	inserter?: string;
	package?: string;
}

const HEADER_LABELS: Record<PatternHeaderField, string> = {
	title: "Title",
	slug: "Slug",
	description: "Description",
	categories: "Categories",
	keywords: "Keywords",
	viewportWidth: "Viewport Width",
	inserter: "Inserter",
	package: "@package",
};

function isPatternHeaderField(value: string): value is PatternHeaderField {
	return (PATTERN_HEADER_FIELDS as readonly string[]).includes(value);
}

function parsePatternMetadata(source: string, filePath: string): PatternMetadata {
	const lines = source.split(/\r?\n/);
	const metadata: Partial<Record<PatternHeaderField, string>> = {};
	let sawDirective = false;
	let index = 0;

	while (index < lines.length) {
		const line = lines[index] ?? "";
		const trimmed = line.trim();

		if (trimmed.length === 0) {
			index += 1;
			continue;
		}

		if (!trimmed.startsWith("//")) {
			break;
		}

		const content = trimmed.slice(2).trim();

		if (content === PATTERN_DIRECTIVE) {
			sawDirective = true;
			index += 1;
			continue;
		}

		if (!sawDirective) {
			break;
		}

		const separatorIndex = content.indexOf(":");

		if (separatorIndex === -1) {
			throw new Error(`Pattern ${filePath} has an invalid metadata line: ${trimmed}`);
		}

		const key = content.slice(0, separatorIndex).trim();
		const value = content.slice(separatorIndex + 1).trim();

		if (!isPatternHeaderField(key)) {
			throw new Error(`Pattern ${filePath} uses an unsupported metadata key: ${key}`);
		}

		if (!value) {
			throw new Error(`Pattern ${filePath} is missing a value for metadata key: ${key}`);
		}

		metadata[key] = value;
		index += 1;
	}

	if (!sawDirective) {
		throw new Error(`Pattern ${filePath} is missing the required "// @guty pattern" metadata directive.`);
	}

	if (!metadata.title || !metadata.slug) {
		const missingFields = ["title", "slug"].filter((field) => !metadata[field as keyof PatternMetadata]);
		throw new Error(`Pattern ${filePath} is missing required metadata: ${missingFields.join(", ")}.`);
	}

	return metadata as PatternMetadata;
}

function renderPatternHeader(metadata: PatternMetadata): string {
	const lines = PATTERN_HEADER_FIELDS.flatMap((field) => {
		if (field === "package") {
			return [];
		}

		const value = metadata[field];
		return value ? [` * ${HEADER_LABELS[field]}: ${value}`] : [];
	});

	// @package follows the docblock-tag convention: a blank line, then the tag.
	if (metadata.package) {
		lines.push(" *", ` * @package ${metadata.package}`);
	}

	return ["<?php", "/**", ...lines, " */", "", "?>"].join("\n");
}

async function renderPattern(markup: string, templatePath: string): Promise<string> {
	const source = await readFile(templatePath, "utf8");
	const metadata = parsePatternMetadata(source, templatePath);
	return `${renderPatternHeader(metadata)}\n\n${markup}`;
}

export function resolveOutputTarget(
	inputDir: string,
	outputDir: string,
	templatePath: string,
): OutputTarget {
	const relativePath = path.relative(inputDir, templatePath);
	const segments = relativePath.split(path.sep);
	const rootDirectory = segments[0];

	if (!rootDirectory) {
		throw new Error(`Unable to resolve target for ${templatePath}.`);
	}

	switch (rootDirectory) {
		case "templates":
			return {
				kind: "template",
				outputPath: path.join(
					outputDir,
					relativePath.slice(0, -TEMPLATE_EXTENSION.length) + ".html",
				),
				render: (markup) => markup,
			};
		case "parts":
			return {
				kind: "part",
				outputPath: path.join(
					outputDir,
					relativePath.slice(0, -TEMPLATE_EXTENSION.length) + ".html",
				),
				render: (markup) => markup,
			};
		case "patterns":
			return {
				kind: "pattern",
				outputPath: path.join(
					outputDir,
					relativePath.slice(0, -TEMPLATE_EXTENSION.length) + ".php",
				),
				render: (markup) => renderPattern(markup, templatePath),
			};
		default:
			throw new Error(
				`Unsupported template location: ${templatePath}. Expected files inside templates/, parts/, or patterns/.`,
			);
	}
}
