"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useBodyScrollLock } from './useBodyScrollLock';

type LoadingOverlayProps = {
  open: boolean;
  label?: string;
};

export default function LoadingOverlay({ open, label = 'Loading...' }: LoadingOverlayProps) {
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-100 px-6 py-5 flex items-center gap-4">
        <div className="shrink-0 w-11 h-11 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-amber-700 animate-spin" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">{label}</div>
        </div>
      </div>
    </div>
  );
}
