"use client";

import { useTheme } from "./theme-provider";
import { Button } from "@heroui/react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-background transition-colors duration-300">
      <div className="text-center max-w-xl p-8 rounded-2xl bg-card-bg border border-border-accent shadow-lg">
        <h1 className="font-display text-4xl font-extrabold tracking-tight mb-4 text-brand-primary-600 dark:text-brand-primary-400">
          NextMart Storefront
        </h1>
        <p className="font-sans text-sm text-foreground/80 mb-6">
          Premium single-owner e-commerce catalog featuring curated gadgets, sunglasses, watches, and portable devices.
        </p>
        
        <Button
          variant="secondary"
          onPress={toggleTheme}
          className="font-sans font-medium rounded-xl flex items-center justify-center gap-2 mx-auto"
        >
          {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
          <span>Toggle {theme === "light" ? "Dark" : "Light"} Mode</span>
        </Button>
      </div>
    </main>
  );
}
