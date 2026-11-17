import { getPrisma } from "../services/db.js";

// Returns true if user is within rate limit (less than 3 requests today)
export async function checkRateLimit(telegramId) {
  const prisma = getPrisma();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const user = await prisma.user.findUnique({ where: { telegramId } });
  if (!user) return true; // new user, no requests

  const count = await prisma.request.count({
    where: {
      userId: user.id,
      createdAt: { gte: startOfDay },
    },
  });

  return count < 3;
}
