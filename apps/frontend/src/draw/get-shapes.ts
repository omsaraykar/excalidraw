import axios from "axios";

export async function getShapesFromDb(roomId: number) {
  const res = await axios.get(`http://localhost:5000/api/v1/drawings/${roomId}`);
  const drawings = res.data.drawings;

  const shapes = drawings.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message)
    return messageData.shape;
  })

  return shapes;
}