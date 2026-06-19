"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    location.reload();
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#020617",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h1>Flow Academy AI</h1>
        <p>سجل الدخول للمتابعة</p>

        <button
          onClick={loginGoogle}
          style={{
            padding: "14px 30px",
            borderRadius: "12px",
            border: "none",
            background: "#14b8a6",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          تسجيل الدخول عبر Google
        </button>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>Flow Academy AI</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#0f172a",
          borderRadius: "16px",
        }}
      >
        <img
          src={user.user_metadata?.avatar_url}
          width={70}
          height={70}
          style={{ borderRadius: "50%" }}
          alt=""
        />

        <h2>{user.user_metadata?.full_name}</h2>
        <p>{user.email}</p>

        <button
          onClick={logout}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
          }}
        >
          تسجيل الخروج
        </button>
      </div>
    </main>
  );
}
