export type ComponentType =
  | "Page"
  | "Section"
  | "Container"
  | "Main"
  | "Columns"
  | "Column"
  | "Buttons"
  | "Heading"
  | "Paragraph"
  | "Pattern"
  | "TemplatePart"
  | "Header"
  | "Footer"
  | "SiteLogo"
  | "Navigation"
  | "NavigationLink"
  | "Button"
  | "Cover"
  | "Image"
  | "Spacer"
  | "List"
  | "ListItem"
  | "Details"
  | "Html"
  | "Shortcode"
  | "Query"
  | "PostTemplate"
  | "QueryPagination"
  | "QueryPaginationPrevious"
  | "QueryPaginationNext"
  | "QueryNoResults"
  | "QueryTitle"
  | "PostTitle"
  | "PostDate"
  | "PostContent"
  | "PostFeaturedImage"
  | "PostExcerpt"
  | "Block";

export type Child = ElementNode | string;

export interface ElementNode {
  type: ComponentType;
  props: Record<string, unknown>;
  children: Child[];
}

export interface BlockNode {
  // Open-ended to allow arbitrary custom blocks (e.g. "wolf-store/theme-index")
  // emitted via the generic `Block` element.
  blockName: string;
  attrs: Record<string, unknown>;
  innerBlocks: BlockNode[];
  innerHTML: string;
}

export interface BlockDocument {
  blocks: BlockNode[];
}

export type BlockAlign = "wide" | "full";

export interface BlockLayout {
  type: "constrained" | "flex" | "default";
  contentSize?: string;
  justifyContent?: "left" | "center" | "right" | "space-between";
  flexWrap?: "wrap" | "nowrap";
  orientation?: "horizontal" | "vertical";
}

/** Props shared by group-like blocks (Section, Container, Main, Navigation). */
export interface CommonBlockProps {
  anchor?: string;
  metadata?: Record<string, unknown>;
  className?: string;
  align?: BlockAlign;
  backgroundColor?: string;
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  fontSize?: string;
  fontFamily?: string;
  style?: Record<string, unknown>;
  layoutType?: BlockLayout["type"];
  layoutContentSize?: string;
  layoutOrientation?: BlockLayout["orientation"];
  layoutJustifyContent?: string;
  p?: string | number;
  px?: string | number;
  py?: string | number;
  pt?: string | number;
  pr?: string | number;
  pb?: string | number;
  pl?: string | number;
  m?: string | number;
  mx?: string | number;
  my?: string | number;
  mt?: string | number;
  mr?: string | number;
  mb?: string | number;
  ml?: string | number;
  layout?: BlockLayout;
}

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  textAlign?: "left" | "center" | "right";
  fontSize?: string;
  style?: Record<string, unknown>;
}

export interface PatternProps {
  slug: string;
}

export interface ParagraphProps {
  className?: string;
  align?: "left" | "center" | "right";
  textAlign?: "left" | "center" | "right";
  fontSize?: string;
  style?: Record<string, unknown>;
}

export interface TemplatePartProps {
  slug: string;
  tagName?: string;
  area?: "header" | "footer" | "uncategorized" | string;
  theme?: string;
}
export interface GroupBlockProps extends CommonBlockProps {
  tagName?: string;
}

export type ContainerProps = GroupBlockProps;
export type MainProps = GroupBlockProps;
export type SectionProps = GroupBlockProps;
export interface HeaderProps { slug: string }
export interface FooterProps { slug: string }
export type PageProps = Record<string, never>;

export interface SiteLogoProps {
  className?: string;
  width?: number;
  isLink?: boolean;
  opensInNewTab?: boolean;
  linkTarget?: string;
  rel?: string;
  shouldSyncIcon?: boolean;
}

export interface NavigationProps extends CommonBlockProps {
  overlayMenu?: "mobile" | "always" | "never";
}

export interface ColumnsProps {
  className?: string;
  verticalAlignment?: "top" | "center" | "bottom";
  style?: Record<string, unknown>;
}

export interface ColumnProps {
  className?: string;
  width?: string;
  verticalAlignment?: "top" | "center" | "bottom";
  layout?: BlockLayout;
}

export interface NavigationLinkProps {
  label: string;
  url?: string;
  opensInNewTab?: boolean;
}

export interface ButtonProps {
  url?: string;
  className?: string;
  linkTarget?: string;
  rel?: string;
}

export interface ButtonsProps {
  className?: string;
  layout?: BlockLayout;
  style?: Record<string, unknown>;
}

export interface CoverProps extends CommonBlockProps {
  url?: string;
  dimRatio?: number;
  minHeight?: number;
  minHeightUnit?: "px" | "vh" | "vw" | "em" | "rem" | "%" | string;
}

export interface ImageProps {
  className?: string;
  align?: "left" | "center" | "right" | "wide" | "full";
  width?: string | number;
  height?: string | number;
  scale?: "cover" | "contain" | string;
  sizeSlug?: string;
  linkDestination?: "none" | "media" | "attachment" | "custom" | string;
  style?: Record<string, unknown>;
}

export interface SpacerProps {
  height?: string;
}

export interface ListProps {
  className?: string;
}

export type ListItemProps = Record<string, never>;
export interface DetailsProps {
  summary?: string;
}
export type HtmlProps = Record<string, never>;
export type ShortcodeProps = Record<string, never>;

export interface QueryProps {
  queryId?: number;
  query?: Record<string, unknown>;
  layout?: BlockLayout;
}

export interface PostTemplateProps {
  layout?: BlockLayout;
  style?: Record<string, unknown>;
}

export interface QueryPaginationProps {
  layout?: BlockLayout;
}

export type QueryPaginationPreviousProps = Record<string, never>;
export type QueryPaginationNextProps = Record<string, never>;
export type QueryNoResultsProps = Record<string, never>;

export interface QueryTitleProps {
  type?: "archive" | "search" | string;
  textAlign?: "left" | "center" | "right";
  fontSize?: string;
}

export interface PostTitleProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  isLink?: boolean;
  fontSize?: string;
}

export interface PostDateProps {
  fontSize?: string;
}

export interface PostContentProps {
  layout?: BlockLayout;
}

export interface PostFeaturedImageProps {
  isLink?: boolean;
}

export interface PostExcerptProps {
  moreText?: string;
  excerptLength?: number;
}

/**
 * Generic escape hatch for any registered block. `name` is the namespaced block
 * name (e.g. "wolf-store/theme-index"); every other prop becomes a block
 * attribute, in the order written.
 */
export interface BlockProps {
  name: string;
  class?: string;
  className?: string;
  align?: BlockAlign;
  fontSize?: string;
  fontFamily?: string;
  p?: string | number;
  px?: string | number;
  py?: string | number;
  pt?: string | number;
  pr?: string | number;
  pb?: string | number;
  pl?: string | number;
  m?: string | number;
  mx?: string | number;
  my?: string | number;
  mt?: string | number;
  mr?: string | number;
  mb?: string | number;
  ml?: string | number;
  [attr: string]: unknown;
}
