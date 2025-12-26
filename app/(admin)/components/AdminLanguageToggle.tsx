"use client";

import type { Language } from '@/lib/hooks/useTranslation';
import { useState } from 'react';

type AdminLanguageToggleProps = {
  language: Language;
  onToggle: () => void;
};

export default function AdminLanguageToggle({ language, onToggle }: AdminLanguageToggleProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  return (
    <div className="flex items-center gap-2">
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

      <button
        type="button"
        disabled={loggingOut}
        onClick={async () => {
          try {
            setLoggingOut(true);
            await fetch('/api/admin/logout', { method: 'POST' });
          } finally {
            window.location.href = '/login';
          }
        }}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}
