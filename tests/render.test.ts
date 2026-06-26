import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { loadBlockRegistry, renderBlockSave } from "../src/compiler/blocks.js";
import { buildDirectory } from "../src/compiler/build.js";
import { compileDocument } from "../src/compiler/compile.js";
import { evaluateTemplate } from "../src/compiler/evaluate.js";
import { serializeDocument } from "../src/compiler/serialize.js";
import type { BlockDocument, ElementNode } from "../src/types.js";

function normalizeMarkup(value: string): string {
  return value.replace(/>\s+</g, "><").trim();
}

async function createFixtureBlockSource(root: string): Promise<string> {
  const blockDir = path.join(root, "fixture-blocks", "marquee");
  await mkdir(blockDir, { recursive: true });

  await writeFile(
    path.join(blockDir, "block.json"),
    JSON.stringify(
      {
        name: "test-suite/marquee",
        attributes: {
          text: { type: "string", default: "" },
          direction: { type: "string", default: "left" },
          animationDuration: { type: "number", default: 12 },
          className: { type: "string" },
          align: { type: "string" },
          fontSize: { type: "string" },
          fontFamily: { type: "string" },
          style: { type: "object" },
        },
        supports: {
          align: ["wide", "full"],
          className: true,
          spacing: { margin: true, padding: true },
          typography: { fontSize: true, fontFamily: true },
        },
      },
      null,
      2,
    ),
    "utf8",
  );

  await writeFile(
    path.join(blockDir, "save.js"),
    [
      'import { useBlockProps } from "@wordpress/block-editor";',
      "",
      "export default function save({ attributes }) {",
      "  const blockProps = useBlockProps.save({",
      '    className: "fixture-marquee",',
      '    style: { "--fixture-duration": `${attributes.animationDuration}s` },',
      "  });",
      "",
      "  return (",
      "    <div {...blockProps}>",
      '      <div className={`fixture-track fixture-track--${attributes.direction}`}>',
      "        {Array.from({ length: 2 }).map((_, index) => (",
      '          <span key={index} className="fixture-item" dangerouslySetInnerHTML={{ __html: attributes.text ?? "" }} />',
      "        ))}",
      "      </div>",
      "    </div>",
      "  );",
      "}",
    ].join("\n"),
    "utf8",
  );

  return path.join(root, "fixture-blocks");
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

  it("passes group color attrs through to core/group blocks", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Section",
          props: {
            className: "wolf-about wolf-section-pad--big is-dark has-texture",
            align: "full",
            backgroundColor: "contrast",
            textColor: "base",
            layout: { type: "constrained", contentSize: "var(--wp--style--global--wide-size)" },
          },
          children: [],
        },
      ],
    };

    expect(compileDocument(page)).toEqual({
      blocks: [
        {
          blockName: "core/group",
          attrs: {
            tagName: "section",
            className: "wolf-about wolf-section-pad--big is-dark has-texture",
            align: "full",
            backgroundColor: "contrast",
            textColor: "base",
            layout: { type: "constrained", contentSize: "var(--wp--style--global--wide-size)" },
          },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    } satisfies BlockDocument);
  });

  it("maps native layout, typography, and spacing props onto group attrs", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Container",
          props: {
            tagName: "article",
            fontSize: "base",
            fontFamily: "serif",
            textAlign: "center",
            layoutType: "constrained",
            layoutContentSize: "var(--wp--style--global--wide-size)",
            layoutOrientation: "horizontal",
            pt: 40,
            px: "2rem",
          },
          children: [],
        },
      ],
    };

    expect(compileDocument(page)).toEqual({
      blocks: [
        {
          blockName: "core/group",
          attrs: {
            tagName: "article",
            fontSize: "base",
            fontFamily: "serif",
            style: {
              typography: {
                textAlign: "center",
              },
              spacing: {
                padding: {
                  top: "var:preset|spacing|40",
                  left: "2rem",
                  right: "2rem",
                },
              },
            },
            layout: {
              type: "constrained",
              contentSize: "var(--wp--style--global--wide-size)",
              orientation: "horizontal",
            },
          },
          innerBlocks: [],
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

describe("SiteLogo", () => {
  it("compiles a SiteLogo into a core/site-logo block", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "SiteLogo",
          props: {
            width: 120,
            isLink: true,
            shouldSyncIcon: true,
            className: "brand-mark",
          },
          children: [],
        },
      ],
    };

    expect(compileDocument(page)).toEqual({
      blocks: [
        {
          blockName: "core/site-logo",
          attrs: {
            className: "brand-mark",
            width: 120,
            isLink: true,
            shouldSyncIcon: true,
          },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    } satisfies BlockDocument);
  });

  it("serializes a SiteLogo as a self-closing site-logo block", () => {
    const document: BlockDocument = {
      blocks: [
        {
          blockName: "core/site-logo",
          attrs: { width: 120, isLink: true },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    };

    expect(normalizeMarkup(serializeDocument(document))).toBe(
      '<!-- wp:site-logo {"width":120,"isLink":true} /-->',
    );
  });

  it("requires SiteLogo to be void", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "SiteLogo",
          props: {},
          children: ["Logo"],
        },
      ],
    };

    expect(() => compileDocument(page)).toThrow(/SiteLogo is a void block/);
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

  it("renders a registered block through its real save function", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));

    try {
      const blockSource = await createFixtureBlockSource(root);
      const registry = await loadBlockRegistry([blockSource]);
      const entry = registry.get("test-suite/marquee");

      expect(entry).toBeDefined();

      const html = renderBlockSave(entry!, {
        text: 'Wolf<span class="accent">Themes</span>',
        direction: "left",
        animationDuration: 30,
        className: "my-class",
        align: "full",
        fontSize: "large",
        fontFamily: "fancy",
        style: {
          spacing: {
            margin: { top: "var:preset|spacing|40" },
            padding: { top: "2rem", bottom: "2rem" },
          },
          typography: {
            fontStyle: "italic",
          },
        },
      });

      expect(html).toContain(
        'class="wp-block-test-suite-marquee fixture-marquee my-class alignfull has-large-font-size has-font-size has-fancy-font-family"',
      );
      expect(html).toContain(
        'style="--fixture-duration:30s;margin-top:var(--wp--preset--spacing--40);padding-top:2rem;padding-bottom:2rem;font-style:italic"',
      );
      expect(html).toContain('<div class="fixture-track fixture-track--left">');
      expect(html).toContain('<span class="fixture-item">Wolf<span class="accent">Themes</span></span>');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("maps block sugar before rendering and escapes comment attrs the WordPress way", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));

    try {
      const blockSource = await createFixtureBlockSource(root);
      const registry = await loadBlockRegistry([blockSource]);
      const page: ElementNode = {
        type: "Page",
        props: {},
        children: [
          {
            type: "Block",
            props: {
              name: "test-suite/marquee",
              text: 'Wolf<span class="accent">Themes</span>',
              direction: "left",
              animationDuration: 30,
              class: "my-class",
              py: "2rem",
              mt: 40,
              align: "full",
            },
            children: [],
          },
        ],
      };

      const captured: Record<string, unknown>[] = [];
      const document = compileDocument(page, {
        renderBlock: (name, attrs) => {
          const entry = registry.get(name);
          if (!entry) {
            return undefined;
          }

          captured.push(attrs);
          return renderBlockSave(entry, attrs);
        },
      });
      const markup = normalizeMarkup(serializeDocument(document));

      expect(captured).toEqual([
        {
          text: 'Wolf<span class="accent">Themes</span>',
          direction: "left",
          animationDuration: 30,
          className: "my-class",
          style: {
            spacing: {
              padding: { top: "2rem", bottom: "2rem" },
              margin: { top: "var:preset|spacing|40" },
            },
          },
          align: "full",
        },
      ]);
      expect(markup).toContain('<!-- wp:test-suite/marquee {"text":"Wolf\\u003cspan class=\\u0022accent\\u0022\\u003eThemes\\u003c/span\\u003e"');
      expect(markup).toContain('"animationDuration":30');
      expect(markup).toContain('"align":"full"');
      expect(markup).toContain('"className":"my-class"');
      expect(markup).toContain('"margin":{"top":"var:preset|spacing|40"}');
      expect(markup).toContain('"padding":{"top":"2rem","bottom":"2rem"}');
      expect(markup).toContain('<span class="fixture-item">Wolf<span class="accent">Themes</span></span>');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
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

  it("serializes group color attrs into block comments and wrapper classes", () => {
    const document: BlockDocument = {
      blocks: [
        {
          blockName: "core/group",
          attrs: {
            tagName: "section",
            className: "wolf-about wolf-section-pad--big is-dark has-texture",
            align: "full",
            backgroundColor: "contrast",
            textColor: "base",
            layout: { type: "constrained", contentSize: "var(--wp--style--global--wide-size)" },
          },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    };

    expect(normalizeMarkup(serializeDocument(document))).toBe(
      '<!-- wp:group {"tagName":"section","className":"wolf-about wolf-section-pad\\u002d\\u002dbig is-dark has-texture","align":"full","backgroundColor":"contrast","textColor":"base","layout":{"type":"constrained","contentSize":"var(\\u002d\\u002dwp\\u002d\\u002dstyle\\u002d\\u002dglobal\\u002d\\u002dwide-size)"}} --><section class="wp-block-group alignfull wolf-about wolf-section-pad--big is-dark has-texture has-contrast-background-color has-background has-base-color has-text-color"></section><!-- /wp:group -->',
    );
  });

  it("serializes group typography, spacing, and custom tagName", () => {
    const document: BlockDocument = {
      blocks: [
        {
          blockName: "core/group",
          attrs: {
            tagName: "article",
            fontSize: "base",
            fontFamily: "serif",
            style: {
              typography: {
                textAlign: "center",
              },
              spacing: {
                padding: {
                  top: "var:preset|spacing|40",
                  left: "2rem",
                  right: "2rem",
                },
              },
            },
            layout: {
              type: "constrained",
              contentSize: "var(--wp--style--global--wide-size)",
              orientation: "horizontal",
            },
          },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    };

    expect(normalizeMarkup(serializeDocument(document))).toBe(
      '<!-- wp:group {"tagName":"article","fontSize":"base","fontFamily":"serif","style":{"typography":{"textAlign":"center"},"spacing":{"padding":{"top":"var:preset|spacing|40","left":"2rem","right":"2rem"}}},"layout":{"type":"constrained","contentSize":"var(\\u002d\\u002dwp\\u002d\\u002dstyle\\u002d\\u002dglobal\\u002d\\u002dwide-size)","orientation":"horizontal"}} --><article class="wp-block-group has-base-font-size has-font-size has-serif-font-family" style="padding-top:var(--wp--preset--spacing--40);padding-right:2rem;padding-left:2rem;text-align:center"></article><!-- /wp:group -->',
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

	it("renders registered blocks from block sources and falls back for unknown names", async () => {
		const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
		const inputDir = path.join(root, "examples");
		const outputDir = path.join(root, "dist");

		await mkdir(path.join(inputDir, "patterns"), { recursive: true });
		const blockSource = await createFixtureBlockSource(root);
		await writeFile(
			path.join(inputDir, "patterns", "marquee.guty.tsx"),
			[
				"// @guty pattern",
				"// title: Marquee",
				"// slug: test-suite/marquee",
				"",
				"export default (",
				"  <Page>",
				'    <Block name="test-suite/marquee" text={`Wolf<span>Theme</span>`} direction="left" animationDuration={30} class="my-class" mt={40} />',
				'    <Block name="test-suite/unregistered" foo="bar" />',
				"  </Page>",
				");",
			].join("\n"),
			"utf8",
		);

		try {
			await buildDirectory(inputDir, outputDir, { blockSources: [blockSource] });
			const php = await readFile(path.join(outputDir, "patterns", "marquee.php"), "utf8");

			expect(php).toContain('<!-- wp:test-suite/marquee {"text":"Wolf\\u003cspan\\u003eTheme\\u003c/span\\u003e","direction":"left","animationDuration":30,"className":"my-class","style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->');
			expect(php).toContain(
				'<div class="wp-block-test-suite-marquee fixture-marquee my-class" style="--fixture-duration:30s;margin-top:var(--wp--preset--spacing--40)">',
			);
			expect(php).toContain('<span class="fixture-item">Wolf<span>Theme</span></span>');
			expect(php).toContain('<!-- wp:test-suite/unregistered {"foo":"bar"} /-->');
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
