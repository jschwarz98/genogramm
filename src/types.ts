export type Id = string;
export type NodeType = 'icon' | 'text' | 'icon-text' | 'arrow';
export type Coordinate = { x: number, y: number };
export type Dimensions = { width: number, height: number };

export type Node = {
  id: Id,
  type: NodeType,
  position: Coordinate,
  dimensions: Dimensions,
};

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
