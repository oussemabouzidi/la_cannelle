"use client";

import type { Language } from '@/lib/hooks/useTranslation';

type AdminLanguageToggleProps = {
  language: Language;
  onToggle: () => void;
};

export default function AdminLanguageToggle({ language, onToggle }: AdminLanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="px-3 py-2 text-sm border border-amber-300 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300 flex items-center gap-2"
      type="button"
    >
      {language === 'EN' ? (
        <>
          <span className="text-lg">
            <img
              src="/images/language/Flag_of_United_Kingdom-4096x2048.png"
              width={22}
              alt="English"
            />
          </span>
          English
        </>
      ) : (
        <>
          <span className="text-lg">
            <img
              src="/images/language/Flag_of_Germany-4096x2453.png"
              width={20}
              alt="Deutsch"
            />
          </span>
          Deutsch
        </>
      )}
    </button>
  );
}
