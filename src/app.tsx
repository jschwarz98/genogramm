import { createRoot } from 'react-dom/client';
import Canvas from '$/components/Canvas';
import Toolbar from '$/components/Toolbar';

const App = () => {
  return <div id="app" className="min-w-3xl h-full grid grid-cols-12 grid-rows-12 gap-1">
    <div className='col-span-9 row-span-12 w-full h-full'>
      <Canvas></Canvas>
    </div>
    <div className="col-span-3 row-span-2 w-full h-full">
      <Toolbar />
    </div>
    <div className="col-span-3 row-span-10 w-full h-full">
      viel platz für die infos
    </div>
  </div>
}

const root = createRoot(document.body);
root.render(<App />);
