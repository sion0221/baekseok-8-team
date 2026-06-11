'use client';

import { useEffect } from 'react';

export default function AuthLayout({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    root.classList.remove('dark');

    return () => {
      if (hadDark) root.classList.add('dark');
    };
  }, []);

  return <>{children}</>;
}
