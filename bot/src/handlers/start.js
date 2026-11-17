import { InlineKeyboard } from "grammy";
import { strings } from "../locales.js";

// /start command: user already saw the Welcome & Logo on the pre-start screen,
// so directly prompt for language to start the intake flow.
export function registerStartHandler(bot) {
  bot.command("start", async (ctx) => {
    const keyboard = new InlineKeyboard()
      .text("🇪🇹 አማርኛ", "lang_am")
      .text("🇬🇧 English", "lang_en");

    await ctx.reply(strings.am.chooseLanguage, { reply_markup: keyboard });
  });

  // Once language is chosen, immediately proceed to the intake conversation (Consent -> Name -> Phone -> Gender)
  bot.callbackQuery("lang_am", async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.session.language = "am";
    await ctx.conversation.enter("requestAid");
  });

  bot.callbackQuery("lang_en", async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.session.language = "en";
    await ctx.conversation.enter("requestAid");
  });

  bot.callbackQuery("start_request", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter("requestAid");
  });
}
