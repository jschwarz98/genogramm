import {XYWH} from "$/types";

export default function createSlices(totalDimensions: XYWH, sliceSize: number): XYWH[] {
    const result = [];

    let x = 0;
    let y = 0;
    const width = totalDimensions.width;
    const height = totalDimensions.height;

    while (y < height) {
        while (x < width) {
            result.push({
                x: totalDimensions.x + x,
                y: totalDimensions.y + y,
                width: Math.min(sliceSize, width - x),
                height: Math.min(sliceSize, height - y)
            })
            x += sliceSize;
        }
        x = 0;
        y += sliceSize;
    }
    return result;
}