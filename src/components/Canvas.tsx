import { pointerEventToCanvasPoint, ZeroCoordinate } from "$/lib/utils";
import { CanvasMode, Coordinate, PersonNode, ArrowNode } from "$/types";
import { useCallback, useEffect, useRef, useState } from "react";
import Person from "$/components/Person";

function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [canvasWidth, setCanvasWidth] = useState<number>(120);
  const [canvasHeight, setCanvasHeight] = useState<number>(90);

  const [mode, setMode] = useState<CanvasMode>(CanvasMode.None);
  const [offset, setOffset] = useState<Coordinate>(ZeroCoordinate);
  const [pointerOrigin, setPointerOrigin] = useState<Coordinate>(ZeroCoordinate);
  const [pointerLocation, setPointerLocation] = useState<Coordinate>(ZeroCoordinate);

  const [elements, setElements] = useState<Array<PersonNode | ArrowNode>>([]);
  const [svgResizeObserver, setSvgResizeObserver] = useState<ResizeObserver>(new ResizeObserver((entries: ResizeObserverEntry[]) => {
    console.log("currently have ", entries.length, "entries in the observer");
    entries.forEach(entry => {
      const rect = entry.contentRect
      // - 8 to account for margin
      setCanvasWidth(Math.max(0, Math.floor(rect.width) - 8));
      setCanvasHeight(Math.max(0, Math.floor(rect.height) - 8));
    })
  }));
  useEffect(() => {
    if (svgResizeObserver) {
      svgResizeObserver.disconnect();
      svgResizeObserver.observe(svgRef.current);
    }
    return () => {
      svgResizeObserver.disconnect()
    };
  }, [svgRef])

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

    const shift = e.shiftKey;
    setPointerOrigin(pointerEventToCanvasPoint(e, getAbsoluteOffset(), offset));
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

    const pointerLocation = pointerEventToCanvasPoint(e, getAbsoluteOffset(), offset)
    if (mode === CanvasMode.DraggingCanvas) {
      const slowDownFactor = 0.9;
      const xDif = Math.floor(slowDownFactor * (pointerOrigin.x - pointerLocation.x));
      const yDif = Math.floor(slowDownFactor * (pointerOrigin.y - pointerLocation.y));
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
  const onMouseLeave = function (e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (mode !== CanvasMode.Inserting) {
      setMode(CanvasMode.None)
    }
  }

  return (
    <div ref={containerRef} className="h-full rounded-md overflow-hidden">
      <svg
        ref={svgRef}
        className="bg-white w-full h-full block"

        viewBox={`${offset.x} ${offset.y} ${canvasWidth} ${canvasHeight}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}>

        <circle cx="250" cy="250" r="50" fill="blue" onMouseDown={e => { e.stopPropagation(); e.preventDefault(); console.log("rec clicked"); }} />

        {elements.map(element => {
          switch (element.type) {
            case "Person": return <Person key={element.id} {...(element as PersonNode)}></Person>;
            default: return <></>
          }
        })}
      </svg>
    </div>
  );
}

export default Canvas;
