import "dotenv/config";
import { Bot, session, webhookCallback } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import express from "express";
import { getPrisma, disconnectDb } from "./services/db.js";
import { startCleanupJob } from "./services/cleanup.js";
import { requestAidConversation } from "./conversations/requestAid.js";
import { registerStartHandler } from "./handlers/start.js";
import { registerStudentHandlers } from "./handlers/student.js";
import { registerAdminHandlers } from "./handlers/admin.js";
import { setupErrorHandler } from "./handlers/errors.js";
import { checkRateLimit } from "./utils/rateLimit.js";
import { InlineKeyboard } from "grammy";
import { strings } from "./locales.js";

// --- Bot setup ---
const bot = new Bot(process.env.BOT_TOKEN);

// Session middleware (stores language per user in memory — simple for now)
bot.use(session({
  initial: () => ({ language: "am" }),
}));

// Conversations middleware (must be before conversation registrations)
bot.use(conversations());

// Register the aid request conversation
bot.use(createConversation(requestAidConversation, "requestAid"));

// /cancel command works at any point
bot.command("cancel", async (ctx) => {
  const s = strings[ctx.session?.language || "am"];
  await ctx.conversation.exit();
  await ctx.reply(s.cancelled);
});

// Rate limit middleware for starting requests
bot.callbackQuery("start_request", async (ctx, next) => {
  const telegramId = String(ctx.from.id);
  const withinLimit = await checkRateLimit(telegramId);
  if (!withinLimit) {
    const s = strings[ctx.session?.language || "am"];
    await ctx.answerCallbackQuery();
    await ctx.reply(s.rateLimitExceeded);
    return;
  }
  await next();
});

// Register all handlers
registerStartHandler(bot);
registerStudentHandlers(bot);
registerAdminHandlers(bot);
setupErrorHandler(bot);

// Configure welcome descriptions displayed before pressing Start
async function configureBotDescriptions() {
  try {
    await bot.api.setMyDescription(
      "🌸 እንኳን ደህና መጡ ወደ PURE LOVE!\n\nPURE LOVE በጅማ ኢንስቲትዩት ኦፍ ቴክኖሎጂ ያለ የክርስቲያን ተማሪዎች የበጎ አድራጎት ቡድን ነው።\n\nልብስ፣ ጫማ፣ የግል ንጽህና፣ ሳኒተሪ እና የትምህርት መሳሪያዎች ድጋፍ እንሰጣለን።\n\nለመጀመር ከታች Start የሚለውን ይጫኑ።",
      { language_code: "am" }
    );
    await bot.api.setMyDescription(
      "🌸 Welcome to PURE LOVE!\n\nPURE LOVE is a Christian Students Charity Group at Jimma Institute of Technology (JIT).\n\nWe provide clothing, shoes, hygiene products, feminine sanitary items, and study supplies to students in need.\n\nPress START below to begin.",
      { language_code: "en" }
    );
    await bot.api.setMyDescription(
      "🌸 Welcome to PURE LOVE!\nPURE LOVE በጅማ ኢንስቲትዩት ኦፍ ቴክኖሎጂ ያለ የክርስቲያን ተማሪዎች የበጎ አድራጎት ቡድን ነው።\n\nPress START below to begin / ለመጀመር ከታች Start ይጫኑ።"
    );
    await bot.api.setMyShortDescription(
      "PURE LOVE — JIT Christian Students Charity Group"
    );
  } catch (err) {
    console.error("[Bot] Note: could not update Telegram description:", err.message);
  }
}
configureBotDescriptions();

// Start cleanup scheduler
startCleanupJob();

// --- Webhook or polling ---
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  // Webhook mode for production
  const app = express();
  app.use(express.json());

  // Health check endpoint for UptimeRobot / pingers
  app.get("/", (req, res) => res.send("🌸 PURE LOVE Bot is running!"));
  app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

  const webhookPath = `/webhook/${process.env.BOT_TOKEN}`;
  app.use(webhookPath, webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    console.log(`[Bot] Webhook server listening on port ${PORT}`);
    const baseUrl = (process.env.WEBHOOK_URL || "").replace(/\/+$/, "");
    if (baseUrl) {
      await bot.api.setWebhook(`${baseUrl}${webhookPath}`);
      console.log(`[Bot] Webhook set to ${baseUrl}${webhookPath}`);
    } else {
      console.warn("[Bot] Warning: WEBHOOK_URL not set.");
    }
  });
} else {
  // Long polling for development
  console.log("[Bot] Starting in development mode (long polling)...");
  bot.start();
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("[Bot] Shutting down...");
  await bot.stop();
  await disconnectDb();
  process.exit(0);
});
