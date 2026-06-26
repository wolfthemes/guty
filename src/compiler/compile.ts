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

interface CommonAttrs {
  className?: string;
  align?: "wide" | "full";
  layout?: Record<string, unknown>;
}

function readCommonAttrs(node: ElementNode): CommonAttrs {
  const attrs: CommonAttrs = {};
  const { className, align, layout } = node.props;

  if (className !== undefined) {
    if (typeof className !== "string" || className.length === 0) {
      throw new Error(`${node.type} className must be a non-empty string.`);
    }

    attrs.className = className;
  }

  if (align !== undefined) {
    if (align !== "wide" && align !== "full") {
      throw new Error(`${node.type} align must be "wide" or "full". Received: ${String(align)}`);
    }

    attrs.align = align;
  }

  if (layout !== undefined) {
    if (typeof layout !== "object" || layout === null) {
      throw new Error(`${node.type} layout must be an object.`);
    }

    attrs.layout = layout as Record<string, unknown>;
  }

  return attrs;
}

// Build group attrs in the fixed order tagName, className, align, layout so the
// serialized JSON is deterministic.
function groupBlock(node: ElementNode, tagName?: "section" | "header"): BlockNode {
  const common = readCommonAttrs(node);
  const attrs: Record<string, unknown> = {};

  if (tagName) {
    attrs.tagName = tagName;
  }

  if (common.className) {
    attrs.className = common.className;
  }

  if (common.align) {
    attrs.align = common.align;
  }

  attrs.layout = common.layout ?? { type: "constrained" };

  return {
    blockName: "core/group",
    attrs,
    innerBlocks: compileChildren(node.children),
    innerHTML: "",
  };
}

function compileNode(node: ElementNode): BlockNode {
  switch (node.type) {
    case "Page":
      throw new Error("Page nodes must be compiled through compileDocument.");
    case "Section":
      return groupBlock(node, "section");
    case "Container":
      return groupBlock(node);
    case "Header":
      return groupBlock(node, "header");
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
    case "Pattern": {
      const slug = node.props.slug;

      if (typeof slug !== "string" || slug.length === 0) {
        throw new Error("Pattern requires a non-empty slug prop.");
      }

      if (node.children.length > 0) {
        throw new Error("Pattern is a void block and cannot have children.");
      }

      return {
        blockName: "core/pattern",
        attrs: { slug },
        innerBlocks: [],
        innerHTML: "",
      };
    }
    case "Navigation": {
      const common = readCommonAttrs(node);
      const attrs: Record<string, unknown> = {};
      const overlayMenu = node.props.overlayMenu;

      if (overlayMenu !== undefined) {
        if (overlayMenu !== "mobile" && overlayMenu !== "always" && overlayMenu !== "never") {
          throw new Error(
            `Navigation overlayMenu must be "mobile", "always", or "never". Received: ${String(overlayMenu)}`,
          );
        }

        attrs.overlayMenu = overlayMenu;
      }

      if (common.className) {
        attrs.className = common.className;
      }

      if (common.align) {
        attrs.align = common.align;
      }

      if (common.layout) {
        attrs.layout = common.layout;
      }

      return {
        blockName: "core/navigation",
        attrs,
        innerBlocks: compileChildren(node.children),
        innerHTML: "",
      };
    }
    case "NavigationLink": {
      const label = node.props.label;

      if (typeof label !== "string" || label.length === 0) {
        throw new Error("NavigationLink requires a non-empty label prop.");
      }

      if (node.children.length > 0) {
        throw new Error("NavigationLink is a void block and cannot have children.");
      }

      const attrs: Record<string, unknown> = { label };
      const url = node.props.url;

      if (url !== undefined) {
        if (typeof url !== "string" || url.length === 0) {
          throw new Error("NavigationLink url must be a non-empty string.");
        }

        attrs.url = url;
      }

      const opensInNewTab = node.props.opensInNewTab;

      if (opensInNewTab === true) {
        attrs.opensInNewTab = true;
      }

      return {
        blockName: "core/navigation-link",
        attrs,
        innerBlocks: [],
        innerHTML: "",
      };
    }
    case "Button": {
      const text = expectTextChildren(node);
      const attrs: Record<string, unknown> = {};
      const className = node.props.className;

      if (className !== undefined) {
        if (typeof className !== "string" || className.length === 0) {
          throw new Error("Button className must be a non-empty string.");
        }

        attrs.className = className;
      }

      const url = node.props.url;

      if (url !== undefined && (typeof url !== "string" || url.length === 0)) {
        throw new Error("Button url must be a non-empty string.");
      }

      const wrapperClass = ["wp-block-button", typeof className === "string" ? className : ""]
        .filter((value) => value.length > 0)
        .join(" ");
      const href = typeof url === "string" ? ` href="${escapeHtml(url)}"` : "";
      const innerHTML = `<div class="${wrapperClass}"><a class="wp-block-button__link wp-element-button"${href}>${text}</a></div>`;

      return {
        blockName: "core/button",
        attrs,
        innerBlocks: [],
        innerHTML,
      };
    }
    case "Block": {
      const name = node.props.name;

      if (typeof name !== "string" || !name.includes("/")) {
        throw new Error(
          `Block requires a namespaced name prop (e.g. "wolf-store/theme-index"). Received: ${String(name)}`,
        );
      }

      const attrs: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(node.props)) {
        if (key === "name" || value === undefined) {
          continue;
        }

        attrs[key] = value;
      }

      // A string child is the block's raw static save markup, emitted verbatim
      // (not escaped). Element children compile to inner blocks. The two cannot
      // be mixed.
      const hasRawHtml = node.children.some((child) => typeof child === "string");

      if (hasRawHtml) {
        if (!node.children.every((child) => typeof child === "string")) {
          throw new Error(`Block ${name} cannot mix raw HTML with child blocks.`);
        }

        return {
          blockName: name,
          attrs,
          innerBlocks: [],
          innerHTML: node.children.join(""),
        };
      }

      return {
        blockName: name,
        attrs,
        innerBlocks: compileChildren(node.children),
        innerHTML: "",
      };
    }
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
