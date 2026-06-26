import type {
  BlockProps,
  ButtonProps,
  Child,
  ColumnProps,
  ColumnsProps,
  ComponentType,
  ContainerProps,
  ElementNode,
  HeaderProps,
  HeadingProps,
  NavigationLinkProps,
  NavigationProps,
  PageProps,
  ParagraphProps,
  PatternProps,
  SectionProps,
  SiteLogoProps,
} from "./types.js";

type PrimitiveChild = Child | PrimitiveChild[] | number | boolean | null | undefined;

function component(name: ComponentType): ComponentType {
  return name;
}

export const Page = component("Page");
export const Section = component("Section");
export const Container = component("Container");
export const Columns = component("Columns");
export const Column = component("Column");
export const Heading = component("Heading");
export const Paragraph = component("Paragraph");
export const Pattern = component("Pattern");
export const Header = component("Header");
export const SiteLogo = component("SiteLogo");
export const Navigation = component("Navigation");
export const NavigationLink = component("NavigationLink");
export const Button = component("Button");
export const Block = component("Block");

function normalizeChildren(input: PrimitiveChild[]): Child[] {
  const result: Child[] = [];

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

export function createElement(
  type: ComponentType,
  props: Record<string, unknown> | null,
  ...children: PrimitiveChild[]
): ElementNode {
  return {
    type,
    props: props ?? {},
    children: normalizeChildren(children),
  };
}

declare global {
  namespace JSX {
    type Element = ElementNode;

    interface IntrinsicElements {
      Page: PageProps;
      Section: SectionProps;
      Container: ContainerProps;
      Columns: ColumnsProps;
      Column: ColumnProps;
      Heading: HeadingProps;
      Paragraph: ParagraphProps;
      Pattern: PatternProps;
      Header: HeaderProps;
      SiteLogo: SiteLogoProps;
      Navigation: NavigationProps;
      NavigationLink: NavigationLinkProps;
      Button: ButtonProps;
      Block: BlockProps;
    }
  }
}
