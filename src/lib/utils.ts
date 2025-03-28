import { Coordinate } from "$/types";

export function pointerEventToCanvasPoint(e: React.MouseEvent, absoluteOffset: Coordinate, canvasPosition: Coordinate): Coordinate {
  return { x: Math.round(e.clientX - absoluteOffset.x + canvasPosition.x), y: Math.round(e.clientY - absoluteOffset.y + canvasPosition.y) }
}

export const ZeroCoordinate: Coordinate = { x: 0, y: 0 }
