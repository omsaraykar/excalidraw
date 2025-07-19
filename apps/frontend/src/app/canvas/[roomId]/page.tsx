import RoomCanvas from "@/components/canvas/room-canvas";

export default async function CanvasPage({ params }: { params: { roomId: string } }) { 
  const roomId = await params.roomId;
  return (
    <RoomCanvas roomId={roomId} />
  );
}
