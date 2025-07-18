"use client";

import { useEffect, useRef, useState } from "react";
import Toolbar from "@/components/canvas/toolbar";
import initDraw from "@/draw/index";
import { Tool } from "@/types/tool";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [selectedTool, setSelectedTool] = useState<Tool>(Tool.RECT);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<ReturnType<typeof initDraw> | null>(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      if (drawRef.current) drawRef.current.destroy();
      drawRef.current = initDraw(canvas, selectedTool);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      drawRef.current?.destroy();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-gray-400" />
    </div>
  );
}