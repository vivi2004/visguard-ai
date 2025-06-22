import React from "react";
import { useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.svg";
import heroBg from "@/assets/background.jpg";
import chartLine from "@/assets/chart-line.svg";
import magnifyingGlass from "@/assets/magnifying-glass.svg";
import shieldCheck from "@/assets/shield-check.svg";
import linkedinLogo from "@/assets/linkedin-logo.svg";
import twitterLogo from "@/assets/twitter-logo.svg";
import { Button } from "@/components/ui/button";
import { ToggleTheme } from "@/components/toggle-theme";
import { BACKEND, ML_API } from "@/lib/api";

import "@/index.css";

const NAV_ITEMS = ["Product", "Solutions", "Pricing", "Resources"];

export default function MainLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-[Manrope,'Noto Sans',sans-serif] transition-colors duration-300">
            {/* Header */}
            <header className="flex flex-wrap justify-between items-center px-6 sm:px-10 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <img src={logoIcon} alt="VisGuard AI Logo" className="w-6 h-6" />
                    <h1 className="text-xl font-bold">VisGuard AI</h1>
                </div>
                <nav className="flex flex-wrap items-center gap-4 sm:gap-8">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="text-sm font-medium hover:text-[#0c77f2] dark:hover:text-blue-400"
                        >
                            {item}
                        </a>
                    ))}
                    <Button className="text-sm font-semibold" onClick={() => navigate("/login")}>
                        Get Started
                    </Button>
                    <ToggleTheme />
                </nav>
            </header>

            {/* Hero Section */}
            <section className="flex justify-center items-center px-4 py-12 sm:py-20">
                <div
                    className="w-full max-w-[850px] h-[360px] sm:h-[400px] rounded-3xl shadow-xl bg-cover bg-center flex flex-col items-center justify-center text-center px-6 sm:px-12"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${heroBg})`,
                    }}
                >
                    <h2 className="text-white text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-4">
                        AI-Powered Visual Analysis
                    </h2>
                    <p className="text-white text-sm sm:text-base max-w-xl mb-5">
                        VisGuard AI provides advanced visual analysis capabilities, enabling users to
                        extract valuable insights from images with unparalleled accuracy and
                        efficiency.
                    </p>
                    <Button
                        variant="secondary"
                        className="bg-[#0c77f2] hover:bg-[#095ec4] text-white"
                        onClick={() => navigate("/login")}
                    >
                        Get Started
                    </Button>
                </div>
            </section>

            {/* Features */}
            <section className="px-4 sm:px-20 py-16">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Key Features</h3>
                <p className="text-sm sm:text-base mb-10 max-w-2xl">
                    VisGuard AI offers a comprehensive suite of features designed to meet the
                    diverse needs of visual analysis.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            icon: magnifyingGlass,
                            title: "Advanced Object Detection",
                            desc: "Identify and classify objects within images with high precision.",
                        },
                        {
                            icon: chartLine,
                            title: "Real-time Analytics",
                            desc: "Gain immediate insights with real-time data processing and visualization.",
                        },
                        {
                            icon: shieldCheck,
                            title: "Robust Security",
                            desc: "Ensure data privacy and integrity with state-of-the-art security measures.",
                        },
                    ].map(({ icon, title, desc }) => (
                        <div
                            key={title}
                            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
                        >
                            <img src={icon} alt={title} className="w-6 h-6 mb-4" />
                            <h4 className="font-semibold text-lg mb-2">{title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white dark:bg-slate-900 py-16 text-center px-4">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    Ready to Transform Your Visual Data?
                </h3>
                <p className="text-base mb-6 max-w-xl mx-auto">
                    Start your free trial today and experience the power of VisGuard AI.
                </p>
                <Button size="lg" className="text-base font-semibold" onClick={() => navigate("/signup")}>
                    Get Started
                </Button>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10">
                <div className="text-center space-y-6">
                    <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        {[...NAV_ITEMS, "Contact Us"].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#0c77f2] dark:hover:text-blue-400"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                    <div className="flex justify-center gap-4">
                        <a href="https://x.com/VPurbey123" target="_blank" rel="noopener noreferrer">
                            <img src={twitterLogo} alt="Twitter" className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/vivek-kumar-p-3241a2259/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={linkedinLogo} alt="LinkedIn" className="w-5 h-5" />
                        </a>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        © 2025 VisGuard AI. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
