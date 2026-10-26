'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { OpeningAnimation } from './OpeningAnimation';
import { QuickBookingModal } from './QuickBookingModal';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [quickBookingOpen, setQuickBookingOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    roleDisplayName: string;
  } | undefined>(undefined);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
            roleDisplayName: data.user.roleDisplayName,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen bg-[#f8faf7] text-[#212921] font-sans antialiased overflow-hidden">
      <OpeningAnimation />
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          onNewBookingClick={() => setQuickBookingOpen(true)}
          currentUser={user}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>

      <QuickBookingModal
        isOpen={quickBookingOpen}
        onClose={() => setQuickBookingOpen(false)}
        onSuccess={() => {
          // Trigger a soft refresh across active views
          window.dispatchEvent(new CustomEvent('lampe_booking_created'));
        }}
      />
    </div>
  );
}
