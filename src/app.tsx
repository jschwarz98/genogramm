import {StrictMode} from "react";
import { createRoot } from 'react-dom/client';
import Canvas from '$/components/Canvas';
import Toolbar from '$/components/Toolbar';
import Details from "$/components/Details";

const App = () => {
  return <div id="app" className="min-w-3xl h-full grid grid-cols-12 grid-rows-12 gap-1">
    <div className='col-span-9 row-span-12 w-full h-full'>
      <Canvas></Canvas>
    </div>
    <div className="col-span-3 row-span-12 flex flex-col gap-3 w-full h-full">
      <Toolbar />

      <Details></Details>
    </div>
  </div>
}

const root = createRoot(document.body);
root.render(<StrictMode><App /></StrictMode>);
