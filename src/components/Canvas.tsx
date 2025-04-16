import React, {useEffect, useRef, useState} from "react";
import {generateId, pointerEventToCanvasPoint, ZeroCoordinate} from "$/lib/utils";
import {
    ArrowNode,
    CanvasMode,
    Coordinate,
    NodeType,
    PersonNode,
    NodeAttributeChangedEvent
} from "$/types";
import Person from "$/components/Person";
import exportSvg from "$/lib/export/render/export-svg";
import Bus, {Event} from "$/lib/event-bus";

function Canvas() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [canvasWidth, setCanvasWidth] = useState<number>(120);
    const [canvasHeight, setCanvasHeight] = useState<number>(90);

    const [mode, setMode] = useState<CanvasMode>(CanvasMode.None);
    const [offset, setOffset] = useState<Coordinate>(ZeroCoordinate);
    const [pointerOrigin, setPointerOrigin] = useState<Coordinate>(ZeroCoordinate);
    const [_pointerLocation, setPointerLocation] = useState<Coordinate>(ZeroCoordinate);

    const [elements, setElements] = useState<(PersonNode | ArrowNode)[]>([]);

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

    const changeAttributeOnElement = <K extends keyof PersonNode>(payload: NodeAttributeChangedEvent<PersonNode, K>) => {
        const id = payload.id;
        let updatedElement = null;
        console.log("updating elements", elements);
        const updatedElements = elements.map(element => {
            if (element.id === id && element.type === NodeType.Person) {
                element[payload.field] = payload.value;
                updatedElement = element;
            }
            return element;
        });
        console.log("updated elements:", updatedElements);
        setElements(updatedElements);
        if (updatedElement) {
            console.log("updated the element", updatedElement);
            Bus.emit(Event.Node_Selected, updatedElement);
        }
    }
    // rerun all the time to recapture the new elements on rerenders
    useEffect(() => {
        Bus.on(Event.Person_Attribute_Changed, changeAttributeOnElement);
        return () => {
            Bus.off(Event.Person_Attribute_Changed, changeAttributeOnElement);
        }
    });

    // run only on inital mount
    useEffect(() => {
        const exportCurrentSvg = async () => {
            const result = await exportSvg(svgRef.current);
            if (result.success) {
                alert("success")
            } else {
                alert("error")
            }
        }
        const setBasicTool = () => setMode(CanvasMode.None);
        const setInsertPersonTool = () => setMode(CanvasMode.InsertingPerson);


        Bus.on(Event.Toolbar_Clicked_Selection, setBasicTool);
        Bus.on(Event.Toolbar_Clicked_AddPerson, setInsertPersonTool);
        Bus.on(Event.Toolbar_Clicked_Export, exportCurrentSvg);
        return () => {
            Bus.off(Event.Toolbar_Clicked_AddPerson, setInsertPersonTool);
            Bus.off(Event.Toolbar_Clicked_Export, exportCurrentSvg);
            Bus.off(Event.Toolbar_Clicked_Selection, setBasicTool);
        }
    }, [])

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
        const newPointerOrigin = pointerEventToCanvasPoint(e, getAbsoluteOffset(), offset);
        setPointerOrigin(newPointerOrigin);
        if (shift) {
            setMode(CanvasMode.SelectionArea);
        } else if (mode === CanvasMode.InsertingPerson) {
            const newPerson: PersonNode = {
                id: generateId(),
                type: NodeType.Person,
                position: newPointerOrigin,
                dimensions: {width: 200, height: 200},
                iconUrl: "/images/rectangle.svg",
                name: '',
                information: '',
                border: {thickness: "1px", color: "black", style: "solid"},
                backgroundColor: "transparent"
            };
            console.log("adding person", newPerson);
            setElements([...elements, newPerson]);
            setTimeout(() => console.log(elements), 10);
        } else {
            setMode(CanvasMode.DraggingCanvas)
        }
    }
    const onMouseMove = function (e: React.MouseEvent) {
        if (mode === CanvasMode.None || mode === CanvasMode.InsertingPerson) {
            return;
        }

        const pointerLocation = pointerEventToCanvasPoint(e, getAbsoluteOffset(), offset)
        if (mode === CanvasMode.DraggingCanvas) {
            const speedFactor = 0.95;
            const xDif = Math.floor(speedFactor * (pointerOrigin.x - pointerLocation.x));
            const yDif = Math.floor(speedFactor * (pointerOrigin.y - pointerLocation.y));
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
        Bus.emit(Event.Toolbar_Reset, null);
        setMode(CanvasMode.None);
    }
    const onMouseLeave = function (e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (mode !== CanvasMode.InsertingPerson) {
            setMode(CanvasMode.None)
        }
    }

    const onWheel = function (e: React.WheelEvent) {

        const deltaY = Math.floor(e.deltaY);
        const minSize = 50;
        const maxSize = 10_000;

        let transform = 0;
        if (deltaY <= 0) {
            const smallerDimension = Math.min(canvasWidth, canvasHeight);
            const remainingZoomIn = Math.max(smallerDimension - minSize, 0);
            if (remainingZoomIn + deltaY <= 0) {
                transform = -remainingZoomIn;
            } else {
                transform = deltaY;
            }
        } else {
            const largerDimension = Math.max(canvasWidth, canvasHeight);
            const zoomOutWiggleRoom = Math.max(maxSize - largerDimension, 0);
            if (deltaY > zoomOutWiggleRoom) {
                transform = zoomOutWiggleRoom;
            } else {
                transform = deltaY;
            }
        }
        setOffset({x: offset.x - Math.floor(transform / 2), y: offset.y - Math.floor(transform / 2)})
        setCanvasWidth(canvasWidth + Math.round(transform));
        setCanvasHeight(canvasHeight + Math.round(transform));

    }


    return (
        <div ref={containerRef} className="h-full rounded-md overflow-hidden">
            <svg ref={svgRef}
                 xmlns="http://www.w3.org/2000/svg"
                 className="bg-white w-full h-full block shadow-xs"
                 viewBox={`${offset.x} ${offset.y} ${canvasWidth} ${canvasHeight}`}
                 onMouseDown={onMouseDown}
                 onMouseMove={onMouseMove}
                 onMouseUp={onMouseUp}
                 onWheel={onWheel}
                 onMouseLeave={onMouseLeave}>
                {elements.map(element => {
                    switch (element.type) {
                        case NodeType.Person:
                            return <Person key={element.id} {...(element as PersonNode)}></Person>;
                        default:
                            return <></>
                    }
                })}
            </svg>
        </div>
    );
}

export default Canvas;
