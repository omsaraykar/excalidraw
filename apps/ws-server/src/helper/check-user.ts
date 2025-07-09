import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { JWT_SECRET } from '@repo/backend-common/config'

export function CheckUser (request: IncomingMessage): string | null {
  const url = request.url;

  if (!url) {
    return null;
  }

  try {
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";

    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
      console.log("Incorrect token")
  }
  
  return null;
}

