"use client";

import { useEffect, useRef, useState } from "react";
import Toolbar from "@/components/canvas/toolbar";
import initDraw from "@/draw/index";
import { Tool } from "@/types/types";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [selectedTool, setSelectedTool] = useState<Tool>(Tool.RECT);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<Awaited<ReturnType<typeof initDraw>> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isCancelled = false;

    const resizeCanvas = async () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      if (drawRef.current) {
        drawRef.current.destroy?.();
        drawRef.current = null;
      }

      const drawInstance = await initDraw(canvas, selectedTool, Number(roomId));

      if (!isCancelled) {
        drawRef.current = drawInstance;
      } else {
        drawInstance?.destroy?.(); // Clean up if effect is canceled
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", resizeCanvas);
      drawRef.current?.destroy?.();
    };
  }, [roomId, selectedTool]);

  return (
    <div className="relative w-screen h-screen">
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-gray-400" />
    </div>
  );
}
