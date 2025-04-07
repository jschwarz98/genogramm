// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// preload.js
import {contextBridge, ipcRenderer} from 'electron';
import {XYWH} from "$/types";

contextBridge.exposeInMainWorld('electronAPI', {
    exportSvg: (svg: string,
                dimensions: XYWH,
                padding: number,
                styles: string) => ipcRenderer.invoke('export-svg-as-png', svg, dimensions, padding, styles),
    ipcInvoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
});