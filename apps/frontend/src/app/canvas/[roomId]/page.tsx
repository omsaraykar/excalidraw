"use client";

import { useEffect, useRef, useState } from "react";
import initDraw from "@/draw/index";
import Toolbar from "@/components/canvas/toolbar";
import { Tool } from "@/types/tool";

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<ReturnType<typeof initDraw> | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>(Tool.RECT);

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

    resizeCanvas(); // initial
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      drawRef.current?.destroy();
    };
  }, [selectedTool]);

  return (
    <div className="relative w-screen h-screen">
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-gray-400" />
    </div>
  );
}
