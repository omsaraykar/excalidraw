import { Request, Response } from 'express';

export const getRoom = async (req: Request, res: Response) => {
  // Get room logic
  res.json({ message: "Get Room" });
};

export const createRoom = async (req: Request, res: Response) => {
  // Create room logic
  res.json({ message: "Room created" });
};

export const updateRoom = async (req: Request, res: Response) => {
  // Update logic
  res.json({ message: "Room updated" });
};

export const deleteRoom = async (req: Request, res: Response) => {
  // Delete logic
  res.json({ message: "Room deleted" });
};
