import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-800">{item.q}</span>
        <span
          className={`flex-shrink-0 text-primary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();
  const items = t("faq.items", { returnObjects: true });
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="section-padding bg-cream">
      <div className="container-max max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-10">
          {t("faq.title")}
        </h2>

        <div className="space-y-3">
          {items.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
