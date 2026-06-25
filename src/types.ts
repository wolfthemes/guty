export type ComponentType =
  | "Page"
  | "Section"
  | "Container"
  | "Heading"
  | "Paragraph";

export type Child = ElementNode | string;

export interface ElementNode {
  type: ComponentType;
  props: Record<string, unknown>;
  children: Child[];
}

export interface BlockNode {
  blockName: "core/group" | "core/heading" | "core/paragraph";
  attrs: Record<string, unknown>;
  innerBlocks: BlockNode[];
  innerHTML: string;
}

export interface BlockDocument {
  blocks: BlockNode[];
}

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export type ParagraphProps = Record<string, never>;
export type ContainerProps = Record<string, never>;
export type SectionProps = Record<string, never>;
export type PageProps = Record<string, never>;
