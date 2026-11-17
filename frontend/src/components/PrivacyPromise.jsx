import React from "react";
import { useTranslation } from "react-i18next";

export default function PrivacyPromise() {
  const { t } = useTranslation();
  const points = t("privacy.points", { returnObjects: true });

  return (
    <section id="privacy" className="section-padding bg-white">
      <div className="container-max max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">{t("privacy.title")}</h2>
        </div>

        <div className="space-y-4">
          {points.map((point, i) => (
            <div key={i} className="flex items-start gap-4 card">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                ✓
              </div>
              <p className="text-gray-700 leading-relaxed pt-0.5">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
