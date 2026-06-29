import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { loadBlockRegistry, renderBlockSave } from "../src/compiler/blocks.js";
import { buildDirectory, watchDirectory } from "../src/compiler/build.js";
import { compileDocument } from "../src/compiler/compile.js";
import { evaluateTemplate } from "../src/compiler/evaluate.js";
import { serializeDocument } from "../src/compiler/serialize.js";
import type { BlockDocument, ElementNode } from "../src/types.js";

function normalizeMarkup(value: string): string {
  return value.replace(/>\s+</g, "><").trim();
}

async function waitFor(assertion: () => Promise<void> | void, timeoutMs = 2000): Promise<void> {
	const startedAt = Date.now();
	let lastError: unknown;

	while (Date.now() - startedAt < timeoutMs) {
		try {
			await assertion();
			return;
		} catch (error) {
			lastError = error;
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
	}

	throw lastError;
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
          spacing: { margin: ["top", "bottom"], padding: true },
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
      '    "data-duration": attributes.animationDuration,',
      '    "data-direction": attributes.direction,',
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
          },
          innerBlocks: [
            {
              blockName: "core/group",
              attrs: {},
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
            anchor: "about-section",
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
            backgroundColor: "contrast",
            textColor: "base",
            anchor: "about-section",
            className: "wolf-about wolf-section-pad--big is-dark has-texture",
            align: "full",
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

  it("resolves theme-relative media URLs for cover and image blocks", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Cover",
          props: { url: "/assets/images/hero.jpg" },
          children: [],
        },
        {
          type: "Image",
          props: { src: "./assets/images/me.jpg" },
          children: [],
        },
      ],
    };

    expect(compileDocument(page)).toEqual({
      blocks: [
        {
          blockName: "core/cover",
          attrs: {
            url: "<?php echo esc_url( get_theme_file_uri() . '/assets/images/hero.jpg' ); ?>",
          },
          innerBlocks: [],
          innerHTML: "",
        },
        {
          blockName: "core/image",
          attrs: {
            src: "<?php echo esc_url( get_theme_file_uri() . '/assets/images/me.jpg' ); ?>",
          },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    } satisfies BlockDocument);
  });

  it("compiles columns and column wrappers with their supported attrs", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Columns",
          props: { verticalAlignment: "center" },
          children: [
            {
              type: "Column",
              props: { width: "60%", className: "wolf-about__main" },
              children: [
                {
                  type: "Heading",
                  props: { level: 2, className: "wolf-about__title" },
                  children: ["Hello"],
                },
                {
                  type: "Paragraph",
                  props: { className: "wolf-about__text" },
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
          blockName: "core/columns",
          attrs: { verticalAlignment: "center" },
          innerBlocks: [
            {
              blockName: "core/column",
              attrs: { className: "wolf-about__main", width: "60%" },
              innerBlocks: [
                {
                  blockName: "core/heading",
                  attrs: { level: 2, className: "wolf-about__title" },
                  innerBlocks: [],
                  innerHTML: "Hello",
                },
                {
                  blockName: "core/paragraph",
                  attrs: { className: "wolf-about__text" },
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

  it("compiles Main as a main-tagged group", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Main",
          props: { layoutType: "default" },
          children: [
            { type: "Pattern", props: { slug: "seijaku-fse/about-intro" }, children: [] },
          ],
        },
      ],
    };

    expect(compileDocument(page)).toEqual({
      blocks: [
        {
          blockName: "core/group",
          attrs: { tagName: "main", layout: { type: "default" } },
          innerBlocks: [
            {
              blockName: "core/pattern",
              attrs: { slug: "seijaku-fse/about-intro" },
              innerBlocks: [],
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

describe("reference-backed core elements", () => {
  it("compiles template parts, button groups, and text attrs", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        { type: "TemplatePart", props: { slug: "header", tagName: "header", area: "header" }, children: [] },
        {
          type: "Section",
          props: { tagName: "main", layout: { type: "default" }, anchor: "content" },
          children: [
            {
              type: "Buttons",
              props: { className: "wolf-actions", layout: { type: "flex", justifyContent: "center" } },
              children: [{ type: "Button", props: { url: "/store" }, children: ["Browse"] }],
            },
            {
              type: "Heading",
              props: { level: 1, textAlign: "center", fontSize: "hero" },
              children: ["Title"],
            },
            {
              type: "Paragraph",
              props: { align: "center", fontSize: "base" },
              children: ["Intro"],
            },
          ],
        },
      ],
    };

    expect(compileDocument(page)).toEqual({
      blocks: [
        {
          blockName: "core/template-part",
          attrs: { slug: "header", tagName: "header", area: "header" },
          innerBlocks: [],
          innerHTML: "",
        },
        {
          blockName: "core/group",
          attrs: { tagName: "main", anchor: "content", layout: { type: "default" } },
          innerBlocks: [
            {
              blockName: "core/buttons",
              attrs: { className: "wolf-actions", layout: { type: "flex", justifyContent: "center" } },
              innerBlocks: [
                {
                  blockName: "core/button",
                  attrs: {},
                  innerBlocks: [],
                  innerHTML:
                    '<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/store">Browse</a></div>',
                },
              ],
              innerHTML: "",
            },
            {
              blockName: "core/heading",
              attrs: { level: 1, textAlign: "center", fontSize: "hero" },
              innerBlocks: [],
              innerHTML: "Title",
            },
            {
              blockName: "core/paragraph",
              attrs: { align: "center", fontSize: "base" },
              innerBlocks: [],
              innerHTML: "Intro",
            },
          ],
          innerHTML: "",
        },
      ],
    } satisfies BlockDocument);
  });

  it("serializes cover, image, spacer, list, and details blocks", () => {
    const document: BlockDocument = {
      blocks: [
        {
          blockName: "core/cover",
          attrs: {
            url: "/hero.jpg",
            dimRatio: 40,
            minHeight: 72,
            minHeightUnit: "vh",
            align: "full",
            className: "hero",
          },
          innerBlocks: [
            {
              blockName: "core/heading",
              attrs: { textAlign: "center", level: 1, fontSize: "hero" },
              innerBlocks: [],
              innerHTML: "Hello",
            },
          ],
          innerHTML: "",
        },
        {
          blockName: "core/image",
          attrs: {
            width: "120px",
            height: "120px",
            scale: "cover",
            sizeSlug: "thumbnail",
            linkDestination: "none",
            align: "center",
            style: { border: { radius: "999px" } },
          },
          innerBlocks: [],
          innerHTML: "",
        },
        { blockName: "core/spacer", attrs: { height: "var:preset|spacing|5" }, innerBlocks: [], innerHTML: "" },
        {
          blockName: "core/list",
          attrs: { className: "features" },
          innerBlocks: [
            { blockName: "core/list-item", attrs: {}, innerBlocks: [], innerHTML: "Fast" },
            { blockName: "core/list-item", attrs: {}, innerBlocks: [], innerHTML: "Flexible" },
          ],
          innerHTML: "",
        },
        {
          blockName: "core/details",
          attrs: {},
          innerBlocks: [{ blockName: "core/paragraph", attrs: {}, innerBlocks: [], innerHTML: "Answer" }],
          innerHTML: "Question?",
        },
      ],
    };

    const markup = normalizeMarkup(serializeDocument(document));
    expect(markup).toContain(
      '<!-- wp:cover {"url":"/hero.jpg","dimRatio":40,"minHeight":72,"minHeightUnit":"vh","align":"full","className":"hero"} -->',
    );
    expect(markup).toContain(
      '<div class="wp-block-cover alignfull hero" style="min-height:72vh"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-40 has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="/hero.jpg" data-object-fit="cover"/><div class="wp-block-cover__inner-container">',
    );
    expect(markup).toContain('<h1 class="wp-block-heading has-text-align-center has-hero-font-size">Hello</h1>');
    expect(markup).toContain(
      '<figure class="wp-block-image aligncenter size-thumbnail has-custom-border is-resized"><img alt="" style="border-radius:999px;object-fit:cover;width:120px;height:120px"/></figure>',
    );
    expect(markup).toContain(
      '<div style="height:var(--wp--preset--spacing--5)" aria-hidden="true" class="wp-block-spacer"></div>',
    );
    expect(markup).toContain('<ul class="features"><!-- wp:list-item --><li>Fast</li>');
    expect(markup).toContain('<details class="wp-block-details"><summary>Question?</summary>');
  });

  it("compiles query template blocks used by archive templates", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Query",
          props: {
            queryId: 0,
            query: { perPage: 10, postType: "post", inherit: true },
            layout: { type: "constrained" },
          },
          children: [
            {
              type: "PostTemplate",
              props: { style: { spacing: { blockGap: "var:preset|spacing|7" } } },
              children: [
                { type: "PostDate", props: { fontSize: "xs" }, children: [] },
                { type: "PostTitle", props: { isLink: true, fontSize: "2-xl" }, children: [] },
                { type: "PostExcerpt", props: { moreText: "Read more", excerptLength: 28 }, children: [] },
              ],
            },
            {
              type: "QueryPagination",
              props: { layout: { type: "flex", justifyContent: "space-between" } },
              children: [
                { type: "QueryPaginationPrevious", props: {}, children: [] },
                { type: "QueryPaginationNext", props: {}, children: [] },
              ],
            },
          ],
        },
      ],
    };

    expect(compileDocument(page).blocks[0]).toEqual({
      blockName: "core/query",
      attrs: {
        queryId: 0,
        query: { perPage: 10, postType: "post", inherit: true },
        layout: { type: "constrained" },
      },
      innerBlocks: [
        {
          blockName: "core/post-template",
          attrs: { style: { spacing: { blockGap: "var:preset|spacing|7" } } },
          innerBlocks: [
            { blockName: "core/post-date", attrs: { fontSize: "xs" }, innerBlocks: [], innerHTML: "" },
            { blockName: "core/post-title", attrs: { isLink: true, fontSize: "2-xl" }, innerBlocks: [], innerHTML: "" },
            {
              blockName: "core/post-excerpt",
              attrs: { moreText: "Read more", excerptLength: 28 },
              innerBlocks: [],
              innerHTML: "",
            },
          ],
          innerHTML: "",
        },
        {
          blockName: "core/query-pagination",
          attrs: { layout: { type: "flex", justifyContent: "space-between" } },
          innerBlocks: [
            { blockName: "core/query-pagination-previous", attrs: {}, innerBlocks: [], innerHTML: "" },
            { blockName: "core/query-pagination-next", attrs: {}, innerBlocks: [], innerHTML: "" },
          ],
          innerHTML: "",
        },
      ],
      innerHTML: "",
    } satisfies BlockDocument["blocks"][number]);
  });

  it("evaluates the reference coverage source and preserves attrs plus saved markup", async () => {
    const filePath = path.resolve("examples", "templates", "reference-coverage.guty.tsx");
    const page = await evaluateTemplate(filePath);
    const markup = normalizeMarkup(serializeDocument(compileDocument(page)));

    expect(markup).toContain(
      '<!-- wp:template-part {"slug":"header","tagName":"header","area":"header"} /-->',
    );
    expect(markup).toContain('"anchor":"reference-grid"');
    expect(markup).toContain('"metadata":{"name":"Reference Grid"}');
    expect(markup).toContain('<!-- wp:cover');
    expect(markup).toContain('"dimRatio":40');
    expect(markup).toContain('"minHeight":72');
    expect(markup).toContain('"padding":{"top":"var:preset|spacing|10","bottom":"var:preset|spacing|9"}');
    expect(markup).toContain(
      '<figure class="wp-block-image aligncenter size-thumbnail is-resized has-custom-border"><img src="<?php echo esc_url( get_theme_file_uri() . \'/assets/images/me.jpg\' ); ?>" alt="Reference portrait" width="180" height="180" style="border-radius:999px;object-fit:cover;width:120px;height:120px"/></figure>',
    );
    expect(markup).toContain("<!-- wp:shortcode -->");
    expect(markup).toContain('[contact-form-7 id="CONTACT_FORM_ID"]');
    expect(markup).toContain("<!-- /wp:shortcode -->");
    expect(markup).toContain('<!-- wp:query {"queryId":0');
    expect(markup).toContain('<!-- wp:post-title {"isLink":true,"fontSize":"2-xl"} /-->');
    expect(markup).toContain(
      '<!-- wp:demo-store/example-index {"perPage":12,"theme_cat":"featured","pagination":"none","orderby":"featured","order":"DESC","cardHeading":"h3","sidebar":true} /-->',
    );
    expect(markup).toContain('<!-- wp:demo-blocks/marquee');
    expect(markup).toContain('"animationDuration":30');
    expect(markup).toContain('"margin":{"top":"var:preset|spacing|0"}');
    expect(markup).toContain(
      '<div class="wp-block-demo-blocks-marquee"><div class="demo-blocks-marquee__track"><span>Example Studio</span></div></div>',
    );
    expect(markup).toContain('<!-- wp:demo-blocks/brevo-form {"listId":12345} -->');
    expect(markup).toContain('<div class="wp-block-demo-blocks-brevo-form" data-list-id="12345"></div>');
    expect(markup).toContain('<!-- wp:demo-blocks/stats-counter {"title":"Items Sold","endNumber":35,"suffix":"k"} -->');
    expect(markup).toContain(
      '<div class="wp-block-demo-blocks-stats-counter"><strong>2.4k</strong><span>Items Sold</span></div>',
    );
    expect(markup).toContain(
      '<!-- wp:template-part {"slug":"footer","tagName":"footer","area":"footer"} /-->',
    );
  });
});

describe("Header / Navigation / Button", () => {
  it("compiles Footer as a void core/template-part block", () => {
    const page: ElementNode = {
      type: "Page",
      props: {},
      children: [
        {
          type: "Footer",
          props: { slug: "footer" },
          children: [],
        },
      ],
    };

    expect(compileDocument(page)).toEqual({
      blocks: [
        {
          blockName: "core/template-part",
          attrs: { slug: "footer", tagName: "footer", area: "footer" },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    } satisfies BlockDocument);
  });

  it("compiles a header part into a Gutenberg block tree", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
    const filePath = path.join(root, "header.guty.tsx");

    await writeFile(
      filePath,
      [
        "<Page>",
        '  <Header slug="header" />',
        '  <Section className="wolf-header" align="full" layoutType="constrained">',
        '    <Container className="wolf-header__inner" align="wide" layout={{ type: "flex", justifyContent: "space-between", flexWrap: "nowrap" }}>',
        '      <Navigation overlayMenu="mobile" className="wolf-nav" layout={{ type: "flex" }}>',
        '        <NavigationLink label="Home" url="/" />',
        '        <Button className="wolf-header__cta--drawer" url="/store">Browse</Button>',
        "      </Navigation>",
        "    </Container>",
        "  </Section>",
        "</Page>",
      ].join("\n"),
      "utf8",
    );

    try {
      const page = await evaluateTemplate(filePath);
      const markup = normalizeMarkup(serializeDocument(compileDocument(page)));

      expect(markup).toContain('<!-- wp:template-part {"slug":"header","tagName":"header","area":"header"} /-->');
      expect(markup).toContain(
        '<!-- wp:group {"tagName":"section","className":"wolf-header","align":"full","layout":{"type":"constrained"}} -->',
      );
      expect(markup).toContain('<section class="wp-block-group alignfull wolf-header">');
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
      expect(html).toContain('data-duration="30"');
      expect(html).toContain('data-direction="left"');
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
            backgroundColor: "contrast",
            textColor: "base",
            anchor: "about-section",
            className: "wolf-about wolf-section-pad--big is-dark has-texture",
            align: "full",
            layout: { type: "constrained", contentSize: "var(--wp--style--global--wide-size)" },
          },
          innerBlocks: [],
          innerHTML: "",
        },
      ],
    };

    expect(normalizeMarkup(serializeDocument(document))).toBe(
      '<!-- wp:group {"tagName":"section","backgroundColor":"contrast","textColor":"base","anchor":"about-section","className":"wolf-about wolf-section-pad\\u002d\\u002dbig is-dark has-texture","align":"full","layout":{"type":"constrained","contentSize":"var(\\u002d\\u002dwp\\u002d\\u002dstyle\\u002d\\u002dglobal\\u002d\\u002dwide-size)"}} --><section id="about-section" class="wp-block-group alignfull has-contrast-background-color has-background has-base-color has-text-color wolf-about wolf-section-pad--big is-dark has-texture"></section><!-- /wp:group -->',
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

  it("serializes columns, column widths, and text block classes", () => {
    const document: BlockDocument = {
      blocks: [
        {
          blockName: "core/columns",
          attrs: { verticalAlignment: "center" },
          innerBlocks: [
            {
              blockName: "core/column",
              attrs: { className: "wolf-about__main", width: "60%" },
              innerBlocks: [
                {
                  blockName: "core/paragraph",
                  attrs: { className: "wolf-about__text" },
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
      '<!-- wp:columns {"verticalAlignment":"center"} --><div class="wp-block-columns are-vertically-aligned-center"><!-- wp:column {"className":"wolf-about__main","width":"60%"} --><div class="wp-block-column wolf-about__main" style="flex-basis:60%"><!-- wp:paragraph {"className":"wolf-about__text"} --><p class="wolf-about__text">World</p><!-- /wp:paragraph --></div><!-- /wp:column --></div><!-- /wp:columns -->',
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

	it("watches templates and rebuilds changed output", async () => {
		const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
		const inputDir = path.join(root, "examples");
		const outputDir = path.join(root, "dist");
		const templatePath = path.join(inputDir, "templates", "page.guty.tsx");
		const outputPath = path.join(outputDir, "templates", "page.html");
		const templateSource = (heading: string) =>
			[
				"export default (",
				"  <Page>",
				"    <Section>",
				"      <Heading level={1}>",
				`        ${heading}`,
				"      </Heading>",
				"    </Section>",
				"  </Page>",
				");",
			].join("\n");

		await mkdir(path.dirname(templatePath), { recursive: true });
		await writeFile(templatePath, templateSource("Before"), "utf8");

		const watcher = await watchDirectory(inputDir, outputDir, { debounceMs: 10 });

		try {
			await waitFor(async () => {
				await expect(readFile(outputPath, "utf8")).resolves.toContain("Before");
			});

			await writeFile(templatePath, templateSource("After"), "utf8");

			await waitFor(async () => {
				await expect(readFile(outputPath, "utf8")).resolves.toContain("After");
			});
		} finally {
			watcher.close();
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
				'<div class="wp-block-test-suite-marquee fixture-marquee my-class" style="--fixture-duration:30s;margin-top:var(--wp--preset--spacing--40)" data-duration="30" data-direction="left">',
			);
			expect(php).toContain('<span class="fixture-item">Wolf<span>Theme</span></span>');
			expect(php).toContain('<!-- wp:test-suite/unregistered {"foo":"bar"} /-->');
		} finally {
			await rm(root, { recursive: true, force: true });
		}
	});

	it("builds an about pattern using native columns and text classes", async () => {
		const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
		const inputDir = path.join(root, "examples");
		const outputDir = path.join(root, "dist");

		await mkdir(path.join(inputDir, "patterns"), { recursive: true });
		await writeFile(
			path.join(inputDir, "patterns", "about.guty.tsx"),
			[
				"// @guty pattern",
				"// title: About",
				"// slug: seijaku-fse/home-about",
				"// categories: about",
				"// package: SeijakuFSE",
				"",
				"<Page>",
				'  <Section tagName="section" backgroundColor="base-2" className="wolf-about wolf-section-pad--big " align="full" layoutType="constrained" layoutContentSize="var(--wp--style--global--wide-size)">',
				'    <Columns verticalAlignment="center">',
				'      <Column width="60%" className="wolf-about__main">',
				'        <Paragraph className="wolf-about__eyebrow wolf-eyebrow">The person behind the code</Paragraph>',
				'        <Heading level={2} className="wolf-about__title">I\'m Constantin. For 14 years, I\'ve been the only person writing every line of WolfThemes.</Heading>',
				'        <Paragraph className="wolf-about__text">No agency, no rotating dev team, no outsourced support tickets. Every theme here started as a real problem someone brought to me: a band needing a tour page, a label needing a catalogue that didn\'t feel like a spreadsheet.</Paragraph>',
				'        <Paragraph className="wolf-about__text">When you reach out, you\'re talking to the person who built the theme, not a queue. That\'s the whole reason I started selling direct.</Paragraph>',
				"      </Column>",
				'      <Column width="40%" className="wolf-about__pullquote">',
				'        <Block name="core/paragraph">{`14 years.<br>36,000 customers.<br>4.5/5 out of 1600+ ratings.<br>One person who still answers the emails.`}</Block>',
				"      </Column>",
				"    </Columns>",
				"  </Section>",
				"</Page>",
			].join("\n"),
			"utf8",
		);

		try {
			await buildDirectory(inputDir, outputDir);
			const php = await readFile(path.join(outputDir, "patterns", "about.php"), "utf8");

			expect(php).toContain(" * Title: About");
			expect(php).toContain('<!-- wp:group {"tagName":"section"');
			expect(php).toContain('"backgroundColor":"base-2"');
			expect(php).toContain('"className":"wolf-about wolf-section-pad\\u002d\\u002dbig "');
			expect(php).toContain('<section class="wp-block-group alignfull has-base-2-background-color has-background wolf-about wolf-section-pad--big ">');
			expect(php).toContain('<!-- wp:columns {"verticalAlignment":"center"} -->');
			expect(php).toContain('<div class="wp-block-columns are-vertically-aligned-center">');
			expect(php).toContain('<!-- wp:column {"className":"wolf-about__main","width":"60%"} -->');
			expect(php).toContain('<h2 class="wp-block-heading wolf-about__title">I\'m Constantin.');
			expect(php).toContain('<p>14 years.<br>36,000 customers.<br>4.5/5 out of 1600+ ratings.<br>One person who still answers the emails.</p>');
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
