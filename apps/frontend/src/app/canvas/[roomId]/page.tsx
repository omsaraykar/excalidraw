"use client";

import { useEffect, useRef, useState } from "react";
import initDraw from '@/draw/index'

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDraw(canvas);
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="bg-gray-400"
      />
    </div>
  );
}
