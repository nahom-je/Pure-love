import cron from "node-cron";
import { getPrisma } from "./db.js";

// Delete done requests older than 90 days — runs at midnight daily
export function startCleanupJob() {
  cron.schedule("0 0 * * *", async () => {
    try {
      const prisma = getPrisma();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);

      const result = await prisma.request.deleteMany({
        where: {
          status: "done",
          createdAt: { lt: cutoff },
        },
      });

      console.log(`[Cleanup] Deleted ${result.count} old completed requests.`);
    } catch (error) {
      console.error("[Cleanup] Error during cleanup:", error.message);
    }
  });

  console.log("[Cleanup] Scheduled daily cleanup job.");
}
