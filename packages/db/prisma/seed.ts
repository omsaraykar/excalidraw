import { PrismaClient, ShapeType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      password: "hashedpassword", // normally hash with bcrypt
      avatar: "https://i.pravatar.cc/150?u=alice",
    },
  });

  // Create a room
  const room = await prisma.room.create({
    data: {
      slug: "first-room",
      adminId: user.id,
    },
  });

  // Create a rectangle drawing
  const rect = await prisma.rect.create({
    data: {
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    },
  });

  await prisma.drawing.create({
    data: {
      roomId: room.id,
      senderId: user.id,
      shapeType: ShapeType.RECT,
      rectId: rect.id,
    },
  });

  // Create a circle drawing
  const circle = await prisma.circle.create({
    data: {
      centerX: 200,
      centerY: 150,
      radius: 75,
    },
  });

  await prisma.drawing.create({
    data: {
      roomId: room.id,
      senderId: user.id,
      shapeType: ShapeType.CIRCLE,
      circleId: circle.id,
    },
  });

  // Create a pencil drawing
  const pencil = await prisma.pencil.create({
    data: {
      startX: 0,
      startY: 0,
      endX: 300,
      endY: 300,
    },
  });

  await prisma.drawing.create({
    data: {
      roomId: room.id,
      senderId: user.id,
      shapeType: ShapeType.PENCIL,
      pencilId: pencil.id,
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
