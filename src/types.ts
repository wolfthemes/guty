export type ComponentType =
  | "Page"
  | "Section"
  | "Container"
  | "Heading"
  | "Paragraph"
  | "Pattern"
  | "Header"
  | "SiteLogo"
  | "Navigation"
  | "NavigationLink"
  | "Button"
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

/** Props shared by group-like blocks (Section, Container, Header, Navigation). */
export interface CommonBlockProps {
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
}

export interface PatternProps {
  slug: string;
}

export type ParagraphProps = Record<string, never>;
export interface GroupBlockProps extends CommonBlockProps {
  tagName?: string;
}

export type ContainerProps = GroupBlockProps;
export type SectionProps = GroupBlockProps;
export type HeaderProps = GroupBlockProps;
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
