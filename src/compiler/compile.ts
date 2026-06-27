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

function expectRawTextChildren(node: ElementNode): string {
  return node.children
    .map((child) => {
      if (typeof child !== "string") {
        throw new Error(`${node.type} only supports raw text children.`);
      }

      return child;
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

function readNonEmptyString(node: ElementNode, key: string, value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${node.type} ${key} must be a non-empty string.`);
  }

  return value;
}

function readBoolean(node: ElementNode, key: string, value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new Error(`${node.type} ${key} must be a boolean. Received: ${String(value)}`);
  }

  return value;
}

function readNumber(node: ElementNode, key: string, value: unknown): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${node.type} ${key} must be a finite number. Received: ${String(value)}`);
  }

  return value;
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
  return typeof value === "number" && /^\d+$/.test(String(value))
    ? `var:preset|spacing|${value}`
    : String(value);
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
  anchor?: string;
  metadata?: Record<string, unknown>;
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
    anchor,
    className,
    align,
    backgroundColor,
    textColor,
    textAlign,
    fontSize,
    fontFamily,
    style,
    metadata,
    layout,
    layoutType,
    layoutContentSize,
    layoutOrientation,
    tagName,
  } = node.props;

  if (anchor !== undefined) {
    if (typeof anchor !== "string" || anchor.length === 0) {
      throw new Error(`${node.type} anchor must be a non-empty string.`);
    }

    attrs.anchor = anchor;
  }

  if (metadata !== undefined) {
    const metadataRecord = asRecord(metadata);
    if (!metadataRecord) {
      throw new Error(`${node.type} metadata must be an object.`);
    }

    attrs.metadata = metadataRecord;
  }

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

  if (common.metadata) {
    attrs.metadata = common.metadata;
  }

  if (common.anchor) {
    attrs.anchor = common.anchor;
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

function commonContainerBlock(
  node: ElementNode,
  ctx: CompileContext,
  blockName: string,
  attrs: Record<string, unknown>,
): BlockNode {
  return {
    blockName,
    attrs,
    innerBlocks: compileChildren(node.children, ctx),
    innerHTML: "",
  };
}

function readPlainObjectAttr(node: ElementNode, attrs: Record<string, unknown>, key: string): void {
  const value = node.props[key];

  if (value === undefined) {
    return;
  }

  const record = asRecord(value);
  if (!record) {
    throw new Error(`${node.type} ${key} must be an object.`);
  }

  attrs[key] = record;
}

function readStringAttr(node: ElementNode, attrs: Record<string, unknown>, key: string): void {
  const value = readNonEmptyString(node, key, node.props[key]);
  if (value !== undefined) {
    attrs[key] = value;
  }
}

function readNumberAttr(node: ElementNode, attrs: Record<string, unknown>, key: string): void {
  const value = readNumber(node, key, node.props[key]);
  if (value !== undefined) {
    attrs[key] = value;
  }
}

function readBooleanAttr(node: ElementNode, attrs: Record<string, unknown>, key: string): void {
  const value = readBoolean(node, key, node.props[key]);
  if (value !== undefined) {
    attrs[key] = value;
  }
}

function textAlignValue(node: ElementNode, key: string, value: unknown): "left" | "center" | "right" | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value !== "left" && value !== "center" && value !== "right") {
    throw new Error(`${node.type} ${key} must be "left", "center", or "right". Received: ${String(value)}`);
  }

  return value;
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
    case "Main":
      return groupBlock(node, ctx, "main");
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

      readPlainObjectAttr(node, attrs, "style");

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

      readPlainObjectAttr(node, attrs, "layout");

      return {
        blockName: "core/column",
        attrs,
        innerBlocks: compileChildren(node.children, ctx),
        innerHTML: "",
      };
    }
    case "Buttons": {
      const attrs: Record<string, unknown> = {};
      readStringAttr(node, attrs, "className");
      readPlainObjectAttr(node, attrs, "style");
      readPlainObjectAttr(node, attrs, "layout");

      return commonContainerBlock(node, ctx, "core/buttons", attrs);
    }
    case "Header":
    case "Footer": {
      if (node.children.length > 0) {
        throw new Error(`${node.type} is a void block and cannot have children.`);
      }
      const slug = readNonEmptyString(node, "slug", node.props.slug);
      if (!slug) {
        throw new Error(`${node.type} requires a non-empty slug prop.`);
      }
      const area = node.type === "Header" ? "header" : "footer";
      return {
        blockName: "core/template-part",
        attrs: { slug, tagName: area, area },
        innerBlocks: [],
        innerHTML: "",
      };
    }
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
      const textAlign = textAlignValue(node, "textAlign", node.props.textAlign);
      if (textAlign) {
        attrs.textAlign = textAlign;
      }
      readStringAttr(node, attrs, "className");
      readPlainObjectAttr(node, attrs, "style");
      readStringAttr(node, attrs, "fontSize");

      return {
        blockName: "core/heading",
        attrs,
        innerBlocks: [],
        innerHTML: expectTextChildren(node),
      };
    }
    case "Paragraph": {
      const attrs: Record<string, unknown> = {};
      const align = textAlignValue(node, "align", node.props.align);
      if (align) {
        attrs.align = align;
      }
      readStringAttr(node, attrs, "className");
      readPlainObjectAttr(node, attrs, "style");
      readStringAttr(node, attrs, "fontSize");

      return {
        blockName: "core/paragraph",
        attrs,
        innerBlocks: [],
        innerHTML: expectTextChildren(node),
      };
    }
    case "TemplatePart": {
      if (node.children.length > 0) {
        throw new Error("TemplatePart is a void block and cannot have children.");
      }

      const slug = readNonEmptyString(node, "slug", node.props.slug);
      if (!slug) {
        throw new Error("TemplatePart requires a non-empty slug prop.");
      }

      const attrs: Record<string, unknown> = { slug };
      readStringAttr(node, attrs, "tagName");
      readStringAttr(node, attrs, "area");
      readStringAttr(node, attrs, "theme");

      return {
        blockName: "core/template-part",
        attrs,
        innerBlocks: [],
        innerHTML: "",
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

      for (const key of ["linkTarget", "rel"] as const) {
        const value = node.props[key];

        if (value !== undefined) {
          if (typeof value !== "string" || value.length === 0) {
            throw new Error(`Button ${key} must be a non-empty string.`);
          }

          attrs[key] = value;
        }
      }

      const wrapperClass = ["wp-block-button", typeof className === "string" ? className : ""]
        .filter((value) => value.length > 0)
        .join(" ");
      const href = typeof url === "string" ? ` href="${escapeHtml(url)}"` : "";
      const target = typeof node.props.linkTarget === "string" ? ` target="${escapeHtml(node.props.linkTarget)}"` : "";
      const rel = typeof node.props.rel === "string" ? ` rel="${escapeHtml(node.props.rel)}"` : "";
      const innerHTML = `<div class="${wrapperClass}"><a class="wp-block-button__link wp-element-button"${href}${target}${rel}>${text}</a></div>`;

      return {
        blockName: "core/button",
        attrs,
        innerBlocks: [],
        innerHTML,
      };
    }
    case "Cover": {
      const common = readCommonAttrs(node);
      const attrs: Record<string, unknown> = {};

      readStringAttr(node, attrs, "url");
      readNumberAttr(node, attrs, "dimRatio");
      readNumberAttr(node, attrs, "minHeight");
      readStringAttr(node, attrs, "minHeightUnit");

      for (const key of ["align", "className", "style"] as const) {
        if (common[key]) {
          attrs[key] = common[key];
        }
      }

      return commonContainerBlock(node, ctx, "core/cover", attrs);
    }
    case "Image": {
      const attrs: Record<string, unknown> = {};
      readStringAttr(node, attrs, "className");
      readStringAttr(node, attrs, "align");
      readStringAttr(node, attrs, "scale");
      readStringAttr(node, attrs, "sizeSlug");
      readStringAttr(node, attrs, "linkDestination");
      readPlainObjectAttr(node, attrs, "style");

      for (const key of ["width", "height"] as const) {
        const value = node.props[key];
        if (value === undefined) {
          continue;
        }

        if ((typeof value !== "string" || value.length === 0) && typeof value !== "number") {
          throw new Error(`${node.type} ${key} must be a non-empty string or number.`);
        }

        attrs[key] = value;
      }

      return {
        blockName: "core/image",
        attrs,
        innerBlocks: [],
        innerHTML: node.children.length > 0 ? expectRawTextChildren(node) : "",
      };
    }
    case "Spacer": {
      if (node.children.length > 0) {
        throw new Error("Spacer is a void block and cannot have children.");
      }

      const attrs: Record<string, unknown> = {};
      readStringAttr(node, attrs, "height");

      return {
        blockName: "core/spacer",
        attrs,
        innerBlocks: [],
        innerHTML: "",
      };
    }
    case "List": {
      const attrs: Record<string, unknown> = {};
      readStringAttr(node, attrs, "className");

      return commonContainerBlock(node, ctx, "core/list", attrs);
    }
    case "ListItem":
      return {
        blockName: "core/list-item",
        attrs: {},
        innerBlocks: [],
        innerHTML: expectTextChildren(node),
      };
    case "Details":
      if (node.props.summary !== undefined && (typeof node.props.summary !== "string" || node.props.summary.length === 0)) {
        throw new Error("Details summary must be a non-empty string.");
      }

      return {
        blockName: "core/details",
        attrs: {},
        innerBlocks: compileChildren(node.children, ctx),
        innerHTML: typeof node.props.summary === "string" ? escapeHtml(node.props.summary) : "",
      };
    case "Html":
      return {
        blockName: "core/html",
        attrs: {},
        innerBlocks: [],
        innerHTML: expectRawTextChildren(node),
      };
    case "Shortcode":
      return {
        blockName: "core/shortcode",
        attrs: {},
        innerBlocks: [],
        innerHTML: expectRawTextChildren(node),
      };
    case "Query": {
      const attrs: Record<string, unknown> = {};
      readNumberAttr(node, attrs, "queryId");
      readPlainObjectAttr(node, attrs, "query");
      readPlainObjectAttr(node, attrs, "layout");

      return commonContainerBlock(node, ctx, "core/query", attrs);
    }
    case "PostTemplate": {
      const attrs: Record<string, unknown> = {};
      readPlainObjectAttr(node, attrs, "style");
      readPlainObjectAttr(node, attrs, "layout");

      return commonContainerBlock(node, ctx, "core/post-template", attrs);
    }
    case "QueryPagination": {
      const attrs: Record<string, unknown> = {};
      readPlainObjectAttr(node, attrs, "layout");

      return commonContainerBlock(node, ctx, "core/query-pagination", attrs);
    }
    case "QueryPaginationPrevious":
      return { blockName: "core/query-pagination-previous", attrs: {}, innerBlocks: [], innerHTML: "" };
    case "QueryPaginationNext":
      return { blockName: "core/query-pagination-next", attrs: {}, innerBlocks: [], innerHTML: "" };
    case "QueryNoResults":
      return commonContainerBlock(node, ctx, "core/query-no-results", {});
    case "QueryTitle": {
      if (node.children.length > 0) {
        throw new Error("QueryTitle is a void block and cannot have children.");
      }

      const attrs: Record<string, unknown> = {};
      readStringAttr(node, attrs, "type");
      const textAlign = textAlignValue(node, "textAlign", node.props.textAlign);
      if (textAlign) {
        attrs.textAlign = textAlign;
      }
      readStringAttr(node, attrs, "fontSize");

      return { blockName: "core/query-title", attrs, innerBlocks: [], innerHTML: "" };
    }
    case "PostTitle": {
      if (node.children.length > 0) {
        throw new Error("PostTitle is a void block and cannot have children.");
      }

      const level = node.props.level === undefined ? undefined : Number(node.props.level);
      const attrs: Record<string, unknown> = {};
      if (level !== undefined) {
        if (!Number.isInteger(level) || level < 1 || level > 6) {
          throw new Error(`PostTitle level must be an integer from 1 to 6. Received: ${String(node.props.level)}`);
        }
        attrs.level = level;
      }
      readBooleanAttr(node, attrs, "isLink");
      readStringAttr(node, attrs, "fontSize");

      return { blockName: "core/post-title", attrs, innerBlocks: [], innerHTML: "" };
    }
    case "PostDate": {
      if (node.children.length > 0) {
        throw new Error("PostDate is a void block and cannot have children.");
      }

      const attrs: Record<string, unknown> = {};
      readStringAttr(node, attrs, "fontSize");

      return { blockName: "core/post-date", attrs, innerBlocks: [], innerHTML: "" };
    }
    case "PostContent": {
      if (node.children.length > 0) {
        throw new Error("PostContent is a void block and cannot have children.");
      }

      const attrs: Record<string, unknown> = {};
      readPlainObjectAttr(node, attrs, "layout");

      return { blockName: "core/post-content", attrs, innerBlocks: [], innerHTML: "" };
    }
    case "PostFeaturedImage": {
      if (node.children.length > 0) {
        throw new Error("PostFeaturedImage is a void block and cannot have children.");
      }

      const attrs: Record<string, unknown> = {};
      readBooleanAttr(node, attrs, "isLink");

      return { blockName: "core/post-featured-image", attrs, innerBlocks: [], innerHTML: "" };
    }
    case "PostExcerpt": {
      if (node.children.length > 0) {
        throw new Error("PostExcerpt is a void block and cannot have children.");
      }

      const attrs: Record<string, unknown> = {};
      readStringAttr(node, attrs, "moreText");
      readNumberAttr(node, attrs, "excerptLength");

      return { blockName: "core/post-excerpt", attrs, innerBlocks: [], innerHTML: "" };
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
