import {XYWH} from "$/types";
import {BrowserWindow, ipcMain} from "electron";

export default async function stitchTiles(tiles: Array<XYWH & { dataUrl: string }>,
                                          originalDimensions: XYWH, padding: number): Promise<string> {
    return new Promise((resolve) => {
        // Create an offscreen BrowserWindow to do the stitching.
        const stitchWin = new BrowserWindow({
            width: originalDimensions.width,
            height: originalDimensions.height,
            show: false,
            webPreferences: {
                offscreen: true,
                nodeIntegration: true,  // needed for the stitching script below
                contextIsolation: false,
                webSecurity: false, // for some reason the script tag wont be executed otherwhise.. check on this later...
            }
        });
        // Build HTML content with a canvas element.
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src 'self' blob: data:;">
        <style>
          html, body, canvas { margin: 0; padding: 0; width: ${originalDimensions.width}px; height: ${originalDimensions.height}px; overflow: hidden;}
          canvas { display: block; border-radius: 0 !important}
        </style>
        <title>Partials Combiner</title>
      </head>
      <body>
        <canvas id="stitchCanvas"></canvas>
        <script>
          const { ipcRenderer } = require('electron');
          ipcRenderer.on('tiles-data', async (event, tiles) => {
            const canvas = document.getElementById('stitchCanvas');
            canvas.width = ${originalDimensions.width};
            canvas.height = ${originalDimensions.height};
            const ctx = canvas.getContext('2d');
            
            for (const tile of tiles) {
              await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                  ctx.drawImage(img, tile.x, tile.y, tile.width, tile.height);
                  resolve();
                };
                img.onerror = resolve;
                img.src = tile.dataUrl;
              });
            }
            const finalDataUrl = canvas.toDataURL('image/png');
            setTimeout(() => ipcRenderer.send('stitch-done', finalDataUrl), 1_000)
            
          });
        </script>
      </body>
      </html>
    `;
        ipcMain.once('stitch-done', (event, finalDataUrl) => {
            stitchWin.destroy();
            resolve(finalDataUrl);
        });
        const stitchDataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
        stitchWin.loadURL(stitchDataUrl).then(() => {
            stitchWin.webContents.send('tiles-data', tiles.map(tile => {
                tile.x -= originalDimensions.x;
                tile.y -= originalDimensions.y;
                return tile;
            }));
            stitchWin.webContents.openDevTools();

        });
    });
}