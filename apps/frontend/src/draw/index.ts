import { Tool } from "@/types/types";
import { getShapesFromDb } from "./get-shapes";

interface Rect {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Circle {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
}

interface Pencil {
  type: "pencil";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type Shape = Rect | Circle | Pencil;


export default async function initDraw(canvas: HTMLCanvasElement, selectedTool: Tool, roomId: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const socket = new WebSocket("ws://localhost:8080");

  let shapes: Shape[] = await getShapesFromDb(roomId) as Shape[];
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

    switch (shape.type) {
      case "rect":
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case "circle":
        ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "pencil":
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
        break;
    }

    ctx.closePath();
  };

  const redrawCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(drawShape);
  };

  const handleMouseDown = (e: MouseEvent) => {
    start = getMousePos(e);
    isDrawing = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;

    const { x, y } = getMousePos(e);
    const width = x - start.x;
    const height = y - start.y;

    redrawCanvas();

    // Show preview rectangle
    ctx.beginPath();
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.strokeRect(start.x, start.y, width, height);
    ctx.closePath();
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;
    isDrawing = false;

    const { x, y } = getMousePos(e);
    const width = x - start.x;
    const height = y - start.y;

    const newShape: Shape = {
      type: "rect",
      x: start.x,
      y: start.y,
      width,
      height,
    };

    shapes.push(newShape);
    socket.send(JSON.stringify({
      type: "draw",
      shapeType: "RECT",
      roomId: roomId,
      shapeData: newShape
    }))

    redrawCanvas();
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);

  return {
    destroy: () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    },
    clearCanvas: () => {
      shapes = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    getExistingShapes: () => [...shapes],
  };
}
