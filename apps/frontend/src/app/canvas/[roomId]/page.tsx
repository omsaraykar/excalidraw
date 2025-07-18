import RoomCanvas from "@/components/canvas/room-canvas";

export default function CanvasPage({ params }: { params: { roomId: string } }) {  
  return (
    <RoomCanvas roomId={params.roomId} />
  );
}
