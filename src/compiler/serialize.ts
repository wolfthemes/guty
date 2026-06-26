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
  const lines = value
    .replace(/-->\s*</g, "-->\n<")
    .replace(/>\s*<!--/g, ">\n<!--")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const formatted: string[] = [];
  let indentLevel = 0;

  for (const line of lines) {
    if (line.startsWith("</")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    formatted.push(`${"  ".repeat(indentLevel)}${line}`);

    if (/^<[^!/][^>]*>$/.test(line) && !line.startsWith("</") && !line.includes("</")) {
      indentLevel += 1;
    }
  }

  return formatted.join("\n");
}

function getGroupTagName(node: BlockNode): string {
  const tagName = node.attrs.tagName;
  return typeof tagName === "string" && tagName.length > 0 ? (tagName as "section" | "header" | "div") : "div";
}

function cssValue(value: unknown): string {
  if (typeof value === "string" && value.startsWith("var:")) {
    return `var(--wp--${value.slice(4).split("|").join("--")})`;
  }

  return String(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

function camelToKebab(value: string): string {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function getGroupClassName(node: BlockNode): string {
  const classes = ["wp-block-group"];

  if (node.attrs.align === "wide") {
    classes.push("alignwide");
  } else if (node.attrs.align === "full") {
    classes.push("alignfull");
  }

  if (typeof node.attrs.backgroundColor === "string" && node.attrs.backgroundColor.length > 0) {
    classes.push(`has-${node.attrs.backgroundColor}-background-color`, "has-background");
  }

  if (typeof node.attrs.textColor === "string" && node.attrs.textColor.length > 0) {
    classes.push(`has-${node.attrs.textColor}-color`, "has-text-color");
  }

  if (typeof node.attrs.fontSize === "string" && node.attrs.fontSize.length > 0) {
    classes.push(`has-${node.attrs.fontSize}-font-size`, "has-font-size");
  }

  if (typeof node.attrs.fontFamily === "string" && node.attrs.fontFamily.length > 0) {
    classes.push(`has-${node.attrs.fontFamily}-font-family`);
  }

  if (typeof node.attrs.className === "string" && node.attrs.className.length > 0) {
    classes.push(node.attrs.className);
  }

  return classes.join(" ");
}

function getGroupStyle(node: BlockNode): string | undefined {
  const style = asRecord(node.attrs.style);
  if (!style) {
    return undefined;
  }

  const declarations: string[] = [];
  const spacing = asRecord(style.spacing);

  for (const axis of ["margin", "padding"] as const) {
    const sides = asRecord(spacing?.[axis]);
    if (!sides) {
      continue;
    }

    for (const side of ["top", "right", "bottom", "left"] as const) {
      const value = sides[side];
      if (value !== undefined) {
        declarations.push(`${axis}-${side}:${cssValue(value)}`);
      }
    }
  }

  const typography = asRecord(style.typography);
  if (typography) {
    for (const [key, value] of Object.entries(typography)) {
      if (value !== undefined) {
        declarations.push(`${camelToKebab(key)}:${cssValue(value)}`);
      }
    }
  }

  return declarations.length > 0 ? declarations.join(";") : undefined;
}

// Blocks whose saved markup is HTML emitted by the block itself.
const HTML_LEAF_BLOCKS = new Set(["core/heading", "core/paragraph", "core/button"]);

function renderLeafMarkup(node: BlockNode): string {
  switch (node.blockName) {
    case "core/heading": {
      const level = typeof node.attrs.level === "number" ? node.attrs.level : 2;
      const classes = ["wp-block-heading"];
      if (typeof node.attrs.className === "string" && node.attrs.className.length > 0) {
        classes.push(node.attrs.className);
      }
      return `<h${level} class="${classes.join(" ")}">${node.innerHTML}</h${level}>`;
    }
    case "core/paragraph": {
      const classAttr =
        typeof node.attrs.className === "string" && node.attrs.className.length > 0
          ? ` class="${node.attrs.className}"`
          : "";
      return `<p${classAttr}>${node.innerHTML}</p>`;
    }
    case "core/button":
      return node.innerHTML;
    default:
      return "";
  }
}

function getColumnsClassName(node: BlockNode): string {
  const classes = ["wp-block-columns"];

  if (node.attrs.verticalAlignment === "top") {
    classes.push("are-vertically-aligned-top");
  } else if (node.attrs.verticalAlignment === "center") {
    classes.push("are-vertically-aligned-center");
  } else if (node.attrs.verticalAlignment === "bottom") {
    classes.push("are-vertically-aligned-bottom");
  }

  if (typeof node.attrs.className === "string" && node.attrs.className.length > 0) {
    classes.push(node.attrs.className);
  }

  return classes.join(" ");
}

function getColumnClassName(node: BlockNode): string {
  const classes = ["wp-block-column"];

  if (node.attrs.verticalAlignment === "top") {
    classes.push("is-vertically-aligned-top");
  } else if (node.attrs.verticalAlignment === "center") {
    classes.push("is-vertically-aligned-center");
  } else if (node.attrs.verticalAlignment === "bottom") {
    classes.push("is-vertically-aligned-bottom");
  }

  if (typeof node.attrs.className === "string" && node.attrs.className.length > 0) {
    classes.push(node.attrs.className);
  }

  return classes.join(" ");
}

function toRawBlock(node: BlockNode): RawBlockLike {
  if (node.blockName === "core/group") {
    const tagName = getGroupTagName(node);
    const className = getGroupClassName(node);
    const style = getGroupStyle(node);
    const styleAttr = style ? ` style="${style}"` : "";
    const openTag = `<${tagName} class="${className}"${styleAttr}>`;
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

  if (node.blockName === "core/columns") {
    const className = getColumnsClassName(node);
    const openTag = `<div class="${className}">`;
    const closeTag = `</div>`;

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

  if (node.blockName === "core/column") {
    const className = getColumnClassName(node);
    const styleAttr =
      typeof node.attrs.width === "string" && node.attrs.width.length > 0
        ? ` style="flex-basis:${node.attrs.width}"`
        : "";
    const openTag = `<div class="${className}"${styleAttr}>`;
    const closeTag = `</div>`;

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

  if (HTML_LEAF_BLOCKS.has(node.blockName)) {
    const markup = renderLeafMarkup(node);

    return {
      blockName: node.blockName,
      attrs: node.attrs,
      innerHTML: markup,
      innerContent: [markup],
      innerBlocks: [],
    };
  }

  // A custom block carrying its own static save markup (raw HTML body from a
  // <Block> string child): emit the markup verbatim between the comments.
  if (node.innerHTML !== "") {
    return {
      blockName: node.blockName,
      attrs: node.attrs,
      innerHTML: node.innerHTML,
      innerContent: [node.innerHTML],
      innerBlocks: [],
    };
  }

  // Comment-only blocks (core/pattern, core/navigation, core/navigation-link,
  // and any custom block from <Block />): no HTML wrapper. Void when there are
  // no inner blocks, otherwise a container holding its inner blocks.
  if (node.innerBlocks.length === 0) {
    return {
      blockName: node.blockName,
      attrs: node.attrs,
      innerHTML: "",
      innerContent: [],
      innerBlocks: [],
    };
  }

  return {
    blockName: node.blockName,
    attrs: node.attrs,
    innerHTML: "",
    innerContent: node.innerBlocks.flatMap((innerBlock, index) =>
      index === 0 ? [null] : ["", null],
    ),
    innerBlocks: node.innerBlocks.map(toRawBlock),
  };
}

export function serializeDocument(document: BlockDocument): string {
  const markup = document.blocks
    .map((block) => formatMarkup(serializeRawBlock(toRawBlock(block))))
    .join("\n\n");

  return `${markup}\n`;
}
