import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";

import { transpileToCjs } from "./transpile.js";

const require = createRequire(import.meta.url);
const wpElement = require("@wordpress/element") as {
  createElement: (type: unknown, props?: unknown, ...children: unknown[]) => unknown;
  Fragment: unknown;
  renderToString: (element: unknown) => string;
};

interface BlockMetadata {
  name: string;
  attributes?: Record<string, { default?: unknown }>;
  supports?: BlockSupports;
}

interface BlockSupports {
  align?: boolean | string[];
  className?: boolean;
  spacing?: boolean | { margin?: boolean | string[]; padding?: boolean | string[] };
  typography?: boolean | { fontSize?: boolean; fontFamily?: boolean };
}

type SaveFn = (props: { attributes: Record<string, unknown> }) => unknown;

interface BlockEntry {
  metadata: BlockMetadata;
  save: SaveFn;
  // Holder the useBlockProps.save shim reads from for the current render.
  state: { attributes: Record<string, unknown> };
}

export type BlockRegistry = Map<string, BlockEntry>;

const SPACING_SIDES = ["top", "right", "bottom", "left"] as const;

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Convert a WordPress preset reference ("var:preset|spacing|40") into its CSS
// custom property ("var(--wp--preset--spacing--40)"); pass anything else through.
function cssValue(value: unknown): unknown {
  if (typeof value === "string" && value.startsWith("var:")) {
    return `var(--wp--${value.slice(4).split("|").join("--")})`;
  }

  return value;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

function supportsAlign(support: BlockSupports["align"], value: unknown): value is string {
  if (typeof value !== "string" || support === false || support === undefined) {
    return false;
  }

  return support === true || support.includes(value);
}

function supportsSpacingAxis(
  support: BlockSupports["spacing"],
  axis: "margin" | "padding",
  side: (typeof SPACING_SIDES)[number],
): boolean {
  if (!support) {
    return false;
  }

  if (support === true) {
    return true;
  }

  const axisSupport = support[axis];

  return axisSupport === true || (Array.isArray(axisSupport) && axisSupport.includes(side));
}

function supportsTypographyValue(
  support: BlockSupports["typography"],
  key: "fontSize" | "fontFamily",
): boolean {
  if (!support) {
    return false;
  }

  if (support === true) {
    return true;
  }

  return support[key] === true;
}

/**
 * A focused reimplementation of `useBlockProps.save`: it derives the wrapper
 * className and inline style from the block's supports + attributes. This is a
 * subset (className, align, spacing, typography) and may need extending for
 * blocks that use other supports.
 */
function computeBlockProps(
  metadata: BlockMetadata,
  attributes: Record<string, unknown>,
  passed: Record<string, unknown> = {},
): Record<string, unknown> & { className: string } {
  const supports = metadata.supports ?? {};
  const classes = [`wp-block-${metadata.name.replace("/", "-")}`];
  const passedClassName = typeof passed.className === "string" ? passed.className : undefined;
  const passedStyle = asRecord(passed.style);

  if (passedClassName) {
    classes.push(passedClassName);
  }

  if (supports.className !== false && typeof attributes.className === "string") {
    classes.push(attributes.className);
  }

  if (supportsAlign(supports.align, attributes.align)) {
    classes.push(`align${attributes.align}`);
  }

  if (supportsTypographyValue(supports.typography, "fontSize") && typeof attributes.fontSize === "string") {
    classes.push(`has-${attributes.fontSize}-font-size`, "has-font-size");
  }

  if (supportsTypographyValue(supports.typography, "fontFamily") && typeof attributes.fontFamily === "string") {
    classes.push(`has-${attributes.fontFamily}-font-family`);
  }

  const style: Record<string, unknown> = { ...(passedStyle ?? {}) };
  const blockStyle = asRecord(attributes.style);
  const spacing = asRecord(blockStyle?.spacing);

  for (const axis of ["margin", "padding"] as const) {
    const sides = asRecord(spacing?.[axis]);
    if (!sides) {
      continue;
    }

    for (const side of SPACING_SIDES) {
      if (sides[side] !== undefined && supportsSpacingAxis(supports.spacing, axis, side)) {
        style[`${axis}${capitalize(side)}`] = cssValue(sides[side]);
      }
    }
  }

  const typography = asRecord(blockStyle?.typography);
  if (typography && supports.typography) {
    for (const [key, value] of Object.entries(typography)) {
      style[key] = value;
    }
  }

  const className = classes.join(" ");
  const props: Record<string, unknown> & { className: string } = { ...passed, className };

  if (Object.keys(style).length > 0) {
    props.style = style;
  } else {
    delete props.style;
  }

  return props;
}

function instantiateSave(jsSource: string, fileName: string, dir: string, metadata: BlockMetadata): BlockEntry {
  const state: BlockEntry["state"] = { attributes: {} };

  const shimRequire = (id: string): unknown => {
    if (id === "@wordpress/element") {
      return wpElement;
    }

    if (id === "@wordpress/block-editor") {
      return {
        useBlockProps: {
          save: (passed: { className?: string; style?: Record<string, unknown> } = {}) =>
            computeBlockProps(metadata, state.attributes, passed),
        },
        InnerBlocks: { Content: () => null },
        RichText: { Content: ({ value, tagName: Tag = "div", ...rest }: Record<string, unknown>) => wpElement.createElement(Tag as string, rest, value) },
      };
    }

    if (id === "@wordpress/i18n") {
      return { __: (value: string) => value, _x: (value: string) => value, _n: (single: string) => single };
    }

    if (id.endsWith(".scss") || id.endsWith(".css")) {
      return {};
    }

    if (id.startsWith(".")) {
      return require(path.resolve(dir, id));
    }

    return require(id);
  };

  // JSX in save.js compiles to `createElement(...)`; provide it from @wordpress/element.
  const preamble = `const { createElement, Fragment } = require("@wordpress/element");\n`;
  const transpiled = transpileToCjs(preamble + jsSource, fileName);

  const module = { exports: {} as { default?: unknown } };
  const context = vm.createContext({ module, exports: module.exports, require: shimRequire, console });
  new vm.Script(transpiled, { filename: fileName }).runInContext(context);

  const save = module.exports.default;
  if (typeof save !== "function") {
    throw new Error(`Block ${metadata.name}: save.js must default-export a function.`);
  }

  return { metadata, save: save as SaveFn, state };
}

async function collectBlockJson(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const found = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectBlockJson(fullPath);
      }

      return entry.isFile() && entry.name === "block.json" ? [fullPath] : [];
    }),
  );

  return found.flat();
}

/**
 * Scan the given source directories for blocks (a `block.json` with a sibling
 * `save.js`) and load each block's real `save` function so its markup can be
 * generated the way WordPress does.
 */
export async function loadBlockRegistry(sources: string[]): Promise<BlockRegistry> {
  const registry: BlockRegistry = new Map();

  for (const source of sources) {
    const blockJsonPaths = await collectBlockJson(path.resolve(source));

    for (const blockJsonPath of blockJsonPaths) {
      const metadata = JSON.parse(await readFile(blockJsonPath, "utf8")) as BlockMetadata;

      if (!metadata.name) {
        continue;
      }

      const dir = path.dirname(blockJsonPath);
      const saveFile = path.join(dir, "save.js");

      let saveSource: string;
      try {
        saveSource = await readFile(saveFile, "utf8");
      } catch {
        continue;
      }

      registry.set(metadata.name, instantiateSave(saveSource, saveFile, dir, metadata));
    }
  }

  return registry;
}

/** Render a registered block's `save` output to an HTML string, the WordPress way. */
export function renderBlockSave(entry: BlockEntry, attributes: Record<string, unknown>): string {
  const merged: Record<string, unknown> = {};

  for (const [key, definition] of Object.entries(entry.metadata.attributes ?? {})) {
    if (definition && "default" in definition) {
      merged[key] = definition.default;
    }
  }

  Object.assign(merged, attributes);
  entry.state.attributes = merged;

  return wpElement.renderToString(entry.save({ attributes: merged }));
}

/** Build the sync renderer the compiler uses; returns undefined for unknown blocks. */
export function createBlockRenderer(registry: BlockRegistry) {
  return (name: string, attributes: Record<string, unknown>): string | undefined => {
    const entry = registry.get(name);
    return entry ? renderBlockSave(entry, attributes) : undefined;
  };
}
