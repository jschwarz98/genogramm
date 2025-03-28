// Base Types
export type Id = string;
export type NodeType = 'icon' | 'text' | 'icon-text' | 'arrow';
export type Coordinate = { x: number, y: number };
export type Dimensions = { width: number, height: number };
export type HtmlColor = string;

// Canvas

export enum CanvasMode {
  None,
  DraggingCanvas, // drag and drop move visible area around
  SelectionArea, // create a area to select nodes
  Inserting, // Inserting the selected type of node
  Translating, // move selected nodes
  Resizing, // resize selected nodes
}

// Base Node
export type Node = {
  id: Id,
  type: NodeType,
  position: Coordinate,
  dimensions: Dimensions,
  backgroundColor: HtmlColor,
};

// Special Nodes
export type ObjectNodes = TextNode | IconNode | IconTextNode;

export type TextNode = Node & {
  content: string,
};

export type IconNode = Node & {
  srcUrl: string,
};

export type IconTextNode = TextNode & IconNode;

export type ArrowNode = Node & {
  edges: Coordinate[],
}
