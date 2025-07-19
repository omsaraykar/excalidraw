import axios from "axios";

const HTTP_BACKEND = "http://localhost:5000";

export async function getShapesFromDb(roomId: number) {
  const res = await axios.get(`${HTTP_BACKEND}/drawings/${roomId}`);
  const drawings = res.data.drawings;

  const shapes = drawings.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message)
    return messageData.shape;
  })

  return shapes;
}