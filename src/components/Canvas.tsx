import { useState } from "react";

function Canvas() {
  const [offset, _setOffset] = useState([0, 0])
  return <svg className="w-100 h-100"></svg>
}

export default Canvas;
