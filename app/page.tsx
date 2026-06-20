"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  UploadCloud,
  Brain,
  BarChart3,
  Activity,
  User,
  Home,
  GraduationCap,
  Radio,
  LogOut,
  Crown,
} from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [tab, setTab] = useState("home");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("نتيجة التحليل تظهر هنا.");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoadingAuth(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult("تم رفع الصورة. اضغط حلل الآن.");
  }

  async function analyze() {
    if (!file) return setResult("ارفع صورة الشارت أولاً.");
    setLoading(true);
    setResult("جاري قراءة الشارت وتحليل ICT...");

    const data = new FormData();
    data.append("image", file);
    data.append("user_id", user.id);
    
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: data });
      const json = await res.json();
      setResult(json.analysis || "لم تصل نتيجة تحليل.");
    } catch {
      setResult("حدث خطأ أثناء التحليل.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingAuth) {
    return <main className="phone">جاري التحميل...</main>;
  }

  if (!user) {
    return (
      <main className="phone" style={{ display: "grid", placeItems: "center" }}>
        <section className="card" style={{ textAlign: "center", width: "100%" }}>
          <div className="logo" style={{ margin: "0 auto 16px" }}>F</div>
          <h1>Flow Academy AI</h1>
          <p className="sub">سجل الدخول للمتابعة</p>
          <button className="btn" onClick={loginGoogle}>
            تسجيل الدخول عبر Google
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="phone">
      <header className="top">
        <div className="brand">
          <div className="logo">F</div>
          <div>
            <h1>Flow Academy AI</h1>
            <p className="sub">محلل ICT عربي</p>
          </div>
        </div>
        <div className="pill">Free</div>
      </header>

      {tab === "home" && (
        <>
          <section className="hero">
            <small>مرحباً بك</small>
            <h2>ماذا تريد اليوم؟</h2>
            <div className="ai-box">
              تحليل سكالب وسوينغ، إشارات، مستشار، وأكاديمية تعليمية بمنهج ICT و CRT.
            </div>
          </section>

          <section className="grid">
            <div className="mini"><b>سكالب</b><span>15M + 5M + 1M</span></div>
            <div className="mini"><b>سوينغ</b><span>D1 + H4 + H1</span></div>
          </section>

          <section className="card">
            <div className="card-title">
              <div className="icon"><UploadCloud size={23} /></div>
              <h3>تحليل الشارت</h3>
            </div>

            <label className="upload">
              <input type="file" accept="image/*" onChange={onFile} />
              <div>
                <UploadCloud size={34} />
                <p>اضغط هنا لرفع صورة الشارت</p>
              </div>
            </label>

            {preview && (
              <img className="preview" src={preview} style={{ display: "block" }} alt="chart" />
            )}

            <button className="btn" onClick={analyze} disabled={loading}>
              {loading ? "جاري التحليل..." : "حلل الآن"}
            </button>

            <div className={`result ${result === "نتيجة التحليل تظهر هنا." ? "empty" : ""}`}>
              {result}
            </div>
          </section>
        </>
      )}

      {tab === "advisor" && (
        <section className="card">
          <div className="card-title">
            <div className="icon"><Brain size={23} /></div>
            <h3>المستشار</h3>
          </div>
          <label className="upload"><input type="file" accept="image/*" />ارفع صورة الشارت</label>
          <label className="upload" style={{ marginTop: 12 }}><input type="file" accept="image/*" />ارفع صورة الحساب والهامش</label>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="مثال: هل أثبت الصفقة؟ هل أحرك الستوب؟" />
          <button className="btn">اسأل المستشار</button>
        </section>
      )}

    {tab === "signals" && (
  <section className="card">
    <div className="card-title">
      <div className="icon">
        <Radio size={23} />
      </div>
      <h3>الإشارات</h3>
    </div>

    <div
      style={{
        background: "#0f172a",
        borderRadius: "18px",
        padding: "16px",
        marginBottom: "12px",
        border: "1px solid #1e293b",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ color: "#22c55e" }}>XAUUSD BUY</h3>
        <span
          style={{
            background: "#14532d",
            color: "#22c55e",
            padding: "4px 10px",
            borderRadius: "10px",
            fontSize: "12px",
          }}
        >
          نشطة
        </span>
      </div>

      <div style={{ marginTop: "12px" }}>
        <p>الدخول: 4148</p>
        <p>وقف الخسارة: 4134</p>
        <p>TP1: 4152</p>
        <p>TP2: 4156</p>
        <p>TP3: 4160</p>
      </div>
    </div>

    <div
      style={{
        background: "#0f172a",
        borderRadius: "18px",
        padding: "16px",
        border: "1px solid #1e293b",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ color: "#ef4444" }}>GBPUSD SELL</h3>
        <span
          style={{
            background: "#7f1d1d",
            color: "#f87171",
            padding: "4px 10px",
            borderRadius: "10px",
            fontSize: "12px",
          }}
        >
          مغلقة
        </span>
      </div>

      <div style={{ marginTop: "12px" }}>
        <p>الدخول: 1.3560</p>
        <p>وقف الخسارة: 1.3600</p>
        <p>TP1: 1.3520</p>
        <p>TP2: 1.3480</p>
        <p>TP3: 1.3440</p>
      </div>
    </div>
  </section>
)}

      {tab === "performance" && (
        <section className="card">
          <div className="card-title">
            <div className="icon"><Activity size={23} /></div>
            <h3>الأداء</h3>
          </div>
          <div className="grid">
            <div className="mini"><b>79%</b><span>دقة الأداء</span></div>
            <div className="mini"><b>0</b><span>تحليلاتك</span></div>
          </div>
        </section>
      )}

      {tab === "academy" && (
        <section className="card">
          <div className="card-title">
            <div className="icon"><GraduationCap size={23} /></div>
            <h3>الأكاديمية</h3>
          </div>
          <div className="feature">الأخبار الاقتصادية</div>
          <div className="feature">المقالات الاقتصادية</div>
          <div className="feature">التحليل اليومي</div>
          <div className="feature">دروس ICT و CRT</div>
          <div className="feature">الويبينارات</div>
        </section>
      )}

      {tab === "profile" && (
        <section className="card">
          <div className="card-title">
            <div className="icon"><User size={23} /></div>
            <h3>ملفي الشخصي</h3>
          </div>
          <p>{user.user_metadata?.full_name}</p>
          <p>{user.email}</p>
          <p>الخطة الحالية: <span className="plan">Flow Free</span></p>
          <button className="btn-dark" onClick={() => setTab("plans")}>ترقية الحساب</button>
          <button className="logout" onClick={logout}>تسجيل خروج</button>
        </section>
      )}

      {tab === "plans" && (
        <section className="card">
          <div className="card-title">
            <div className="icon"><Crown size={23} /></div>
            <h3>اختر خطتك</h3>
          </div>
          <div className="result">Flow Free{"\n"}$0{"\n"}تحليل واحد يومياً + الأخبار + إشارات قديمة</div>
          <div className="result">Flow Trader{"\n"}$19.99/mo{"\n"}10 تحليلات يومياً + مستشار 5 مرات + الإشارات + الأكاديمية</div>
          <div className="result">Flow Elite{"\n"}$49.99/mo{"\n"}غير محدود + إشارات VIP + مستشار غير محدود</div>
        </section>
      )}

      <nav className="bottom">
        <button className={`navbtn ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}><Home size={20} />الرئيسية</button>
        <button className={`navbtn ${tab === "advisor" ? "active" : ""}`} onClick={() => setTab("advisor")}><Brain size={20} />المستشار</button>
        <button className={`navbtn ${tab === "signals" ? "active" : ""}`} onClick={() => setTab("signals")}><Radio size={20} />الإشارات</button>
        <button className={`navbtn ${tab === "performance" ? "active" : ""}`} onClick={() => setTab("performance")}><BarChart3 size={20} />الأداء</button>
        <button className={`navbtn ${tab === "academy" ? "active" : ""}`} onClick={() => setTab("academy")}><GraduationCap size={20} />الأكاديمية</button>
        <button className={`navbtn ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}><User size={20} />ملفي</button>
      </nav>
    </main>
  );
}
