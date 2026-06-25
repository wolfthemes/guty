import { createRequire } from "node:module";
import path from "node:path";

import type { BlockDocument, BlockNode } from "../types.js";

interface RawBlockLike {
  blockName?: string | null;
  attrs?: Record<string, unknown>;
  innerHTML: string;
  innerContent: Array<string | null>;
  innerBlocks: RawBlockLike[];
}

const require = createRequire(import.meta.url);
const blocksPackagePath = require.resolve("@wordpress/blocks/package.json");
const serializeRawBlockPath = path.join(
  path.dirname(blocksPackagePath),
  "build",
  "api",
  "parser",
  "serialize-raw-block.cjs",
);
const { serializeRawBlock } = require(serializeRawBlockPath) as {
  serializeRawBlock: (block: RawBlockLike) => string;
};

function formatMarkup(value: string): string {
  return value
    .replace(/-->\s*</g, "-->\n<")
    .replace(/>\s*<!--/g, ">\n<!--")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getGroupTagName(node: BlockNode): "section" | "div" {
  return node.attrs.tagName === "section" ? "section" : "div";
}

function renderLeafMarkup(node: BlockNode): string {
  switch (node.blockName) {
    case "core/group":
      return "";
    case "core/heading": {
      const level = typeof node.attrs.level === "number" ? node.attrs.level : 2;
      return `<h${level} class="wp-block-heading">${node.innerHTML}</h${level}>`;
    }
    case "core/paragraph":
      return `<p>${node.innerHTML}</p>`;
  }
}

function toRawBlock(node: BlockNode): RawBlockLike {
  if (node.blockName === "core/group") {
    const tagName = getGroupTagName(node);
    const openTag = `<${tagName} class="wp-block-group">`;
    const closeTag = `</${tagName}>`;

    return {
      blockName: node.blockName,
      attrs: node.attrs,
      innerHTML: `${openTag}${closeTag}`,
      innerContent: [
        openTag,
        ...node.innerBlocks.flatMap((innerBlock, index) => (index === 0 ? [null] : ["", null])),
        closeTag,
      ],
      innerBlocks: node.innerBlocks.map(toRawBlock),
    };
  }

  const markup = renderLeafMarkup(node);

  return {
    blockName: node.blockName,
    attrs: node.attrs,
    innerHTML: markup,
    innerContent: [markup],
    innerBlocks: [],
  };
}

export function serializeDocument(document: BlockDocument): string {
  const markup = document.blocks
    .map((block) => formatMarkup(serializeRawBlock(toRawBlock(block))))
    .join("\n\n");

  return `${markup}\n`;
}
