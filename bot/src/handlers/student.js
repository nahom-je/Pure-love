import { InlineKeyboard } from "grammy";
import { strings } from "../locales.js";
import { getPrisma } from "../services/db.js";

export function registerStudentHandlers(bot) {
  // /status — student can check their request status directly
  bot.command("status", async (ctx) => {
    const s = strings[ctx.session?.language || "am"];
    const prisma = getPrisma();
    const args = ctx.match?.trim();

    let request = null;
    if (args) {
      request = await prisma.request.findUnique({ where: { refCode: args.toUpperCase() } });
    } else {
      const telegramId = String(ctx.from?.id);
      const user = await prisma.user.findUnique({ where: { telegramId } });
      if (user) {
        request = await prisma.request.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        });
      }
    }

    if (!request) {
      await ctx.reply(s.statusNotFound);
      return;
    }

    await ctx.reply(s.statusMsg(request), { parse_mode: "Markdown" });
  });

  // /volunteer & /donate — direct contact for item donations or volunteering
  bot.command(["volunteer", "donate"], async (ctx) => {
    const keyboard = new InlineKeyboard().url("📩 Contact Coordinator (@sam_denke)", "https://t.me/sam_denke");
    await ctx.reply(
      "🤝 To donate physical items or volunteer with PURE LOVE, please contact our coordinator:\n\nቁሳቁስ ለመለገስ ወይም በበጎ ፈቃደኝነት ለመሳተፍ እባክዎ አስተባባሪውን ያነጋግሩ: @sam_denke",
      { reply_markup: keyboard }
    );
  });

  // /language — show language picker again
  bot.command("language", async (ctx) => {
    const keyboard = new InlineKeyboard()
      .text("🇪🇹 አማርኛ", "lang_am")
      .text("🇬🇧 English", "lang_en");
    await ctx.reply(strings.am.chooseLanguage, { reply_markup: keyboard });
  });
}
