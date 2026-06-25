import type { BlockDocument, BlockNode } from "../types.js";

function serializeAttrs(attrs: Record<string, unknown>): string {
  const keys = Object.keys(attrs);
  return keys.length === 0 ? "" : ` ${JSON.stringify(attrs)}`;
}

function renderTagName(node: BlockNode): string {
  if (node.blockName === "core/group") {
    return node.attrs.tagName === "section" ? "section" : "div";
  }

  if (node.blockName === "core/heading") {
    const level = typeof node.attrs.level === "number" ? node.attrs.level : 2;
    return `h${level}`;
  }

  return "p";
}

function renderClassName(node: BlockNode): string {
  switch (node.blockName) {
    case "core/group":
      return "wp-block-group";
    case "core/heading":
      return "wp-block-heading";
    case "core/paragraph":
      return "";
  }
}

function renderOpenTag(node: BlockNode): string {
  const tag = renderTagName(node);
  const className = renderClassName(node);

  if (className === "") {
    return `<${tag}>`;
  }

  return `<${tag} class="${className}">`;
}

function renderInnerHtml(node: BlockNode): string {
  if (node.innerBlocks.length > 0) {
    return node.innerBlocks.map(serializeBlock).join("");
  }

  return node.innerHTML;
}

function serializeBlock(node: BlockNode): string {
  const name = node.blockName.replace("core/", "");
  const tag = renderTagName(node);

  return [
    `<!-- wp:${name}${serializeAttrs(node.attrs)} -->`,
    renderOpenTag(node),
    renderInnerHtml(node),
    `</${tag}>`,
    `<!-- /wp:${name} -->`,
  ].join("");
}

export function serializeDocument(document: BlockDocument): string {
  return document.blocks.map(serializeBlock).join("");
}
