export type ComponentType =
  | "Page"
  | "Section"
  | "Container"
  | "Heading"
  | "Paragraph"
  | "Pattern"
  | "Header"
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
  justifyContent?: "left" | "center" | "right" | "space-between";
  flexWrap?: "wrap" | "nowrap";
  orientation?: "horizontal" | "vertical";
}

/** Props shared by group-like blocks (Section, Container, Header, Navigation). */
export interface CommonBlockProps {
  className?: string;
  align?: BlockAlign;
  layout?: BlockLayout;
}

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface PatternProps {
  slug: string;
}

export type ParagraphProps = Record<string, never>;
export type ContainerProps = CommonBlockProps;
export type SectionProps = CommonBlockProps;
export type HeaderProps = CommonBlockProps;
export type PageProps = Record<string, never>;

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
  [attr: string]: unknown;
}
