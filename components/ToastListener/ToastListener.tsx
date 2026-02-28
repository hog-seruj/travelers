'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const messages: Record<string, string> = {
  login_success: 'З поверненням! Раді вас знову бачити!',
  register_success: 'Ви приєдналися до мандрівників',
};

export default function ToastListener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const toastKey = searchParams.get('toast');
  const shownRef = useRef<string | null>(null);

  useEffect(() => {
    if (!toastKey) {
      shownRef.current = null;
      return;
    }

    if (shownRef.current === toastKey) return;
    shownRef.current = toastKey;

    const message = messages[toastKey];
    if (message) toast.success(message);

    const next = new URLSearchParams(searchParams.toString());
    next.delete('toast');

    router.replace(next.toString() ? `${pathname}?${next}` : pathname);
  }, [toastKey, pathname, router, searchParams]);

  return null;
}
