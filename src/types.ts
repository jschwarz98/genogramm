// Base Types
export type Id = string;
export type Coordinate = { x: number, y: number };
export type Dimensions = { width: number, height: number };
export type XYWH = Coordinate & Dimensions;

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
    InsertingPerson, // Inserting the selected type of node
    Translating, // move selected nodes
    Resizing, // resize selected nodes
}

// Base Node
export enum NodeType {
    Person,
    Arrow,
}

export type Node = {
    id: Id,
    type: NodeType,
    position: Coordinate,
    dimensions: Dimensions,
    border: BorderStyle | null,
    backgroundColor: HtmlColor,
    information: string | null
};

export type PersonNode = Node & {
    type: NodeType.Person,
    iconUrl: string
    name: string,
}

export type LineStyle = 'solid' | 'dotted' | 'double' | 'tripple';
export type ArrowHead = 'none' | 'hollow' | 'solid';
export type ArrowNode = Node & {
    type: NodeType.Arrow,
    relativePoints: Coordinate[],
    node1: Node | null, // this is one moved, we need to move the x/y and relative points
    node2: Node | null, // this is one moved, we need to move the relative points
    startingArrowHead: ArrowHead,
    endingArrowHead: ArrowHead,
    lineStyles: LineStyle[],

}

export type NodeAttributeChangedEvent<N extends Node, K extends keyof N> = {
    id: Id,
    field: K,
    value: N[K]
};
