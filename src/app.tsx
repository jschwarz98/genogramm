import { createRoot } from 'react-dom/client';

const App = () => {
  return <h2 className="text-3xl">abc</h2>
}

const root = createRoot(document.body);
root.render(<App />);
