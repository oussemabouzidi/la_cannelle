import type { Metadata } from "next";
import "./globals.css";
import { ClientEnhancements } from "@/components/site/ClientEnhancements";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "la cannelle",
  description: "La Cannelle",
  icons: {
    icon: "/favicon.ico?v=2",
    apple: "/apple-icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          // Applies theme before paint to avoid flicker
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  try {
    const key = 'lacannelle-theme';
    const stored = localStorage.getItem(key);
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'dark' || stored === 'light' ? stored : (systemDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch {}
})();
            `.trim(),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <ClientEnhancements />
      </body>
    </html>
  );
}
