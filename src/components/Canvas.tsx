import React, {useEffect, useRef, useState} from "react";
import {pointerEventToCanvasPoint, ZeroCoordinate} from "$/lib/utils";
import {ArrowNode, CanvasMode, Coordinate, NodeType, PersonNode} from "$/types";
import Person from "$/components/Person";
import exportSvg from "$/lib/export/render/export-svg";

function Canvas() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [canvasWidth, setCanvasWidth] = useState<number>(120);
    const [canvasHeight, setCanvasHeight] = useState<number>(90);

    const [mode, setMode] = useState<CanvasMode>(CanvasMode.None);
    const [offset, setOffset] = useState<Coordinate>(ZeroCoordinate);
    const [pointerOrigin, setPointerOrigin] = useState<Coordinate>(ZeroCoordinate);
    const [pointerLocation, setPointerLocation] = useState<Coordinate>(ZeroCoordinate);

    const simplePerson: PersonNode = {
        id: 'id-123',
        backgroundColor: 'red',
        border: {style: 'solid', color: 'black', thickness: '1px'},
        position: {x: 1500, y: 100},
        dimensions: {width: 200, height: 200},
        iconUrl: null,
        name: 'Test Person',
        information: 'got some info on you!',
        type: NodeType.Person,
    }
    const simplePerson2: PersonNode = {
        id: 'id-1234',
        backgroundColor: 'red',
        border: {style: 'solid', color: 'black', thickness: '1px'},
        position: {x: 0, y: 0},
        dimensions: {width: 200, height: 2500},
        iconUrl: null,
        name: 'Test Person',
        information: 'got some info on you!',
        type: NodeType.Person,
    }
    const [elements, setElements] = useState<Array<PersonNode | ArrowNode>>([simplePerson, simplePerson2]);

    const svgResizeObserver = useRef<ResizeObserver>(new ResizeObserver((entries: ResizeObserverEntry[]) => {
        entries.forEach(entry => {
            const rect = entry.contentRect
            setCanvasWidth(Math.max(0, Math.floor(rect.width)));
            setCanvasHeight(Math.max(0, Math.floor(rect.height)));
        })
    }));
    useEffect(() => {
        if (svgResizeObserver) {
            svgResizeObserver.current.disconnect();
            svgResizeObserver.current.observe(svgRef.current);
        }
        return () => {
            svgResizeObserver.current.disconnect()
        };
    }, [svgRef])

    const getAbsoluteOffset = function (): Coordinate {
        if (!svgRef) {
            return ZeroCoordinate;
        }
        const bounds = svgRef.current.getBoundingClientRect();
        return {x: bounds.x ?? 0, y: bounds.y ?? 0};
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
            setOffset({x: offset.x + xDif, y: offset.y + yDif});
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

    const exportCurrentSvg = async () => {
        const result = await exportSvg(svgRef.current);
        if (result.success) {
            alert("success")
        } else {
            alert("error")
        }
    }

    return (
        <>
            <button onClick={exportCurrentSvg}>export</button>
            <div>

                <div ref={containerRef} className="h-full rounded-md overflow-hidden">
                    <svg
                        ref={svgRef}
                        xmlns="http://www.w3.org/2000/svg"
                        className="bg-white w-full h-full block"
                        viewBox={`${offset.x} ${offset.y} ${canvasWidth} ${canvasHeight}`}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseLeave}>
                        <>
                            {
                                /*
                                [0, 1, 2, 3, 4, 5, 6, 7].flatMap(m => {
                                    return [0, 1, 2, 3, 4, 5, 6, 7].map(n => <circle key={"" + n + m} cx={50 + (n * 200)} cy={50 + (m * 200)} r="50"
                                                                                     fill="blue"/>)
                                })

                                 */
                                <></>
                            }

                            {elements.map(element => {
                                switch (element.type) {
                                    case NodeType.Person:
                                        return <Person key={element.id} {...(element as PersonNode)}></Person>;
                                    default:
                                        return <></>
                                }
                            })}
                        </>
                    </svg>
                </div>
            </div>
        </>
    );
}

export default Canvas;
