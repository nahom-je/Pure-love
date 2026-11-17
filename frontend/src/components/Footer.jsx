import React from "react";
import { useTranslation } from "react-i18next";
import { TELEGRAM_BOT_LINK } from "../config.js";

export default function Footer() {
  const { t, i18n } = useTranslation();

  const switchLang = (lang) => i18n.changeLanguage(lang);

  return (
    <footer className="bg-primary text-white section-padding">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 text-xl font-bold mb-3">
              <img src="/logo.png" alt="PURE LOVE Logo" className="h-8 w-auto object-contain rounded" />
              <span>PURE LOVE</span>
            </div>
            <p className="text-white/70 text-sm">{t("footer.group")}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3 text-white/90">Quick Links</h3>
            <div className="space-y-2">
              {[
                { href: "#offer", label: t("nav.offer") },
                { href: "#donate", label: t("nav.donate") },
                { href: "#faq", label: t("nav.faq") },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-white/60 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact + Language */}
          <div>
            <h3 className="font-semibold mb-3 text-white/90">Contact</h3>
            <a
              href={TELEGRAM_BOT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors mb-4"
              aria-label="Open Telegram Bot"
            >
              <span>✈️</span>
              {t("common.openBot")}
            </a>

            {/* Language switcher */}
            <div className="flex gap-2 mt-3">
              {["am", "en"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => switchLang(lang)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    i18n.language === lang
                      ? "bg-white text-primary"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  aria-label={lang === "am" ? "Switch to Amharic" : "Switch to English"}
                >
                  {lang === "am" ? "አማ" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-white/50 text-sm">
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
