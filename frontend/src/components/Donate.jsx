import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DONATION_METHODS, DONATE_ITEMS_CONTACT_LINK } from "../config.js";

function DonationCard({ method }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(method.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = method.accountNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const colorClass =
    method.color === "blue"
      ? "bg-blue-50 border-blue-200 text-blue-700"
      : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{method.icon}</span>
        <div>
          <h3 className="font-bold text-primary text-lg">{method.name}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}>
            {method.shortName}
          </span>
        </div>
      </div>

      {/* Account Holder */}
      <div className="mb-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t("donate.accountHolder")}</p>
        <p className="font-semibold text-gray-800">{method.accountHolder}</p>
      </div>

      {/* Account Number */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t("donate.accountNumber")}</p>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
          <code className="font-mono text-lg font-bold text-primary flex-1 select-all">
            {method.accountNumber}
          </code>
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              copied
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-primary text-white hover:bg-primary-dark active:scale-95"
            }`}
            aria-label={`Copy ${method.name} account number`}
          >
            {copied ? t("donate.copied") : t("donate.copyButton")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Donate() {
  const { t } = useTranslation();

  return (
    <section id="donate" className="section-padding bg-cream">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">{t("donate.title")}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t("donate.subtitle")}</p>
        </div>

        {/* How donations are used */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8 max-w-2xl mx-auto text-center">
          <h3 className="font-semibold text-primary mb-2">{t("donate.howUsed")}</h3>
          <p className="text-gray-600">{t("donate.howUsedText")}</p>
        </div>

        {/* Donation cards */}
        <div className={`mb-8 ${DONATION_METHODS.length === 1 ? "max-w-xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-6"}`}>
          {DONATION_METHODS.map((method) => (
            <DonationCard key={method.id} method={method} />
          ))}
        </div>

        {/* Item donations */}
        <div className="card text-center max-w-xl mx-auto bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="text-3xl mb-3">📦</div>
          <h3 className="font-bold text-primary text-xl mb-2">{t("donate.itemDonation")}</h3>
          <p className="text-gray-600 mb-4">{t("donate.itemDonationText")}</p>
          <a
            href={DONATE_ITEMS_CONTACT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            <span>✈️</span>
            {t("donate.contactTelegram")}
          </a>
        </div>
      </div>
    </section>
  );
}
