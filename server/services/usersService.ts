import prisma from "../configs/db.js";

export async function updateStatus(
  userId: string,
  status: "ONLINE" | "OFFLINE",
) {
  await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: { status: status },
  });
}
