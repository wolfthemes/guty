import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildDirectory } from "../src/compiler/build.js";
import { compileDocument } from "../src/compiler/compile.js";
import { evaluateTemplate } from "../src/compiler/evaluate.js";
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

describe("Pattern", () => {
  it("compiles a Pattern reference into a core/pattern block", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Pattern",
          props: { slug: "guty/hero" },
          children: [],
        },
      ],
    };

    expect(compileDocument(page)).toEqual({
      blocks: [
        {
          blockName: "core/pattern",
          attrs: { slug: "guty/hero" },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    } satisfies BlockDocument);
  });

  it("serializes a core/pattern block as a self-closing comment", () => {
    const document: BlockDocument = {
      blocks: [
        {
          blockName: "core/pattern",
          attrs: { slug: "guty/hero" },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    };

    expect(normalizeMarkup(serializeDocument(document))).toBe(
      '<!-- wp:pattern {"slug":"guty/hero"} /-->',
    );
  });

  it("requires a non-empty slug", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [{ type: "Pattern", props: {}, children: [] }],
    };

    expect(() => compileDocument(page)).toThrow(/Pattern requires a non-empty slug/);
  });
});

describe("Header / Navigation / Button", () => {
  it("compiles a header part into a Gutenberg block tree", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
    const filePath = path.join(root, "header.guty.tsx");

    await writeFile(
      filePath,
      [
        "<Page>",
        '  <Header className="wolf-header" align="full">',
        '    <Container className="wolf-header__inner" align="wide" layout={{ type: "flex", justifyContent: "space-between", flexWrap: "nowrap" }}>',
        '      <Navigation overlayMenu="mobile" className="wolf-nav" layout={{ type: "flex" }}>',
        '        <NavigationLink label="Home" url="/" />',
        '        <Button className="wolf-header__cta--drawer" url="/store">Browse</Button>',
        "      </Navigation>",
        "    </Container>",
        "  </Header>",
        "</Page>",
      ].join("\n"),
      "utf8",
    );

    try {
      const page = await evaluateTemplate(filePath);
      const markup = normalizeMarkup(serializeDocument(compileDocument(page)));

      expect(markup).toContain(
        '<!-- wp:group {"tagName":"header","className":"wolf-header","align":"full","layout":{"type":"constrained"}} -->',
      );
      expect(markup).toContain('<header class="wp-block-group alignfull wolf-header">');
      expect(markup).toContain('<div class="wp-block-group alignwide wolf-header__inner">');
      expect(markup).toContain(
        '<!-- wp:navigation {"overlayMenu":"mobile","className":"wolf-nav","layout":{"type":"flex"}} -->',
      );
      expect(markup).toContain('<!-- wp:navigation-link {"label":"Home","url":"/"} /-->');
      // -- is escaped to keep the HTML block comment valid (WordPress behavior).
      expect(markup).toContain(
        '<!-- wp:button {"className":"wolf-header__cta\\u002d\\u002ddrawer"} -->',
      );
      expect(markup).toContain(
        '<div class="wp-block-button wolf-header__cta--drawer"><a class="wp-block-button__link wp-element-button" href="/store">Browse</a></div>',
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("requires a label for NavigationLink", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [{ type: "NavigationLink", props: { url: "/" }, children: [] }],
    };

    expect(() => compileDocument(page)).toThrow(/NavigationLink requires a non-empty label/);
  });
});

describe("Block (generic custom blocks)", () => {
  it("serializes a void custom block with inline-prop attributes", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
    const filePath = path.join(root, "index.guty.tsx");

    await writeFile(
      filePath,
      [
        "<Page>",
        '  <Block name="wolf-store/theme-index" perPage={12} pagination="none" orderby="featured" order="DESC" cardHeading="h2" />',
        "</Page>",
      ].join("\n"),
      "utf8",
    );

    try {
      const page = await evaluateTemplate(filePath);
      const markup = normalizeMarkup(serializeDocument(compileDocument(page)));

      expect(markup).toBe(
        '<!-- wp:wolf-store/theme-index {"perPage":12,"pagination":"none","orderby":"featured","order":"DESC","cardHeading":"h2"} /-->',
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("serializes a custom block with children as a wrapperless container", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Block",
          props: { name: "wolf-store/grid", columns: 3 },
          children: [
            { type: "Block", props: { name: "wolf-store/card", id: 1 }, children: [] },
          ],
        },
      ],
    };

    expect(normalizeMarkup(serializeDocument(compileDocument(page)))).toBe(
      '<!-- wp:wolf-store/grid {"columns":3} --><!-- wp:wolf-store/card {"id":1} /--><!-- /wp:wolf-store/grid -->',
    );
  });

  it("emits a string child as verbatim raw save markup", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Block",
          props: { name: "wolf-blocks/marquee", direction: "left" },
          children: ['<div class="wp-block-wolf-blocks-marquee"><span>Hi</span></div>'],
        },
      ],
    };

    expect(normalizeMarkup(serializeDocument(compileDocument(page)))).toBe(
      '<!-- wp:wolf-blocks/marquee {"direction":"left"} --><div class="wp-block-wolf-blocks-marquee"><span>Hi</span></div><!-- /wp:wolf-blocks/marquee -->',
    );
  });

  it("rejects mixing raw HTML with child blocks", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Block",
          props: { name: "wolf-store/grid" },
          children: ["<div>", { type: "Block", props: { name: "wolf-store/card" }, children: [] }],
        },
      ],
    };

    expect(() => compileDocument(page)).toThrow(/cannot mix raw HTML with child blocks/);
  });

  it("requires a namespaced name", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [{ type: "Block", props: { name: "theme-index" }, children: [] }],
    };

    expect(() => compileDocument(page)).toThrow(/Block requires a namespaced name/);
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

describe("evaluateTemplate", () => {
	it("accepts bare TSX without export default", async () => {
		const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
		const filePath = path.join(root, "bare.guty.tsx");

		await writeFile(
			filePath,
			[
				"<Page>",
				"  <Section>",
				"    <Container>",
				"      <Heading level={1}>Hello</Heading>",
				"      <Paragraph>World</Paragraph>",
				"    </Container>",
				"  </Section>",
				"</Page>",
			].join("\n"),
			"utf8",
		);

		try {
			await expect(evaluateTemplate(filePath)).resolves.toEqual({
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
			} satisfies ElementNode);
		} finally {
			await rm(root, { recursive: true, force: true });
		}
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
		await writeFile(
			path.join(inputDir, "parts", "header.guty.tsx"),
			["// @guty pattern", "// title: Ignored", "// slug: ignored/header", "", templateSource].join("\n"),
			"utf8",
		);
		await writeFile(
			path.join(inputDir, "patterns", "hero.guty.tsx"),
			[
				"// @guty pattern",
				"// title: Hero",
				"// slug: seijaku/hero",
				"// categories: featured, banner",
				"// description: Large hero section",
				"// viewportWidth: 1400",
				"",
				templateSource,
			].join("\n"),
			"utf8",
		);

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
			expect(partHtml).not.toContain("Title: Ignored");
			expect(patternPhp).toContain("<?php");
			expect(patternPhp).toContain(" * Title: Hero");
			expect(patternPhp).toContain(" * Slug: seijaku/hero");
			expect(patternPhp).toContain(" * Categories: featured, banner");
			expect(patternPhp).toContain(" * Description: Large hero section");
			expect(patternPhp).toContain(" * Viewport Width: 1400");
			expect(patternPhp).toContain("<!-- wp:heading {\"level\":1} -->");
		} finally {
			await rm(root, { recursive: true, force: true });
		}
	});

	it("renders an @package docblock tag in the pattern header", async () => {
		const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
		const inputDir = path.join(root, "examples");
		const outputDir = path.join(root, "dist");

		await mkdir(path.join(inputDir, "patterns"), { recursive: true });
		await writeFile(
			path.join(inputDir, "patterns", "marquee.guty.tsx"),
			[
				"// @guty pattern",
				"// title: Marquee",
				"// slug: seijaku-fse/marquee",
				"// categories: banner",
				"// package: SeijakuFSE",
				"",
				'<Page><Block name="wolf-blocks/marquee" direction="left">{`<div>hi</div>`}</Block></Page>',
			].join("\n"),
			"utf8",
		);

		try {
			await buildDirectory(inputDir, outputDir);
			const php = await readFile(path.join(outputDir, "patterns", "marquee.php"), "utf8");

			expect(php).toContain(" * Categories: banner\n *\n * @package SeijakuFSE\n */\n\n?>");
			expect(php).toContain('<!-- wp:wolf-blocks/marquee {"direction":"left"} -->');
			expect(php).toContain("<div>hi</div>");
		} finally {
			await rm(root, { recursive: true, force: true });
		}
	});

	it("requires title and slug metadata for patterns", async () => {
		const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
		const inputDir = path.join(root, "examples");
		const outputDir = path.join(root, "dist");

		await mkdir(path.join(inputDir, "patterns"), { recursive: true });
		await writeFile(
			path.join(inputDir, "patterns", "broken.guty.tsx"),
			[
				"// @guty pattern",
				"// title: Broken Pattern",
				"",
				"export default (",
				"  <Page>",
				"    <Section>",
				"      <Container>",
				"        <Paragraph>Broken</Paragraph>",
				"      </Container>",
				"    </Section>",
				"  </Page>",
				");",
			].join("\n"),
			"utf8",
		);

		try {
			await expect(buildDirectory(inputDir, outputDir)).rejects.toThrow(
				/Pattern .*broken\.guty\.tsx is missing required metadata: slug\./,
			);
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
