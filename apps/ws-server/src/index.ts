import { WebSocket, WebSocketServer } from 'ws';
import { CheckUser } from './helper/check-user';
import { prisma } from '@repo/db/prisma-client';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  userId: string,
  rooms: string[],
  ws: WebSocket
}

const users: User[] = [];

wss.on('connection', function connection(ws, request) {
  const userId = CheckUser(request);
  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {

    let parsedData;
    if (typeof data !== 'string') {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prisma.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          senderId: userId
        }
      })

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }));
        }
      })
    }
    
  });

});