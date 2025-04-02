// Base Types
export type Id = string;
export type Coordinate = { x: number, y: number };
export type Dimensions = { width: number, height: number };
export type HtmlColor = string | 'transparent';
export type BorderStyle = {
  color: HtmlColor,
  style: string,
  thickness: string,
}
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

type Node = {
  id: Id,
  type: 'Person' | 'Arrow',
  position: Coordinate,
  dimensions: Dimensions,
  border: BorderStyle | null,
  backgroundColor: HtmlColor,
  information: string | null
};

export type PersonNode = Node & {
  iconUrl: string
  name: string,
}

export type LineStyle = 'solid' | 'dotted' | 'double' | 'tripple';
export type ArrowHead = 'none' | 'hollow' | 'solid';
export type ArrowNode = Node & {
  relativePoints: Coordinate[],
  node1: Node | null, // this is one moved, we need to move the x/y and relative points
  node2: Node | null, // this is one moved, we need to move the relative points
  startingArrowHead: ArrowHead,
  endingArrowHead: ArrowHead,
  lineStyles: LineStyle[],

}
