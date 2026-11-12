"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { GoogleIcon, Logo } from "@/components/icons";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  return (
    <main className="adm-login">
      <div className="rg-card">
        <Logo className="logo" eager />
        <h1 style={{ fontSize: 24, marginTop: 18 }}>Admin</h1>
        <p className="lead">Sign in with an admin Google account.</p>
        <button
          className="gbtn"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/admin" });
            if (error) setLoading(false);
          }}
        >
          <GoogleIcon />{loading ? "…" : "Continue with Google"}
        </button>
      </div>
    </main>
  );
}

export function SignOutButton() {
  return (
    <button className="btn btn-line btn-sm" onClick={async () => { await authClient.signOut(); location.href = "/"; }}>
      Sign out
    </button>
  );
}
