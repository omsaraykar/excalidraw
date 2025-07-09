import { Request, Response } from 'express';
import { CreateRoomSchema } from '@repo/common/schema';
import { prisma } from '@repo/db/prisma-client';

export const getRoom = async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prisma.chat.findMany({
      where: {
        roomId: roomId
      },
      orderBy: {
        id: "desc"
      },
      take: 100
    });

    res.json({
      messages
    });

  } catch (error) {
    console.log(error);
    res.json({
      messages: []
    });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs"
    });
    return;
  }

  const userId = req.userId;

  await prisma.room.create({
    data: {
      slug: parsedData.data.name,
      adminId: userId
    }
  })

  res.json({ message: "Room created" });
};

export const updateRoom = async (req: Request, res: Response) => {
  // Update logic
  res.json({ message: "Room updated" });
};

export const deleteRoom = async (req: Request, res: Response) => {
  // Update logic
  res.json({ message: "Room updated" });
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const room = await prisma.room.findFirst({
    where: {
      slug
    }
  });

  res.json({
    room
  });
};


