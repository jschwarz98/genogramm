import { createRoot } from 'react-dom/client';
import Canvas from '$/components/Canvas';

const App = () => {
  return <>
    <h2 className="text-3xl">abc</h2>
    <div className='border-2 border-red-400 w-min'>
      <Canvas></Canvas>
    </div>
  </>
}

const root = createRoot(document.body);
root.render(<App />);
