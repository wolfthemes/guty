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
  | "Button";

export type Child = ElementNode | string;

export interface ElementNode {
  type: ComponentType;
  props: Record<string, unknown>;
  children: Child[];
}

export interface BlockNode {
  blockName:
    | "core/group"
    | "core/heading"
    | "core/paragraph"
    | "core/pattern"
    | "core/navigation"
    | "core/navigation-link"
    | "core/button";
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
