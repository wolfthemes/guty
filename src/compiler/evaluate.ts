import { readFile } from "node:fs/promises";
import vm from "node:vm";

import type { ElementNode } from "../types.js";
import { transpileToCjs } from "./transpile.js";

const RUNTIME_PREAMBLE = `
const Page = "Page";
const Section = "Section";
const Container = "Container";
const Main = "Main";
const Columns = "Columns";
const Column = "Column";
const Buttons = "Buttons";
const Heading = "Heading";
const Paragraph = "Paragraph";
const Pattern = "Pattern";
const TemplatePart = "TemplatePart";
const Header = "Header";
const Footer = "Footer";
const SiteLogo = "SiteLogo";
const Navigation = "Navigation";
const NavigationLink = "NavigationLink";
const Button = "Button";
const Cover = "Cover";
const Image = "Image";
const Spacer = "Spacer";
const List = "List";
const ListItem = "ListItem";
const Link = "Link";
const Details = "Details";
const Html = "Html";
const Shortcode = "Shortcode";
const Query = "Query";
const PostTemplate = "PostTemplate";
const QueryPagination = "QueryPagination";
const QueryPaginationPrevious = "QueryPaginationPrevious";
const QueryPaginationNext = "QueryPaginationNext";
const QueryNoResults = "QueryNoResults";
const QueryTitle = "QueryTitle";
const PostTitle = "PostTitle";
const PostDate = "PostDate";
const PostContent = "PostContent";
const PostFeaturedImage = "PostFeaturedImage";
const PostExcerpt = "PostExcerpt";
const Block = "Block";
function normalizeChildren(input) {
  const result = [];
  for (const child of input) {
    if (Array.isArray(child)) {
      result.push(...normalizeChildren(child));
      continue;
    }
    if (child === null || child === undefined || typeof child === "boolean") {
      continue;
    }
    if (typeof child === "number") {
      result.push(String(child));
      continue;
    }
    result.push(child);
  }
  return result;
}
function createElement(type, props, ...children) {
  return {
    type,
    props: props ?? {},
    children: normalizeChildren(children),
  };
}
`;

function normalizeTemplateSource(source: string): string {
  if (/\bexport\s+default\b/.test(source)) {
    return source;
  }

  const lines = source.split(/\r?\n/);
  let index = 0;

  while (index < lines.length) {
    const trimmed = (lines[index] ?? "").trim();

    if (trimmed.length === 0 || trimmed.startsWith("//")) {
      index += 1;
      continue;
    }

    break;
  }

  const prefix = lines.slice(0, index).join("\n");
  const body = lines.slice(index).join("\n").trim();

  if (!body) {
    return source;
  }

  return [prefix, `export default (${body});`].filter((value) => value.length > 0).join("\n");
}

function transpileSource(source: string, filePath: string): string {
  const normalizedSource = normalizeTemplateSource(source);
  const wrappedSource = `${RUNTIME_PREAMBLE}\n${normalizedSource}`;
  return transpileToCjs(wrappedSource, filePath);
}

export async function evaluateTemplate(filePath: string): Promise<ElementNode> {
  const source = await readFile(filePath, "utf8");
  const output = transpileSource(source, filePath);
  const module = { exports: {} as { default?: unknown } };
  const context = vm.createContext({
    module,
    exports: module.exports,
  });

  new vm.Script(output, { filename: filePath }).runInContext(context);

  if (!module.exports.default || typeof module.exports.default !== "object" || !("type" in module.exports.default)) {
    throw new Error(`Template ${filePath} must default export a Guty page.`);
  }

  return module.exports.default as ElementNode;
}
