import React from "react";
import { useTranslation } from "react-i18next";
import { VOLUNTEER_CONTACT_LINK, DONATE_ITEMS_CONTACT_LINK } from "../config.js";

export default function GetInvolved() {
  const { t } = useTranslation();

  const cards = [
    { key: "volunteer", emoji: "🤝" },
    { key: "donate", emoji: "🎁" },
    { key: "dropoff", emoji: "📍" },
  ];

  return (
    <section id="involved" className="section-padding bg-white">
      <div className="container-max">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-12">
          {t("getInvolved.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.key} className="card text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{card.emoji}</div>
              <h3 className="font-bold text-primary text-xl mb-2">
                {t(`getInvolved.${card.key}.title`)}
              </h3>
              <p className="text-gray-500 mb-4">{t(`getInvolved.${card.key}.desc`)}</p>
              {card.key !== "dropoff" && (
                <a
                  href={card.key === "volunteer" ? VOLUNTEER_CONTACT_LINK : DONATE_ITEMS_CONTACT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm px-4 py-2"
                >
                  ✈️ {t("common.contactTelegram")}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
