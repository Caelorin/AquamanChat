"use client";

import { useEffect, useState } from 'react';
import ChatLayout from '@/components/layout/ChatLayout';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // This ensures hydration issues are avoided
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20">
        <div className="container mx-auto px-4 py-8 h-screen">
          <ChatLayout />
        </div>
      </div>
    </ThemeProvider>
  );
}