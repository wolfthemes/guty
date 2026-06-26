import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildDirectory } from "../src/compiler/build.js";
import { compileDocument } from "../src/compiler/compile.js";
import { serializeDocument } from "../src/compiler/serialize.js";
import type { BlockDocument, ElementNode } from "../src/types.js";

function normalizeMarkup(value: string): string {
  return value.replace(/>\s+</g, "><").trim();
}

describe("compileDocument", () => {
  it("compiles a minimal page into a WordPress block tree", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Section",
          props: {},
          children: [
            {
              type: "Container",
              props: {},
              children: [
                {
                  type: "Heading",
                  props: { level: 1 },
                  children: ["Hello"],
                },
                {
                  type: "Paragraph",
                  props: {},
                  children: ["World"],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(compileDocument(page)).toEqual({
      blocks: [
        {
          blockName: "core/group",
          attrs: {
            tagName: "section",
            layout: { type: "constrained" },
          },
          innerBlocks: [
            {
              blockName: "core/group",
              attrs: {
                layout: { type: "constrained" },
              },
              innerBlocks: [
                {
                  blockName: "core/heading",
                  attrs: { level: 1 },
                  innerBlocks: [],
                  innerHTML: "Hello",
                },
                {
                  blockName: "core/paragraph",
                  attrs: {},
                  innerBlocks: [],
                  innerHTML: "World",
                },
              ],
              innerHTML: "",
            },
          ],
          innerHTML: "",
        },
      ],
    } satisfies BlockDocument);
  });
});

describe("serializeDocument", () => {
  it("serializes a WordPress block tree into Gutenberg HTML", () => {
    const document: BlockDocument = {
      blocks: [
        {
          blockName: "core/group",
          attrs: {
            tagName: "section",
            layout: { type: "constrained" },
          },
          innerBlocks: [
            {
              blockName: "core/group",
              attrs: {
                layout: { type: "constrained" },
              },
              innerBlocks: [
                {
                  blockName: "core/heading",
                  attrs: { level: 1 },
                  innerBlocks: [],
                  innerHTML: "Hello",
                },
                {
                  blockName: "core/paragraph",
                  attrs: {},
                  innerBlocks: [],
                  innerHTML: "World",
                },
              ],
              innerHTML: "",
            },
          ],
          innerHTML: "",
        },
      ],
    };

    expect(normalizeMarkup(serializeDocument(document))).toBe(
      '<!-- wp:group {"tagName":"section","layout":{"type":"constrained"}} --><section class="wp-block-group"><!-- wp:group {"layout":{"type":"constrained"}} --><div class="wp-block-group"><!-- wp:heading {"level":1} --><h1 class="wp-block-heading">Hello</h1><!-- /wp:heading --><!-- wp:paragraph --><p>World</p><!-- /wp:paragraph --></div><!-- /wp:group --></section><!-- /wp:group -->',
    );
  });
});

describe("buildDirectory", () => {
	it("preserves templates, parts, and patterns directories with target-specific output", async () => {
		const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
		const inputDir = path.join(root, "examples");
		const outputDir = path.join(root, "dist");

		await mkdir(path.join(inputDir, "templates"), { recursive: true });
		await mkdir(path.join(inputDir, "parts"), { recursive: true });
		await mkdir(path.join(inputDir, "patterns"), { recursive: true });

		const templateSource = [
			"export default (",
			"  <Page>",
			"    <Section>",
			"      <Container>",
			"        <Heading level={1}>Front Page</Heading>",
			"        <Paragraph>Compiled from TSX</Paragraph>",
			"      </Container>",
			"    </Section>",
			"  </Page>",
			");",
		].join("\n");

		await writeFile(path.join(inputDir, "templates", "front-page.guty.tsx"), templateSource, "utf8");
		await writeFile(path.join(inputDir, "parts", "header.guty.tsx"), templateSource, "utf8");
		await writeFile(path.join(inputDir, "patterns", "hero.guty.tsx"), templateSource, "utf8");

		try {
			const results = await buildDirectory(inputDir, outputDir);
			const templateHtml = await readFile(path.join(outputDir, "templates", "front-page.html"), "utf8");
			const partHtml = await readFile(path.join(outputDir, "parts", "header.html"), "utf8");
			const patternPhp = await readFile(path.join(outputDir, "patterns", "hero.php"), "utf8");

			expect(results).toHaveLength(3);
			expect(results).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						target: "template",
						outputPath: path.join(outputDir, "templates", "front-page.html"),
					}),
					expect.objectContaining({
						target: "part",
						outputPath: path.join(outputDir, "parts", "header.html"),
					}),
					expect.objectContaining({
						target: "pattern",
						outputPath: path.join(outputDir, "patterns", "hero.php"),
					}),
				]),
			);
			expect(templateHtml).toContain("<!-- wp:heading {\"level\":1} -->");
			expect(partHtml).toContain("<p>Compiled from TSX</p>");
			expect(patternPhp).toContain("<!-- wp:heading {\"level\":1} -->");
		} finally {
			await rm(root, { recursive: true, force: true });
		}
	});

	it("rejects templates outside native FSE directories", async () => {
		const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
		const inputDir = path.join(root, "examples");
		const outputDir = path.join(root, "dist");

		await mkdir(path.join(inputDir, "misc"), { recursive: true });
		await writeFile(
			path.join(inputDir, "misc", "orphan.guty.tsx"),
			[
				"export default (",
				"  <Page>",
				"    <Section>",
				"      <Container>",
				"        <Paragraph>Orphan</Paragraph>",
				"      </Container>",
				"    </Section>",
				"  </Page>",
				");",
			].join("\n"),
			"utf8",
		);

		try {
			await expect(buildDirectory(inputDir, outputDir)).rejects.toThrow(
				"Expected files inside templates/, parts/, or patterns/.",
			);
		} finally {
			await rm(root, { recursive: true, force: true });
		}
	});
});
