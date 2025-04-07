import {XYWH} from "$/types";
import {BrowserWindow, ipcMain} from "electron";

export default async function stitchTiles(tiles: Array<{
                                              x: number,
                                              y: number,
                                              dataUrl: string
                                          }>,
                                          sliceSize: number,
                                          originalDimensions: XYWH): Promise<string> {
    return new Promise((resolve, reject) => {
        // Create an offscreen BrowserWindow to do the stitching.
        console.log("Stitch win dimensions:", originalDimensions);
        const stitchWin = new BrowserWindow({
            width: originalDimensions.width,
            height: originalDimensions.height,
            show: true,
            webPreferences: {
                offscreen: false,
                nodeIntegration: true,  // needed for the stitching script below
                contextIsolation: false,
                webSecurity: false,
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
            
            console.log(tiles);
            for (const tile of tiles) {
              await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                  ctx.drawImage(img, tile.x, tile.y, ${sliceSize}, ${sliceSize});
                  resolve();
                };
                img.onerror = resolve;
                img.src = tile.dataUrl;
              });
            }
            const finalDataUrl = canvas.toDataURL('image/png');
            setTimeout(() => ipcRenderer.send('stitch-done', finalDataUrl), 10_000)
            
          });
        </script>
      </body>
      </html>
    `;
        const stitchDataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
        // Listen for the stitched result.
        ipcMain.once('stitch-done', (event, finalDataUrl) => {
            stitchWin.destroy();
            resolve(finalDataUrl);
        });
        // load the content
        stitchWin.loadURL(stitchDataUrl).then(() => {
            // Once loaded, send the tile data.
            stitchWin.webContents.send('tiles-data', tiles.map(tile => {
                // draw everything starting at 0,0
                tile.x -= originalDimensions.x;
                tile.y -= originalDimensions.y;
                return tile;
            }));
            stitchWin.webContents.openDevTools();

        });
    });
}