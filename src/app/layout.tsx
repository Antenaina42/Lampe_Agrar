import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Lampe Agrar Finanzmanager | Finanzmanagement für moderne Landwirtschaft',
  description: 'Finanzmanagement, Deckungsbeiträge, Schweinemast, Ackerbau & Rechnungen für Lampe Agrar (Gesa & Dr. Josef Langenberg)',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#f8faf7] text-[#212921]">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
