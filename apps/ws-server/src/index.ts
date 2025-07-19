import { WebSocket, WebSocketServer } from 'ws';
import { CheckUser } from './helper/check-user';
import { prisma } from '@repo/db/prisma-client';

const wss = new WebSocketServer({ port: 8080 });

interface UserSocket {
  userId: string;
  rooms: number[];
  ws: WebSocket;
}

interface Drawing {
  roomId: number;
  shapeType: 'RECT' | 'CIRCLE' | 'PENCIL';
  senderId: string;
  rect?: Rect;
  circle?: Circle;
  pencil?: Pencil;
  rectId?: string;
  circleId?: string;
  pencilId?: string;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  drawing: Drawing;
}

interface Circle {
  centerX: number;
  centerY: number;
  radius: number;
  drawing: Drawing;
}

interface Pencil {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  drawing: Drawing;
}

const users: UserSocket[] = [];

wss.on('connection', async (ws, request) => {
  // const userId = CheckUser(request);
  const userId = '123';

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
        const drawingData: Drawing = {
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

        await prisma.drawing.create({ data: {
          roomId: roomId,
          senderId: user.userId,
          shapeType: shapeType,
          rect: shapeData.rect,
          circle: shapeData.circle,
          pencil: shapeData.pencil,
          rectId: shapeData.rect?.id,
          circleId: shapeData.circle?.id,
          pencilId: shapeData.pencil?.id,
        } });

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
