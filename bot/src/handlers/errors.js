// Global error handler — never log PII (phone numbers, full names)
export function setupErrorHandler(bot) {
  bot.catch((err) => {
    const ctx = err.ctx;
    const userId = ctx?.from?.id || "unknown";
    console.error(`[Error] Update caused an error. User: ${userId}`);
    console.error(`[Error] Error type: ${err.error?.name || "Unknown"}`);
    console.error(`[Error] Message: ${err.error?.message || "No message"}`);
    // Do NOT log ctx.message, ctx.update, or any user data
  });
}
