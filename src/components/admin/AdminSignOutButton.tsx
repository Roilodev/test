"use client";

import { signOut } from "next-auth/react";

export default function AdminSignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-amber-200 hover:text-white text-sm transition-colors"
    >
      Sair
    </button>
  );
}
