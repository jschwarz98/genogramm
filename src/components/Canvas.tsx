import { pointerEventToCanvasPoint, ZeroCoordinate } from "$/lib/utils";
import { CanvasMode, Coordinate, PersonNode, ArrowNode } from "$/types";
import { useCallback, useEffect, useRef, useState } from "react";
import Person from "$/components/Person";

function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [canvasWidth, setCanvasWidth] = useState<number>(1200);
  const [canvasHeight, setCanvasHeight] = useState<number>(900);

  const [mode, setMode] = useState<CanvasMode>(CanvasMode.None);
  const [offset, setOffset] = useState<Coordinate>(ZeroCoordinate);
  const [pointerOrigin, setPointerOrigin] = useState<Coordinate>(ZeroCoordinate);
  const [pointerLocation, setPointerLocation] = useState<Coordinate>(ZeroCoordinate);

  const [elements, setElements] = useState<Array<PersonNode | ArrowNode>>([]);
  const [svgResizeObserver, setSvgResizeObserver] = useState<ResizeObserver>(new ResizeObserver((entries: ResizeObserverEntry[]) => {
    console.log("currently have ", entries.length, "entries in the observer");
    entries.forEach(entry => {
      const rect = entry.contentRect
      setCanvasWidth(rect.width);
      setCanvasHeight(rect.height);
    })
  }));
  useEffect(() => {

    if (svgResizeObserver) {
      svgResizeObserver.disconnect();
    }
    svgResizeObserver.observe(containerRef.current);


    const recalculateCanvasSize = () => {
      console.log("recalculating canvas size")
      if (!containerRef.current) {
        console.log("no current")
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      console.log("dimensions", rect);
      setCanvasWidth(rect.width);
      setCanvasHeight(rect.height);
    };
    window.addEventListener('resize', recalculateCanvasSize);
    recalculateCanvasSize();
    let counter = 0;
    let height = canvasHeight;
    const interval = setInterval(() => {
      recalculateCanvasSize();
      if (canvasHeight > 0 && canvasHeight === height) {
        counter++;
      }
      height = canvasHeight;
      if (counter > 10) {
        console.log("STOPPED INTERVAL")
        clearInterval(interval)
      }
    }, 50);
    return () => {
      window.removeEventListener('resize', recalculateCanvasSize)
      clearInterval(interval);
    };
  }, [containerRef])

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
      const slowDownFactor = 1;
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
  const onMouseLeave = function (e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (mode !== CanvasMode.Inserting) {
      setMode(CanvasMode.None)
    }
  }

  return (
    <div ref={containerRef} className="h-full" onResize={() => console.log("RESSS")}>
      <svg
        ref={svgRef}
        className="bg-white w-full h-full"
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
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
