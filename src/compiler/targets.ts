import path from "node:path";

export type OutputTargetKind = "template" | "part" | "pattern";

export interface OutputTarget {
	kind: OutputTargetKind;
	outputPath: string;
	render(markup: string): string;
}

const TEMPLATE_EXTENSION = ".guty.tsx";

function renderPattern(markup: string): string {
	// Pattern metadata will be added in a later pass.
	return markup;
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
				render: renderPattern,
			};
		default:
			throw new Error(
				`Unsupported template location: ${templatePath}. Expected files inside templates/, parts/, or patterns/.`,
			);
	}
}
