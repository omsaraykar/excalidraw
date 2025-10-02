import axios from "axios";
import { Drawing, Rect, Circle, Pencil, ShapeType } from "@/types/types";

export async function getShapesFromDb(roomId: number) {
  const res = await axios.get(`http://localhost:5000/api/v1/drawings/${roomId}`);
  const drawings: Drawing[] = res.data.drawings;

  const shapes: (Rect | Circle | Pencil)[] = drawings
    .map((d: Drawing) => {
      switch (d.shapeType) {
        case ShapeType.RECT:
          return d.rect;
        case ShapeType.CIRCLE:
          return d.circle;
        case ShapeType.PENCIL:
          return d.pencil;
        default:
          return null;
      }
    })
    .filter(Boolean) as (Rect | Circle | Pencil)[]; // remove nulls

  return shapes;
}
