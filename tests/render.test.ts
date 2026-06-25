import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildDirectory } from "../src/compiler/build.js";
import { compileDocument } from "../src/compiler/compile.js";
import { serializeDocument } from "../src/compiler/serialize.js";
import type { BlockDocument, ElementNode } from "../src/types.js";

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

    expect(serializeDocument(document)).toBe(
      '<!-- wp:group {"tagName":"section","layout":{"type":"constrained"}} --><section class="wp-block-group"><!-- wp:group {"layout":{"type":"constrained"}} --><div class="wp-block-group"><!-- wp:heading {"level":1} --><h1 class="wp-block-heading">Hello</h1><!-- /wp:heading --><!-- wp:paragraph --><p>World</p><!-- /wp:paragraph --></div><!-- /wp:group --></section><!-- /wp:group -->',
    );
  });
});

describe("buildDirectory", () => {
  it("compiles .guty.tsx files into html output", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "guty-test-"));
    const inputDir = path.join(root, "examples");
    const outputDir = path.join(root, "dist");

    await mkdir(inputDir, { recursive: true });

    await writeFile(
      path.join(inputDir, "front-page.guty.tsx"),
      [
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
      ].join("\n"),
      "utf8",
    );

    try {
      const results = await buildDirectory(inputDir, outputDir);
      const html = await readFile(path.join(outputDir, "front-page.html"), "utf8");

      expect(results).toHaveLength(1);
      expect(html).toContain("<!-- wp:heading {\"level\":1} -->");
      expect(html).toContain("<p>Compiled from TSX</p>");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
