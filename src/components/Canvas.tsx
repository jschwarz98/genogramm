import { pointerEventToCanvasPoint, ZeroCoordinate } from "$/lib/utils";
import { CanvasMode, Coordinate } from "$/types";
import { useRef, useState } from "react";

function Canvas() {
  const size = 800;
  const svgRef = useRef(null);
  const [mode, setMode] = useState<CanvasMode>(CanvasMode.None);
  const [offset, setOffset] = useState<Coordinate>(ZeroCoordinate);
  const [pointerOrigin, setPointerOrigin] = useState<Coordinate>(ZeroCoordinate);
  const [pointerLocation, setPointerLocation] = useState<Coordinate>(ZeroCoordinate);

  const getAbsoluteOffset = function (): Coordinate {
    if (!svgRef) {
      return ZeroCoordinate;
    }
    const bounds = svgRef.current.getBoundingClientRect();
    return { x: bounds.x ?? 0, y: bounds.y ?? 0 };
  }

  const onMouseDown = function (e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    console.log("on mouse down", e);
    const shift = e.shiftKey;
    setPointerOrigin(pointerEventToCanvasPoint(e, getAbsoluteOffset(), offset));
    console.log("new pointer origin", pointerOrigin);
    if (shift) {
      setMode(CanvasMode.SelectionArea);
    } else {
      setMode(CanvasMode.DraggingCanvas)
    }
  }
  const onMouseMove = function (e: React.MouseEvent) {
    if (mode === CanvasMode.None || mode === CanvasMode.Inserting) {
      return;
    }
    console.log(mode);

    const pointerLocation = pointerEventToCanvasPoint(e, getAbsoluteOffset(), offset)
    if (mode === CanvasMode.DraggingCanvas) {
      const slowDownFactor = 0.5;
      const xDif = Math.round(slowDownFactor * (pointerOrigin.x - pointerLocation.x));
      const yDif = Math.round(slowDownFactor * (pointerOrigin.y - pointerLocation.y));
      setOffset({ x: offset.x + xDif, y: offset.y + yDif });
      setPointerOrigin(pointerLocation);
    } else {

      setPointerLocation(pointerLocation);
      // TODO when resizing und oder selection oder so, dann besondere logik hier anwenden
    }
  }
  const onMouseUp = function (e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setMode(CanvasMode.None);
  }

  return (
    <svg
      ref={svgRef}
      className="w-100 h-100"
      viewBox={`${offset.x} ${offset.y} ${size} ${size}`}
      preserveAspectRatio="xMidYMid meet"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}>
      <circle cx="250" cy="250" r="50" fill="blue" onMouseDown={e => { e.stopPropagation(); e.preventDefault(); console.log("rec clicked"); }} />

    </svg >
  );
}

export default Canvas;
