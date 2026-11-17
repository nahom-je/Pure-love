import { getPrisma } from "../services/db.js";
import { strings } from "../locales.js";
import { InlineKeyboard } from "grammy";
import { createWriteStream } from "fs";
import { unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { getAdminGenderRole, isAdmin, getAdminIdForGender } from "../utils/adminRouter.js";

/**
 * Helper to build Prisma gender filter based on admin role.
 * Male admin -> male requests ("Male", "ወንድ", "male")
 * Female admin -> female requests ("Female", "ሴት", "female")
 */
function getGenderFilterForAdmin(adminId) {
  const role = getAdminGenderRole(adminId);
  if (role === "male") {
    return { in: ["Male", "ወንድ", "male"] };
  }
  if (role === "female") {
    return { in: ["Female", "ሴት", "female"] };
  }
  return null;
}

export function registerAdminHandlers(bot) {
  // /pending — show open requests for this admin's group (pending or Undelivered)
  bot.command("pending", async (ctx) => {
    const genderFilter = getGenderFilterForAdmin(ctx.from?.id);
    if (!genderFilter) return;

    const prisma = getPrisma();
    const requests = await prisma.request.findMany({
      where: {
        status: { in: ["pending", "Undelivered"] },
        gender: genderFilter,
      },
      include: { user: true },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const role = getAdminGenderRole(ctx.from?.id);
    const roleTitle = role === "male" ? "Male Students" : "Female Students";

    if (requests.length === 0) {
      await ctx.reply(`✅ No pending requests for ${roleTitle}.`);
      return;
    }

    const lines = requests.map((r) =>
      `🔖 *${r.refCode}* — ${r.firstName} [${r.status}] — ${new Date(r.createdAt).toLocaleDateString("en-ET")}`
    );
    await ctx.reply(`📋 *Pending Requests (${roleTitle} - ${requests.length})*\n\n${lines.join("\n")}`, { parse_mode: "Markdown" });
  });

  // /stats — counts by status for this admin's group
  bot.command("stats", async (ctx) => {
    const genderFilter = getGenderFilterForAdmin(ctx.from?.id);
    if (!genderFilter) return;

    const prisma = getPrisma();
    const statuses = ["pending", "contacted", "ready", "done", "Undelivered"];
    const counts = await Promise.all(
      statuses.map((s) => prisma.request.count({ where: { status: s, gender: genderFilter } }))
    );
    const total = await prisma.request.count({ where: { gender: genderFilter } });
    const role = getAdminGenderRole(ctx.from?.id);
    const roleTitle = role === "male" ? "Male Group" : "Female Group";

    const lines = statuses.map((s, i) => `• ${s}: ${counts[i]}`);
    await ctx.reply(`📊 *Request Statistics (${roleTitle})*\n\n${lines.join("\n")}\n\n*Total: ${total}*`, { parse_mode: "Markdown" });
  });

  // /export — CSV file of all requests for this admin's group
  bot.command("export", async (ctx) => {
    const genderFilter = getGenderFilterForAdmin(ctx.from?.id);
    if (!genderFilter) return;

    const prisma = getPrisma();
    const requests = await prisma.request.findMany({
      where: { gender: genderFilter },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const role = getAdminGenderRole(ctx.from?.id);
    const csvPath = join(tmpdir(), `pure-love-export-${role}-${Date.now()}.csv`);
    const rows = [
      "RefCode,FirstName,Phone,Gender,Language,Status,AdminId,TelegramId,Date",
      ...requests.map((r) =>
        [
          r.refCode,
          `"${r.firstName.replace(/"/g, '""')}"`,
          r.phone,
          r.gender,
          r.user?.language || "am",
          r.status,
          r.adminId || "",
          r.user?.telegramId || "",
          new Date(r.createdAt).toISOString(),
        ].join(",")
      ),
    ];

    await new Promise((resolve, reject) => {
      const stream = createWriteStream(csvPath);
      stream.write(rows.join("\n"), "utf8", (err) => {
        if (err) reject(err);
        else {
          stream.end();
          stream.on("finish", resolve);
        }
      });
    });

    await ctx.replyWithDocument({
      source: csvPath,
      filename: `pure-love-${role}-requests-${new Date().toISOString().split("T")[0]}.csv`,
    });
    await unlink(csvPath);
  });

  // Inline button callbacks: status_contacted_PL-XXXX, status_ready_PL-XXXX, status_done_PL-XXXX
  bot.callbackQuery(/^status_(contacted|ready|done)_(.+)$/, async (ctx) => {
    if (!isAdmin(ctx)) {
      await ctx.answerCallbackQuery("Not authorized.");
      return;
    }

    const newStatus = ctx.match[1]; // contacted, ready, done
    const refCode = ctx.match[2];

    const prisma = getPrisma();
    const request = await prisma.request.findUnique({
      where: { refCode },
      include: { user: true },
    });

    if (!request) {
      await ctx.answerCallbackQuery("Request not found.");
      return;
    }

    // Ensure the admin modifying this request handles this gender group
    const assignedAdminId = getAdminIdForGender(request.gender);
    if (assignedAdminId && String(ctx.from?.id) !== String(assignedAdminId)) {
      await ctx.answerCallbackQuery("Not authorized for this student group.");
      return;
    }

    await prisma.request.update({
      where: { refCode },
      data: { status: newStatus },
    });

    await ctx.answerCallbackQuery(`✅ Status updated to: ${newStatus}`);

    // Edit the admin message to show current status
    try {
      const statusEmoji = { contacted: "📞", ready: "📦", done: "🎉" };
      await ctx.editMessageText(
        ctx.callbackQuery.message.text + `\n\n${statusEmoji[newStatus]} *Status: ${newStatus.toUpperCase()}*`,
        { parse_mode: "Markdown" }
      );
    } catch (_) {
      // Ignore if editing message fails (e.g. content identical)
    }

    // Notify the student in their preferred language
    const lang = request.user?.language || "am";
    const s = strings[lang] || strings.am;
    const studentMsg =
      newStatus === "contacted"
        ? s.statusContacted
        : newStatus === "ready"
        ? s.statusReady
        : s.statusDone;

    try {
      await ctx.api.sendMessage(request.user.telegramId, studentMsg);
    } catch (err) {
      // Catch and log without logging phone number or PII
      console.error(`[Admin] Could not notify student for request ${refCode}: ${err.message}`);
    }
  });
}
