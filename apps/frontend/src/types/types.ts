export enum Tool {
  RECT = "rect",
  CIRCLE = "circle",
  PENCIL = "pencil",
  ERASER = "eraser",
}

export enum ShapeType {
  RECT = "RECT",
  CIRCLE = "CIRCLE",
  PENCIL = "PENCIL",
}

export type Rect = { x: number; y: number; width: number; height: number };
export type Circle = { x: number; y: number; radius: number };
export type Pencil = { points: { x: number; y: number }[] };

export type DrawingBase = {
  id: number;
  roomId: number;
  senderId: string;
  shapeType: ShapeType.RECT | ShapeType.CIRCLE | ShapeType.PENCIL;
  rectId?: string | null;
  circleId?: string | null;
  pencilId?: string | null;
};

export type Drawing =
  | (DrawingBase & { shapeType: ShapeType.RECT; rect: Rect; circle: null; pencil: null })
  | (DrawingBase & { shapeType: ShapeType.CIRCLE; rect: null; circle: Circle; pencil: null })
  | (DrawingBase & { shapeType: ShapeType.PENCIL; rect: null; circle: null; pencil: Pencil });
