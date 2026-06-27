import type {
  BlockProps,
  ButtonsProps,
  ButtonProps,
  Child,
  ColumnProps,
  ColumnsProps,
  ComponentType,
  ContainerProps,
  CoverProps,
  DetailsProps,
  ElementNode,
  FooterProps,
  HeaderProps,
  HeadingProps,
  HtmlProps,
  ImageProps,
  ListItemProps,
  ListProps,
  NavigationLinkProps,
  NavigationProps,
  PageProps,
  ParagraphProps,
  PatternProps,
  PostContentProps,
  PostDateProps,
  PostExcerptProps,
  PostFeaturedImageProps,
  PostTemplateProps,
  PostTitleProps,
  QueryNoResultsProps,
  QueryPaginationNextProps,
  QueryPaginationPreviousProps,
  QueryPaginationProps,
  QueryProps,
  QueryTitleProps,
  SectionProps,
  ShortcodeProps,
  SiteLogoProps,
  SpacerProps,
  TemplatePartProps,
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
export const Buttons = component("Buttons");
export const Heading = component("Heading");
export const Paragraph = component("Paragraph");
export const Pattern = component("Pattern");
export const TemplatePart = component("TemplatePart");
export const Header = component("Header");
export const Footer = component("Footer");
export const SiteLogo = component("SiteLogo");
export const Navigation = component("Navigation");
export const NavigationLink = component("NavigationLink");
export const Button = component("Button");
export const Cover = component("Cover");
export const Image = component("Image");
export const Spacer = component("Spacer");
export const List = component("List");
export const ListItem = component("ListItem");
export const Details = component("Details");
export const Html = component("Html");
export const Shortcode = component("Shortcode");
export const Query = component("Query");
export const PostTemplate = component("PostTemplate");
export const QueryPagination = component("QueryPagination");
export const QueryPaginationPrevious = component("QueryPaginationPrevious");
export const QueryPaginationNext = component("QueryPaginationNext");
export const QueryNoResults = component("QueryNoResults");
export const QueryTitle = component("QueryTitle");
export const PostTitle = component("PostTitle");
export const PostDate = component("PostDate");
export const PostContent = component("PostContent");
export const PostFeaturedImage = component("PostFeaturedImage");
export const PostExcerpt = component("PostExcerpt");
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
      Buttons: ButtonsProps;
      Heading: HeadingProps;
      Paragraph: ParagraphProps;
      Pattern: PatternProps;
      TemplatePart: TemplatePartProps;
      Header: HeaderProps;
      Footer: FooterProps;
      SiteLogo: SiteLogoProps;
      Navigation: NavigationProps;
      NavigationLink: NavigationLinkProps;
      Button: ButtonProps;
      Cover: CoverProps;
      Image: ImageProps;
      Spacer: SpacerProps;
      List: ListProps;
      ListItem: ListItemProps;
      Details: DetailsProps;
      Html: HtmlProps;
      Shortcode: ShortcodeProps;
      Query: QueryProps;
      PostTemplate: PostTemplateProps;
      QueryPagination: QueryPaginationProps;
      QueryPaginationPrevious: QueryPaginationPreviousProps;
      QueryPaginationNext: QueryPaginationNextProps;
      QueryNoResults: QueryNoResultsProps;
      QueryTitle: QueryTitleProps;
      PostTitle: PostTitleProps;
      PostDate: PostDateProps;
      PostContent: PostContentProps;
      PostFeaturedImage: PostFeaturedImageProps;
      PostExcerpt: PostExcerptProps;
      Block: BlockProps;
    }
  }
}
