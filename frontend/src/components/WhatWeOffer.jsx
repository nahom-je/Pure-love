import React from "react";
import { useTranslation } from "react-i18next";

const ITEMS = [
  { key: "clothing", emoji: "👕" },
  { key: "shoes", emoji: "👟" },
  { key: "hygiene", emoji: "🧴" },
  { key: "sanitary", emoji: "🩺" },
  { key: "study", emoji: "📚" },
];

export default function WhatWeOffer() {
  const { t } = useTranslation();

  return (
    <section id="offer" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">{t("offer.title")}</h2>
          <p className="text-gray-500 text-lg">{t("offer.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {ITEMS.map((item) => (
            <div key={item.key} className="card text-center hover:shadow-md transition-shadow duration-200">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-semibold text-primary text-sm sm:text-base mb-1">
                {t(`offer.items.${item.key}.title`)}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm">{t(`offer.items.${item.key}.desc`)}</p>
            </div>
          ))}
        </div>

        {/* No financial aid warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-amber-800 font-semibold">{t("offer.noFinancial")}</p>
        </div>
      </div>
    </section>
  );
}
