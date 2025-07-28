"use client";

import { useParams } from "next/navigation";
import RoomCanvas from "@/components/canvas/room-canvas";

export default async function CanvasPage() { 
  const params = useParams()
  if (!params.roomId) {
    params.roomId = "";
  }
  const roomId = params.roomId.toString();
  return (
    <RoomCanvas roomId={roomId} />
  );
}
