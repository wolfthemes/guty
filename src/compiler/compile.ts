import type { BlockDocument, BlockNode, Child, ElementNode } from "../types.js";

export interface CompileContext {
  // Renders a registered custom block's real save markup; undefined if unknown.
  renderBlock?: (name: string, attributes: Record<string, unknown>) => string | undefined;
}

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

function compileChildren(children: Child[], ctx: CompileContext): BlockNode[] {
  return children.map((child) => {
    if (typeof child === "string") {
      throw new Error("Text nodes are only allowed inside Heading and Paragraph in the MVP.");
    }

    return compileNode(child, ctx);
  });
}

const SPACING_SUGAR: Record<string, { axis: "padding" | "margin"; sides: readonly string[] }> = {
  p: { axis: "padding", sides: ["top", "right", "bottom", "left"] },
  py: { axis: "padding", sides: ["top", "bottom"] },
  px: { axis: "padding", sides: ["left", "right"] },
  pt: { axis: "padding", sides: ["top"] },
  pb: { axis: "padding", sides: ["bottom"] },
  pl: { axis: "padding", sides: ["left"] },
  pr: { axis: "padding", sides: ["right"] },
  m: { axis: "margin", sides: ["top", "right", "bottom", "left"] },
  my: { axis: "margin", sides: ["top", "bottom"] },
  mx: { axis: "margin", sides: ["left", "right"] },
  mt: { axis: "margin", sides: ["top"] },
  mb: { axis: "margin", sides: ["bottom"] },
  ml: { axis: "margin", sides: ["left"] },
  mr: { axis: "margin", sides: ["right"] },
};

// Bare integers map to the theme spacing preset scale; explicit values pass through.
function spacingValue(value: unknown): string {
  return /^\d+$/.test(String(value)) ? `var:preset|spacing|${value}` : String(value);
}

/**
 * Resolve <Block> convenience props into real block attributes: `class` →
 * `className`, `p*`/`m*` → `style.spacing.{padding|margin}`. Returns the block
 * attribute object (excludes `name` and the sugar keys).
 */
function applyBlockSugar(props: Record<string, unknown>): Record<string, unknown> {
  const attrs: Record<string, unknown> = {};
  const spacing: { padding?: Record<string, string>; margin?: Record<string, string> } = {};
  let className: string | undefined;

  for (const [key, value] of Object.entries(props)) {
    if (key === "name" || value === undefined) {
      continue;
    }

    if (key === "class" || key === "className") {
      className = className ? `${className} ${String(value)}` : String(value);
      continue;
    }

    const sugar = SPACING_SUGAR[key];
    if (sugar) {
      for (const side of sugar.sides) {
        (spacing[sugar.axis] ??= {})[side] = spacingValue(value);
      }
      continue;
    }

    attrs[key] = value;
  }

  if (className !== undefined) {
    attrs.className = className;
  }

  if (spacing.padding || spacing.margin) {
    const baseStyle = attrs.style && typeof attrs.style === "object" ? { ...(attrs.style as object) } : {};
    const baseSpacing =
      "spacing" in baseStyle && typeof (baseStyle as Record<string, unknown>).spacing === "object"
        ? { ...((baseStyle as Record<string, unknown>).spacing as object) }
        : {};
    attrs.style = { ...baseStyle, spacing: { ...baseSpacing, ...spacing } };
  }

  return attrs;
}

interface CommonAttrs {
  className?: string;
  align?: "wide" | "full";
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  style?: Record<string, unknown>;
  layout?: Record<string, unknown>;
  tagName?: string;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

function readCommonAttrs(node: ElementNode, options: { allowTagName?: boolean } = {}): CommonAttrs {
  const attrs: CommonAttrs = {};
  const {
    className,
    align,
    backgroundColor,
    textColor,
    textAlign,
    fontSize,
    fontFamily,
    style,
    layout,
    layoutType,
    layoutContentSize,
    layoutOrientation,
    tagName,
  } = node.props;

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

  if (backgroundColor !== undefined) {
    if (typeof backgroundColor !== "string" || backgroundColor.length === 0) {
      throw new Error(`${node.type} backgroundColor must be a non-empty string.`);
    }

    attrs.backgroundColor = backgroundColor;
  }

  if (textColor !== undefined) {
    if (typeof textColor !== "string" || textColor.length === 0) {
      throw new Error(`${node.type} textColor must be a non-empty string.`);
    }

    attrs.textColor = textColor;
  }

  if (fontSize !== undefined) {
    if (typeof fontSize !== "string" || fontSize.length === 0) {
      throw new Error(`${node.type} fontSize must be a non-empty string.`);
    }

    attrs.fontSize = fontSize;
  }

  if (fontFamily !== undefined) {
    if (typeof fontFamily !== "string" || fontFamily.length === 0) {
      throw new Error(`${node.type} fontFamily must be a non-empty string.`);
    }

    attrs.fontFamily = fontFamily;
  }

  const baseStyle = style === undefined ? {} : asRecord(style);
  if (style !== undefined && !baseStyle) {
    throw new Error(`${node.type} style must be an object.`);
  }

  const mergedStyle: Record<string, unknown> = { ...(baseStyle ?? {}) };
  if (textAlign !== undefined) {
    if (textAlign !== "left" && textAlign !== "center" && textAlign !== "right") {
      throw new Error(`${node.type} textAlign must be "left", "center", or "right". Received: ${String(textAlign)}`);
    }

    const typography = asRecord(mergedStyle.typography) ?? {};
    mergedStyle.typography = { ...typography, textAlign };
  }

  const spacing: { padding?: Record<string, string>; margin?: Record<string, string> } = {};
  for (const [key, value] of Object.entries(node.props)) {
    const sugar = SPACING_SUGAR[key];
    if (!sugar || value === undefined) {
      continue;
    }

    for (const side of sugar.sides) {
      (spacing[sugar.axis] ??= {})[side] = spacingValue(value);
    }
  }

  if (spacing.padding || spacing.margin) {
    const baseSpacing = asRecord(mergedStyle.spacing) ?? {};
    mergedStyle.spacing = { ...baseSpacing, ...spacing };
  }

  if (Object.keys(mergedStyle).length > 0) {
    attrs.style = mergedStyle;
  }

  if (layout !== undefined) {
    if (typeof layout !== "object" || layout === null) {
      throw new Error(`${node.type} layout must be an object.`);
    }
  }

  const mergedLayout = layout && typeof layout === "object" ? { ...(layout as Record<string, unknown>) } : {};

  if (layoutType !== undefined) {
    if (layoutType !== "constrained" && layoutType !== "flex" && layoutType !== "default") {
      throw new Error(
        `${node.type} layoutType must be "constrained", "flex", or "default". Received: ${String(layoutType)}`,
      );
    }

    mergedLayout.type = layoutType;
  }

  if (layoutContentSize !== undefined) {
    if (typeof layoutContentSize !== "string" || layoutContentSize.length === 0) {
      throw new Error(`${node.type} layoutContentSize must be a non-empty string.`);
    }

    mergedLayout.contentSize = layoutContentSize;
  }

  if (layoutOrientation !== undefined) {
    if (layoutOrientation !== "horizontal" && layoutOrientation !== "vertical") {
      throw new Error(
        `${node.type} layoutOrientation must be "horizontal" or "vertical". Received: ${String(layoutOrientation)}`,
      );
    }

    mergedLayout.orientation = layoutOrientation;
  }

  if (Object.keys(mergedLayout).length > 0) {
    attrs.layout = mergedLayout;
  }

  if (options.allowTagName && tagName !== undefined) {
    if (typeof tagName !== "string" || tagName.length === 0) {
      throw new Error(`${node.type} tagName must be a non-empty string.`);
    }

    attrs.tagName = tagName;
  }

  return attrs;
}

// Build group attrs in the fixed order tagName, className, align,
// backgroundColor, textColor, fontSize, fontFamily, style, layout so the
// serialized JSON is deterministic.
function groupBlock(node: ElementNode, ctx: CompileContext, defaultTagName?: string): BlockNode {
  const common = readCommonAttrs(node, { allowTagName: true });
  const attrs: Record<string, unknown> = {};

  const tagName = common.tagName ?? defaultTagName;
  if (tagName) {
    attrs.tagName = tagName;
  }

  if (common.backgroundColor) {
    attrs.backgroundColor = common.backgroundColor;
  }

  if (common.textColor) {
    attrs.textColor = common.textColor;
  }

  if (common.className) {
    attrs.className = common.className;
  }

  if (common.align) {
    attrs.align = common.align;
  }

  if (common.fontSize) {
    attrs.fontSize = common.fontSize;
  }

  if (common.fontFamily) {
    attrs.fontFamily = common.fontFamily;
  }

  if (common.style) {
    attrs.style = common.style;
  }

  attrs.layout = common.layout ?? { type: "constrained" };

  return {
    blockName: "core/group",
    attrs,
    innerBlocks: compileChildren(node.children, ctx),
    innerHTML: "",
  };
}

function readVerticalAlignment(node: ElementNode, prop: unknown): "top" | "center" | "bottom" | undefined {
  if (prop === undefined) {
    return undefined;
  }

  if (prop !== "top" && prop !== "center" && prop !== "bottom") {
    throw new Error(`${node.type} verticalAlignment must be "top", "center", or "bottom". Received: ${String(prop)}`);
  }

  return prop;
}

function compileNode(node: ElementNode, ctx: CompileContext): BlockNode {
  switch (node.type) {
    case "Page":
      throw new Error("Page nodes must be compiled through compileDocument.");
    case "Section":
      return groupBlock(node, ctx, "section");
    case "Container":
      return groupBlock(node, ctx);
    case "Columns": {
      const attrs: Record<string, unknown> = {};
      const className = node.props.className;

      if (className !== undefined) {
        if (typeof className !== "string" || className.length === 0) {
          throw new Error("Columns className must be a non-empty string.");
        }

        attrs.className = className;
      }

      const verticalAlignment = readVerticalAlignment(node, node.props.verticalAlignment);
      if (verticalAlignment) {
        attrs.verticalAlignment = verticalAlignment;
      }

      return {
        blockName: "core/columns",
        attrs,
        innerBlocks: compileChildren(node.children, ctx),
        innerHTML: "",
      };
    }
    case "Column": {
      const attrs: Record<string, unknown> = {};
      const className = node.props.className;

      if (className !== undefined) {
        if (typeof className !== "string" || className.length === 0) {
          throw new Error("Column className must be a non-empty string.");
        }

        attrs.className = className;
      }

      const width = node.props.width;
      if (width !== undefined) {
        if (typeof width !== "string" || width.length === 0) {
          throw new Error("Column width must be a non-empty string.");
        }

        attrs.width = width;
      }

      const verticalAlignment = readVerticalAlignment(node, node.props.verticalAlignment);
      if (verticalAlignment) {
        attrs.verticalAlignment = verticalAlignment;
      }

      return {
        blockName: "core/column",
        attrs,
        innerBlocks: compileChildren(node.children, ctx),
        innerHTML: "",
      };
    }
    case "Header":
      return groupBlock(node, ctx, "header");
    case "SiteLogo": {
      if (node.children.length > 0) {
        throw new Error("SiteLogo is a void block and cannot have children.");
      }

      const attrs: Record<string, unknown> = {};

      const className = node.props.className;
      if (className !== undefined) {
        if (typeof className !== "string" || className.length === 0) {
          throw new Error("SiteLogo className must be a non-empty string.");
        }

        attrs.className = className;
      }

      const width = node.props.width;
      if (width !== undefined) {
        if (typeof width !== "number" || !Number.isFinite(width) || width <= 0) {
          throw new Error(`SiteLogo width must be a positive number. Received: ${String(width)}`);
        }

        attrs.width = width;
      }

      for (const key of ["isLink", "opensInNewTab", "shouldSyncIcon"] as const) {
        const value = node.props[key];

        if (value !== undefined) {
          if (typeof value !== "boolean") {
            throw new Error(`SiteLogo ${key} must be a boolean. Received: ${String(value)}`);
          }

          attrs[key] = value;
        }
      }

      for (const key of ["linkTarget", "rel"] as const) {
        const value = node.props[key];

        if (value !== undefined) {
          if (typeof value !== "string" || value.length === 0) {
            throw new Error(`SiteLogo ${key} must be a non-empty string.`);
          }

          attrs[key] = value;
        }
      }

      return {
        blockName: "core/site-logo",
        attrs,
        innerBlocks: [],
        innerHTML: "",
      };
    }
    case "Heading": {
      const level = Number(node.props.level ?? 2);

      if (!Number.isInteger(level) || level < 1 || level > 6) {
        throw new Error(`Heading level must be an integer from 1 to 6. Received: ${String(node.props.level)}`);
      }

      const attrs: Record<string, unknown> = level === 2 ? {} : { level };
      const className = node.props.className;
      if (className !== undefined) {
        if (typeof className !== "string" || className.length === 0) {
          throw new Error("Heading className must be a non-empty string.");
        }

        attrs.className = className;
      }

      return {
        blockName: "core/heading",
        attrs,
        innerBlocks: [],
        innerHTML: expectTextChildren(node),
      };
    }
    case "Paragraph": {
      const attrs: Record<string, unknown> = {};
      const className = node.props.className;
      if (className !== undefined) {
        if (typeof className !== "string" || className.length === 0) {
          throw new Error("Paragraph className must be a non-empty string.");
        }

        attrs.className = className;
      }

      return {
        blockName: "core/paragraph",
        attrs,
        innerBlocks: [],
        innerHTML: expectTextChildren(node),
      };
    }
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

      if (common.backgroundColor) {
        attrs.backgroundColor = common.backgroundColor;
      }

      if (common.textColor) {
        attrs.textColor = common.textColor;
      }

      if (common.fontSize) {
        attrs.fontSize = common.fontSize;
      }

      if (common.fontFamily) {
        attrs.fontFamily = common.fontFamily;
      }

      if (common.style) {
        attrs.style = common.style;
      }

      if (common.layout) {
        attrs.layout = common.layout;
      }

      return {
        blockName: "core/navigation",
        attrs,
        innerBlocks: compileChildren(node.children, ctx),
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

      const attrs = applyBlockSugar(node.props);

      // A string child is the block's raw static save markup, emitted verbatim
      // (not escaped) — an explicit override. Element children compile to inner
      // blocks. The two cannot be mixed.
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

      // A registered block renders its real WordPress save markup.
      const rendered = ctx.renderBlock?.(name, attrs);

      if (rendered !== undefined) {
        return {
          blockName: name,
          attrs,
          innerBlocks: [],
          innerHTML: rendered,
        };
      }

      return {
        blockName: name,
        attrs,
        innerBlocks: compileChildren(node.children, ctx),
        innerHTML: "",
      };
    }
  }
}

export function compileDocument(node: ElementNode, ctx: CompileContext = {}): BlockDocument {
  if (node.type !== "Page") {
    throw new Error("The root element must be <Page>.");
  }

  return {
    blocks: compileChildren(node.children, ctx),
  };
}
