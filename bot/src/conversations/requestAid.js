import { InlineKeyboard, Keyboard } from "grammy";
import { strings } from "../locales.js";
import { validateName, validatePhone } from "../utils/validation.js";
import { checkRateLimit } from "../utils/rateLimit.js";
import { generateRefCode } from "../utils/referenceCode.js";
import { getPrisma } from "../services/db.js";
import { getAdminIdForGender } from "../utils/adminRouter.js";

// Format the admin notification message
function formatAdminMessage(req, user, username) {
  const usernameDisplay = username ? `@${username}` : "N/A";
  return (
    `🆕 *New Aid Request*\n\n` +
    `🔖 Ref: *${req.refCode}*\n` +
    `👤 Name: ${req.firstName}\n` +
    `⚧ Gender: ${req.gender}\n` +
    `🌐 Language: ${user.language === "am" ? "አማርኛ" : "English"}\n` +
    `👤 Telegram: ${usernameDisplay}\n` +
    `📅 Date: ${new Date(req.createdAt).toLocaleDateString("en-ET")}\n\n` +
    `_Phone is stored securely — not shown here._`
  );
}

export async function requestAidConversation(conversation, ctx) {
  const lang = ctx.session?.language || "am";
  const s = strings[lang];

  // --- Consent ---
  const consentKeyboard = new InlineKeyboard()
    .text(s.consentYes, "consent_yes")
    .text(s.consentNo, "consent_no");

  await ctx.reply(s.consent, { reply_markup: consentKeyboard, parse_mode: "Markdown" });

  const consentCtx = await conversation.waitForCallbackQuery(["consent_yes", "consent_no"]);
  await consentCtx.answerCallbackQuery();

  if (consentCtx.callbackQuery.data === "consent_no") {
    await ctx.reply(s.consentDeclined);
    return;
  }

  // --- First Name ---
  await ctx.reply(s.askFirstName);
  let firstName = "";
  while (true) {
    const nameCtx = await conversation.waitFor("message:text");
    const input = nameCtx.message.text.trim();
    if (input.startsWith("/cancel")) {
      await ctx.reply(s.cancelled);
      return;
    }
    if (validateName(input)) {
      firstName = input;
      break;
    }
    await nameCtx.reply(s.nameError);
  }

  // --- Phone Number ---
  const phoneKeyboard = new Keyboard()
    .requestContact(s.sharePhone)
    .resized();

  await ctx.reply(s.askPhone, { reply_markup: phoneKeyboard });

  let phone = "";
  while (true) {
    const phoneCtx = await conversation.wait();
    // Handle /cancel
    if (phoneCtx.message?.text?.startsWith("/cancel")) {
      await ctx.reply(s.cancelled);
      return;
    }
    // Handle shared contact
    if (phoneCtx.message?.contact) {
      phone = phoneCtx.message.contact.phone_number;
      // Normalize: ensure it starts with + or 0
      if (!phone.startsWith("+") && !phone.startsWith("0")) {
        phone = "+" + phone;
      }
      break;
    }
    // Handle typed phone
    if (phoneCtx.message?.text) {
      const input = phoneCtx.message.text.trim();
      if (validatePhone(input)) {
        phone = input;
        break;
      }
      await phoneCtx.reply(s.phoneError);
    }
  }

  // --- Gender ---
  const genderKeyboard = new InlineKeyboard()
    .text(s.male, "gender_male")
    .text(s.female, "gender_female");

  await ctx.reply(s.askGender, { reply_markup: genderKeyboard });

  const genderCtx = await conversation.waitForCallbackQuery(["gender_male", "gender_female"]);
  await genderCtx.answerCallbackQuery();
  const isMale = genderCtx.callbackQuery.data === "gender_male";
  const gender = isMale
    ? (lang === "am" ? "ወንድ" : "Male")
    : (lang === "am" ? "ሴት" : "Female");

  // --- Save to DB ---
  await ctx.reply(s.submitting, { reply_markup: { remove_keyboard: true } });

  const prisma = getPrisma();
  const telegramId = String(ctx.from.id);

  // Rate limit check
  const withinLimit = await checkRateLimit(telegramId);
  if (!withinLimit) {
    await ctx.reply(s.rateLimitExceeded);
    return;
  }

  // Upsert user
  const dbUser = await prisma.user.upsert({
    where: { telegramId },
    update: { language: lang },
    create: { telegramId, language: lang },
  });

  // Determine target admin ID based on student gender
  const targetAdminId = getAdminIdForGender(gender);

  // Create request (phone stored securely, never logged)
  const dbRequest = await prisma.request.create({
    data: {
      refCode: "TEMP", // updated below with real code
      userId: dbUser.id,
      firstName,
      phone,
      gender,
      adminId: targetAdminId,
      status: "pending",
    },
  });

  // Generate real reference code
  const refCode = generateRefCode(dbRequest.id);
  const updatedRequest = await prisma.request.update({
    where: { id: dbRequest.id },
    data: { refCode },
  });

  // --- Notify matching admin ---
  const adminMsgIds = [];
  const adminMessage = formatAdminMessage(updatedRequest, dbUser, ctx.from.username);
  const adminKeyboard = new InlineKeyboard()
    .text("✅ Contacted", `status_contacted_${refCode}`)
    .text("📦 Ready", `status_ready_${refCode}`)
    .text("🎉 Done", `status_done_${refCode}`);

  let delivered = false;

  if (targetAdminId) {
    try {
      const sent = await ctx.api.sendMessage(targetAdminId, adminMessage, {
        parse_mode: "Markdown",
        reply_markup: adminKeyboard,
      });
      adminMsgIds.push(sent.message_id);
      delivered = true;
    } catch (err) {
      // Matching admin might not have pressed Start yet — catch and log without phone number
      console.error(`[Admin Delivery Error] Could not send request ${refCode} to admin (${targetAdminId}): ${err.message}`);
    }
  } else {
    console.error(`[Admin Routing Error] No admin ID configured for gender: ${gender}`);
  }

  // If matching admin could not receive it, set status to Undelivered
  if (!delivered) {
    await prisma.request.update({
      where: { id: updatedRequest.id },
      data: {
        status: "Undelivered",
        adminMsgIds: JSON.stringify(adminMsgIds),
      },
    });
  } else {
    await prisma.request.update({
      where: { id: updatedRequest.id },
      data: {
        adminMsgIds: JSON.stringify(adminMsgIds),
      },
    });
  }

  // --- Confirm to student (no code shown to student) ---
  await ctx.reply(s.requestSent(), { parse_mode: "Markdown" });
}
