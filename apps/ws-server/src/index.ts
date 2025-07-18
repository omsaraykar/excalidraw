import { WebSocket, WebSocketServer } from 'ws';
import { CheckUser } from './helper/check-user';
import { prisma } from '@repo/db/prisma-client';

const wss = new WebSocketServer({ port: 8080 });

interface UserSocket {
  userId: string;
  rooms: number[];
  ws: WebSocket;
}

const users: UserSocket[] = []; // get from db

wss.on('connection', async (ws, request) => {
  const userId = CheckUser(request);

  if (!userId) {
    ws.close();
    return;
  }

  const user: UserSocket = {
    userId,
    rooms: [],
    ws,
  };

  users.push(user);

  ws.on('message', async (data) => {
    let parsedData;
    try {
      parsedData = typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString());
    } catch (err) {
      console.error('Invalid JSON:', err);
      return;
    }

    const { type } = parsedData;

    if (type === 'join_room') {
      const roomId = Number(parsedData.roomId);
      if (!user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
      }
    }

    if (type === 'leave_room') {
      const roomId = Number(parsedData.roomId);
      user.rooms = user.rooms.filter((id) => id !== roomId);
    }

    if (type === 'draw') {
      const roomId = Number(parsedData.roomId);
      const shapeType = parsedData.shapeType as 'RECT' | 'CIRCLE' | 'PENCIL';
      const shapeData = parsedData.shape;

      try {
        const drawingData: any = {
          roomId,
          shapeType,
          senderId: user.userId,
        };

        if (shapeType === 'RECT') {
          const rect = await prisma.rect.create({ data: shapeData });
          drawingData.rectId = rect.id;
        } else if (shapeType === 'CIRCLE') {
          const circle = await prisma.circle.create({ data: shapeData });
          drawingData.circleId = circle.id;
        } else if (shapeType === 'PENCIL') {
          const pencil = await prisma.pencil.create({ data: shapeData });
          drawingData.pencilId = pencil.id;
        }

        await prisma.drawing.create({ data: drawingData });

        // Broadcast to all users in the room
        users.forEach((u) => {
          if (u.rooms.includes(roomId)) {
            u.ws.send(
              JSON.stringify({
                type: 'draw',
                roomId,
                shapeType,
                shape: shapeData,
              })
            );
          }
        });
      } catch (err) {
        console.error('Failed to save drawing:', err);
        ws.send(JSON.stringify({ error: 'Failed to save drawing' }));
      }
    }
  });

  ws.on('close', () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});
