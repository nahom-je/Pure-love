import React from "react";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import WhatWeOffer from "../components/WhatWeOffer.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import PrivacyPromise from "../components/PrivacyPromise.jsx";
import Donate from "../components/Donate.jsx";
import GetInvolved from "../components/GetInvolved.jsx";
import FAQ from "../components/FAQ.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhatWeOffer />
        <HowItWorks />
        <PrivacyPromise />
        <Donate />
        <GetInvolved />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
