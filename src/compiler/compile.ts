import type { BlockDocument, BlockNode, Child, ElementNode } from "../types.js";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function expectTextChildren(node: ElementNode): string {
  return node.children
    .map((child) => {
      if (typeof child !== "string") {
        throw new Error(`${node.type} only supports text children in the MVP.`);
      }

      return escapeHtml(child);
    })
    .join("");
}

function compileChildren(children: Child[]): BlockNode[] {
  return children.map((child) => {
    if (typeof child === "string") {
      throw new Error("Text nodes are only allowed inside Heading and Paragraph in the MVP.");
    }

    return compileNode(child);
  });
}

function compileNode(node: ElementNode): BlockNode {
  switch (node.type) {
    case "Page":
      throw new Error("Page nodes must be compiled through compileDocument.");
    case "Section":
      return {
        blockName: "core/group",
        attrs: {
          tagName: "section",
          layout: { type: "constrained" },
        },
        innerBlocks: compileChildren(node.children),
        innerHTML: "",
      };
    case "Container":
      return {
        blockName: "core/group",
        attrs: {
          layout: { type: "constrained" },
        },
        innerBlocks: compileChildren(node.children),
        innerHTML: "",
      };
    case "Heading": {
      const level = Number(node.props.level ?? 2);

      if (!Number.isInteger(level) || level < 1 || level > 6) {
        throw new Error(`Heading level must be an integer from 1 to 6. Received: ${String(node.props.level)}`);
      }

      return {
        blockName: "core/heading",
        attrs: level === 2 ? {} : { level },
        innerBlocks: [],
        innerHTML: expectTextChildren(node),
      };
    }
    case "Paragraph":
      return {
        blockName: "core/paragraph",
        attrs: {},
        innerBlocks: [],
        innerHTML: expectTextChildren(node),
      };
  }
}

export function compileDocument(node: ElementNode): BlockDocument {
  if (node.type !== "Page") {
    throw new Error("The root element must be <Page>.");
  }

  return {
    blocks: compileChildren(node.children),
  };
}
