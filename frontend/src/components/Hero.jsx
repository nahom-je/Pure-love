import React from "react";
import { useTranslation } from "react-i18next";
import { TELEGRAM_BOT_LINK } from "../config.js";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="pt-24 pb-16 section-padding bg-cream min-h-screen flex items-center">
      <div className="container-max w-full text-center">
        {/* Decorative circles */}
        <div className="relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-6 shadow-sm">
          <span className="w-2 h-2 bg-accent rounded-full inline-block"></span>
          {t("hero.badge")}
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary mb-4 leading-tight">
          {t("hero.title")}
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-6 max-w-2xl mx-auto">
          {t("hero.subtitle")}
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          {t("hero.description")}
        </p>

        {/* CTA */}
        <a
          href={TELEGRAM_BOT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl"
        >
          <span className="mr-2">✈️</span>
          {t("hero.cta")}
        </a>

        {/* Scroll hint */}
        <div className="mt-16 flex justify-center">
          <div className="animate-bounce text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
