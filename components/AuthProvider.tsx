"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import AuthModal from "@/components/AuthModal";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      {children}
      <AuthModal />
    </>
  );
}
