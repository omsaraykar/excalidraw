import { Request, Response } from 'express';
import { prisma } from '@repo/db/prisma-client';

export const getDrawings = async (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);
  if (!roomId) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  const drawings = await prisma.drawing.findMany({
    where: { roomId: Number(roomId) },
    include: { rect: true, circle: true, pencil: true },
  });

  res.json({
    drawings
  });
}