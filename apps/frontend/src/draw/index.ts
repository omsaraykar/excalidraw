type Shape =
  | {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
  }
  | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
  }
  | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };

export default function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let existingShapes: Shape[] = [];

  let isDrawing = false;
  let start = { x: 0, y: 0 };

  const getMousePos = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const drawShape = (shape: Shape) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "pencil") {
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }
  };

  const drawAllShapes = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existingShapes.forEach(drawShape);
  };

  const handleMouseDown = (e: MouseEvent) => {
    const pos = getMousePos(e);
    start = pos;
    isDrawing = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const width = pos.x - start.x;
    const height = pos.y - start.y;

    drawAllShapes();
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.strokeRect(start.x, start.y, width, height);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;
    isDrawing = false;

    const pos = getMousePos(e);
    const width = pos.x - start.x;
    const height = pos.y - start.y;

    // Save shape
    const newShape: Shape = {
      type: "rect",
      x: start.x,
      y: start.y,
      width,
      height,
    };
    existingShapes.push(newShape);

    drawAllShapes();
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);

  // -------- Helper functions --------

  function clearCanvas() {
    if (!ctx) return null;
    existingShapes = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function getExistingShapes() {
    return [...existingShapes];
  }

  return {
    destroy: () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    },
    clearCanvas,
    getExistingShapes,
  };
}
