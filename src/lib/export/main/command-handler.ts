import {app, dialog} from "electron";
import dimensionSlicing from "$/lib/export/main/dimensions-slices";
import captureTile from "$/lib/export/main/tile-capture";
import stitchTiles from "$/lib/export/main/tile-stich";
import {XYWH} from "$/types";
import path from "node:path";
import fs from "fs";

export default async function (_element: Electron.IpcMainInvokeEvent,
                               svg: string,
                               dimensions: XYWH,
                               padding: number,
                               styles: string): Promise<{ success: boolean }> {
    // Prompt the user with a Save Dialog
    const {canceled, filePath} = await dialog.showSaveDialog({
        title: 'Save Exported Image',
        defaultPath: path.join(app.getPath('desktop'), 'genogramm.png'),
        filters: [{name: 'PNG Image', extensions: ['png']}],
    });

    if (canceled || !filePath) {
        return {success: false};
    }


    const sliceSize = 2500;
    const slices = dimensionSlicing(dimensions, sliceSize);

    const tiles: Array<XYWH & { dataUrl: string }> = [];
    for (const slice of slices) {
        const tile = await captureTile(svg, styles, slice);
        tiles.push(tile);
    }
    const pngDataUrl = await stitchTiles(tiles, dimensions, padding);

    // Remove the data URL prefix and write the base64 data to file
    const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, '');
    try {
        fs.writeFileSync(filePath, base64Data, 'base64');
        return {success: true};
    } catch (error) {
        console.error('Error saving image:', error);
        return {success: false};
    }
}


