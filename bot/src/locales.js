// src/locales.js — all bot text in Amharic (am) and English (en)
export const strings = {
  am: {
    chooseLanguage: "🌐 እባክዎ ቋንቋ ይምረጡ\nPlease choose your language:",
    welcome: `🌸 እንኳን ደህና መጡ ወደ PURE LOVE!

PURE LOVE በጅማ ኢንስቲትዩት ኦፍ ቴክኖሎጂ ያለ የክርስቲያን ተማሪዎች የበጎ አድራጎት ቡድን ነው።

እኛ የምንሰጠው ድጋፍ:
👕 ልብስ
👟 ጫማ
🧴 የግል ንጽህና ምርቶች
🩺 ለሴቶች የሚሆን ሳኒተሪ ምርቶች
📚 የትምህርት መሳሪያዎች

⚠️ ቀጥተኛ የገንዘብ ድጋፍ አንሰጥም።

ለጥያቄ ወይም ድጋፍ ከታች ያለውን ቁልፍ ይጫኑ።`,
    contactUs: "📩 አግኙን",
    consent: `🔒 ወደፊት ከቀጠሉ፣ ስምዎ፣ ስልክ ቁጥርዎ እና ፆታዎ ይሰበሰባሉ። ይህ መረጃ ለ PURE LOVE አስተዳዳሪ ብቻ ይታያል። ለሌሎች ሰዎች አይሰጥም።

ይስማሙ?`,
    consentYes: "✅ እስማማለሁ",
    consentNo: "❌ አልፈልግም",
    consentDeclined: "ሂደቱ ተቋርጧል። ስትፈልግ /start ብለህ ተመለስ።",
    askFirstName: "📝 እባክዎ የመጀመሪያ ስምዎን ያስገቡ:",
    nameError: "⚠️ ስም ትክክለኛ አይደለም። ቢያንስ 2 ቁምፊ፣ ቢበዛ 50 ቁምፊ ያስገቡ።",
    askPhone: "📞 ስልክ ቁጥርዎን ያስገቡ (ምሳሌ: 09XXXXXXXX) ወይም ከታች ያለውን ቁልፍ ይጫኑ:",
    sharePhone: "📱 ስልክ ቁጥሬን አጋራ",
    phoneError: "⚠️ ስልክ ቁጥሩ ትክክለኛ አይደለም። እባክዎ የኢትዮጵያ ቁጥር ያስገቡ።",
    askGender: "👤 ፆታዎን ይምረጡ:",
    male: "ወንድ",
    female: "ሴት",
    submitting: "⏳ ጥያቄዎ እየተላከ ነው...",
    requestSent: () => `✅ ጥያቄዎ በተሳካ ሁኔታ ደርሷል!\n\nየ PURE LOVE ቡድን በቅርቡ በግል ያነጋግርዎታል። እናመሰግናለን! 🌸`,
    rateLimitExceeded: "⚠️ ዛሬ ቀን 3 ጊዜ ጥያቄ ልኳል። እባክዎ ነገ ይሞክሩ።",
    cancelled: "❌ ሂደቱ ተቋርጧል። /start ብለህ ተመለስ።",
    statusNotFound: "⚠️ ምንም ጥያቄ አልተገኘም።",
    statusMsg: (req) => {
      const statusText = { pending: "⏳ በመጠባበቅ", Undelivered: "⏳ በመጠባበቅ", contacted: "📞 ተደርሶዎታል", ready: "✅ ዝግጁ", done: "🎉 ተጠናቋል" };
      return `📋 የጥያቄዎ ሁኔታ\n\n📅 ቀን: ${new Date(req.createdAt).toLocaleDateString("am-ET")}\n🔄 ሁኔታ: ${statusText[req.status] || req.status}`;
    },
    statusContacted: "📞 የ PURE LOVE ቡድን ያነጋገርዎታል። እባክዎ ያስተባብሩ።",
    statusReady: "✅ ድጋፍዎ ዝግጁ ነው! PURE LOVE ቡድን ዝርዝሩን ያሳውቅዎታል።",
    statusDone: "🎉 ድጋፉ ተጠናቋል። ፕዩር ለቭ ቡድንን አመሰግናለሁ!",
    languageChanged: "✅ ቋንቋ ወደ አማርኛ ተቀይሯል።",
  },
  en: {
    chooseLanguage: "🌐 Please choose your language:\nእባክዎ ቋንቋ ይምረጡ",
    welcome: `🌸 Welcome to PURE LOVE!

PURE LOVE is a Christian Students Charity Group at Jimma Institute of Technology, Ethiopia.

What we provide:
👕 Clothing
👟 Shoes
🧴 Personal hygiene products
🩺 Feminine sanitary items
📚 Study supplies

⚠️ We do NOT provide direct financial aid.

Press the button below to request support.`,
    contactUs: "📩 Contact Us",
    consent: `🔒 By continuing, your first name, phone number, and gender will be collected. This information is seen only by the PURE LOVE admin and will never be shared publicly.\n\nDo you agree?`,
    consentYes: "✅ I Agree",
    consentNo: "❌ No Thanks",
    consentDeclined: "Process cancelled. Type /start to return.",
    askFirstName: "📝 Please enter your first name:",
    nameError: "⚠️ Invalid name. Please enter between 2 and 50 characters.",
    askPhone: "📞 Enter your phone number (e.g. 09XXXXXXXX) or press the button below:",
    sharePhone: "📱 Share My Phone Number",
    phoneError: "⚠️ Invalid phone number. Please enter an Ethiopian number (09XXXXXXXX or 07XXXXXXXX).",
    askGender: "👤 Please select your gender:",
    male: "Male (ወንድ)",
    female: "Female (ሴት)",
    submitting: "⏳ Submitting your request...",
    requestSent: () => `✅ Your request has been submitted successfully!\n\nThe PURE LOVE team will contact you privately soon. Thank you! 🌸`,
    rateLimitExceeded: "⚠️ You have already submitted 3 requests today. Please try again tomorrow.",
    cancelled: "❌ Process cancelled. Type /start to return.",
    statusNotFound: "⚠️ No request found.",
    statusMsg: (req) => {
      const statusText = { pending: "⏳ Pending", Undelivered: "⏳ Pending", contacted: "📞 Contacted", ready: "✅ Ready", done: "🎉 Done" };
      return `📋 Request Status\n\n📅 Date: ${new Date(req.createdAt).toLocaleDateString("en-ET")}\n🔄 Status: ${statusText[req.status] || req.status}`;
    },
    statusContacted: "📞 The PURE LOVE team has reached out to you. Please coordinate with them.",
    statusReady: "✅ Your support is ready! The PURE LOVE team will notify you with details.",
    statusDone: "🎉 Your support has been delivered. Thank you for reaching out to PURE LOVE!",
    languageChanged: "✅ Language changed to English.",
  }
};
