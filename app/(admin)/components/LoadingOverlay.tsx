"use client";

import React from 'react';
import { useBodyScrollLock } from './useBodyScrollLock';
import LoadingSpinner from '@/components/LoadingSpinner';

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
      <div className="relative">
        <LoadingSpinner label={label} />
      </div>
    </div>
  );
}
