import {XYWH} from "$/types";
import {BrowserWindow, ipcMain} from "electron";
import {delay} from "$/lib/utils";

export default async function captureTile(svg: string, styles: string, slice: XYWH) {
    const offscreenWin = new BrowserWindow({
        width: slice.width,
        height: slice.height,
        show: false,
        webPreferences: {
            offscreen: true,
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    const sliceId = `loaded-tile-${slice.x}-${slice.y}`;
    const tileProcessing = new Promise((resolve) => {
        ipcMain.once(sliceId, resolve);
    });
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' blob: data:;">
        <style>
          ${styles}
          html, body, svg { margin: 0; padding: 0; width: ${slice.width}px; height: ${slice.height}px; border-radius: 0 !important; overflow: hidden}
        </style>
        <title>image tile window - ${sliceId}</title>
      </head>
      <body>
        ${svg}
        <script>
          const svg = document.querySelector('svg');
          if (svg) {
            svg.setAttribute('viewBox', '${slice.x} ${slice.y} ${slice.width} ${slice.height}');
          }
          
          const {ipcRenderer} = require("electron");
          window.onload = () => ipcRenderer.send('${sliceId}');
        </script>
      </body>
    </html>
  `;
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    await offscreenWin.loadURL(dataUrl);
    await tileProcessing;
    const image = await offscreenWin.webContents.capturePage({x: 0, y: 0, width: slice.width, height: slice.height});
    offscreenWin.destroy();
    return {...slice, dataUrl: image.toDataURL()};
}