import {Coordinate} from "$/types";

export const ZeroCoordinate: Coordinate = {x: 0, y: 0}

export function pointerEventToCanvasPoint(e: React.MouseEvent, absoluteOffset: Coordinate, canvasPosition: Coordinate): Coordinate {
    return {
        x: Math.round(e.clientX - absoluteOffset.x + canvasPosition.x),
        y: Math.round(e.clientY - absoluteOffset.y + canvasPosition.y)
    }
}

export function delay(ms: number, data: any = null) {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export function generateId(length = 16) {
    const alphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    let id = "";
    const indexes = crypto.getRandomValues(new Uint8Array(length));
    for (let n = 0; n < length; n++) {
        id += alphabet[63 & indexes[n]];
    }
    return id;

}

/// SHAD CN UI STUFF
import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

///

