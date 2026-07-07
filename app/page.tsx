"use client";

import { useEffect, useState } from "react";
import SignalsPage from "./components/SignalsPage";
import AcademyPage from "./components/AcademyPage";
import AdminPage from "./components/AdminPage";
import {
  loadSignals,
  createSignal,
  createSignalNotification,
} from "./services/signals";

import {
  loadProviderSignals,
  loadSignalProviders,
  createSignalProvider,
  updateSignalProvider,
  deleteSignalProvider,
} from "./services/providerSignals";


import {
  loadNotifications,
  markNotificationAsReadById,
} from "./services/notifications";


import {
  loadSubscription,
  updateUserSubscription,
} from "./services/subscriptions";

import {
  loadAcademyPosts,
  createAcademyPost,
  createAcademyNotification,
} from "./services/academy";

import {
  loadNews,
  createNews,
  createNewsNotification,
} from "./services/news";

import { supabase } from "../lib/supabase";
import {
  UploadCloud,
  Brain,
  BarChart3,
  Activity,
  User,
  Home,
  Radio,
  GraduationCap,
  Crown,
  Bell,
} from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [tab, setTab] = useState("home");
  const [academyTab, setAcademyTab] = useState("news");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [selectedSignal, setSelectedSignal] = useState<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("نتيجة التحليل تظهر هنا.");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

const [providerSignals, setProviderSignals] = useState<any[]>([]);
const [signalProviders, setSignalProviders] = useState<any[]>([]);

const [newProvider, setNewProvider] = useState({
  name: "",
  telegram_channel: "",
  display_order: 0,
  is_active: true,
});
  
  const [signals, setSignals] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [academyPosts, setAcademyPosts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [subscriptionUserId, setSubscriptionUserId] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const hasUnreadNotifications = notifications.some(
  (item) => item.is_read !== true
);

  const [newSignal, setNewSignal] = useState({
    symbol: "",
    direction: "BUY",
    entry_price: "",
    sl: "",
    tp1: "",
    tp2: "",
    tp3: "",
    status: "active",
    signal_type: "scalp",
    access: "free",
  });

  const [newsItem, setNewsItem] = useState({
    title: "",
    content: "",
    impact: "medium",
  });

  const [academyItem, setAcademyItem] = useState({
  title: "",
  excerpt: "",
  content: "",
  type: "article",
  access: "free",
});
 useEffect(() => {
supabase.auth.getUser().then(({ data }) => {
  setUser(data.user);
  setLoadingAuth(false);

  if (data.user) {
    loadSubscription(data.user.id).then(setSubscription);
  }
});

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
setLoadingAuth(false);

if (session?.user) {
  loadSubscription(session.user.id).then(setSubscription);
} else {
  setSubscription(null);
}
  });

  

   async function loadProfiles() {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  setProfiles(data || []);
}

loadSignals().then(setSignals);
loadNews().then(setNews);
loadAcademyPosts().then(setAcademyPosts);
loadNotifications().then(setNotifications);
loadProfiles();
loadProviderSignals().then(setProviderSignals);
loadSignalProviders().then(setSignalProviders);

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
 async function addSignal() {
  try {
    const insertedSignal = await createSignal(newSignal);

    await createSignalNotification(insertedSignal);

    alert("تمت إضافة الإشارة");

    const updatedSignals = await loadSignals();
    setSignals(updatedSignals);

    setNewSignal({
      symbol: "",
      direction: "BUY",
      entry_price: "",
      sl: "",
      tp1: "",
      tp2: "",
      tp3: "",
      status: "active",
      signal_type: "scalp",
      access: "free",
    });
  } catch (error: any) {
    alert(error.message);
  }
}

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult("تم رفع الصورة. اضغط حلل الآن.");
  }

  async function addNews() {
  try {
    const insertedNews = await createNews(newsItem);

    await createNewsNotification(insertedNews);

    alert("تمت إضافة الخبر");

    const updatedNews = await loadNews();
    setNews(updatedNews);

    setNewsItem({
      title: "",
      content: "",
      impact: "medium",
    });
  } catch (error: any) {
    alert(error.message);
  }
}

async function addAcademyContent() {
  try {
    const insertedPost = await createAcademyPost(academyItem);

    await createAcademyNotification(insertedPost);

    alert("تمت إضافة محتوى الأكاديمية");

    const updatedPosts = await loadAcademyPosts();
    setAcademyPosts(updatedPosts);

    setAcademyItem({
      title: "",
      excerpt: "",
      content: "",
      type: "article",
      access: "free",
    });
  } catch (error: any) {
    alert(error.message);
  }
}

async function updateSubscription() {
  const selectedProfile = profiles.find(
    (profile) =>
      profile.id === subscriptionUserId ||
      profile.full_name === subscriptionUserId ||
      profile.email === subscriptionUserId
  );

  if (!selectedProfile) {
    alert("اختر المستخدم من القائمة من جديد");
    setSubscriptionUserId("");
    return;
  }

  try {
    await updateUserSubscription(
      selectedProfile.id,
      subscriptionPlan
    );

    alert("تم تحديث الاشتراك بنجاح");

    setSubscriptionUserId("");
    setSubscriptionPlan("free");
  } catch (error: any) {
    alert(error.message);
  }
}

  
async function markNotificationAsRead(notificationId: string) {
  try {
    await markNotificationAsReadById(notificationId);

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, is_read: true } : item
      )
    );
  } catch (error: any) {
    alert(error.message);
  }
}


async function addProvider() {
  try {
    await createSignalProvider(newProvider);

    const updatedProviders = await loadSignalProviders();
    setSignalProviders(updatedProviders);

    setNewProvider({
      name: "",
      telegram_channel: "",
      display_order: 0,
      is_active: true,
    });

    alert("تمت إضافة القناة");
  } catch (error: any) {
    alert(error.message);
  }
}

async function toggleProvider(provider: any) {
  try {
    await updateSignalProvider(provider.id, {
      is_active: !provider.is_active,
    });

    const updatedProviders = await loadSignalProviders();
    setSignalProviders(updatedProviders);
  } catch (error: any) {
    alert(error.message);
  }
}

async function removeProvider(providerId: string) {
  try {
    await deleteSignalProvider(providerId);

    const updatedProviders = await loadSignalProviders();
    setSignalProviders(updatedProviders);
  } catch (error: any) {
    alert(error.message);
  }
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

const isAdmin = user?.email === "alsgadi@gmail.com";
const isVIP =
  isAdmin ||
  (subscription?.status === "active" &&
    ["trader", "elite"].includes(subscription?.plan)); 
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

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <button
      onClick={() => setTab("notifications")}
      style={{
        position: "relative",
        background: "#08162e",
        border: "1px solid #17365d",
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        color: "#fff",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Bell size={18} />

      {hasUnreadNotifications && (
        <span
          style={{
            position: "absolute",
            top: "6px",
            right: "7px",
            width: "9px",
            height: "9px",
            background: "#ef4444",
            borderRadius: "50%",
            border: "2px solid #08162e",
          }}
        />
      )}
    </button>

    <div className="pill">Free</div>
  </div>
</header>

      {tab === "home" && (
  <>
    <section
      style={{
        padding: "22px 0 10px",
        textAlign: "right",
      }}
    >
      <p style={{ color: "#94a3b8", margin: 0 }}>مرحباً أحمد 👋</p>
      <h2 style={{ fontSize: "34px", margin: "8px 0", color: "#fff" }}>
        ماذا تريد أن تحلل اليوم؟
      </h2>
      <p style={{ color: "#22d3ee", lineHeight: 1.8, margin: 0 }}>
        منصة تداول ذكية لتحليل الشارت، متابعة التوصيات، ومراقبة الصفقات.
      </p>
    </section>

    <section
      style={{
        background:
          "radial-gradient(circle at top right,rgba(20,241,149,.22),transparent 35%),linear-gradient(135deg,#04111f,#07182d)",
        border: "1px solid #155e75",
        borderRadius: "26px",
        padding: "22px",
        marginBottom: "18px",
        boxShadow: "0 0 32px rgba(34,211,238,0.12)",
      }}
    >
      <div className="card-title">
        <div className="icon">
          <Brain size={24} />
        </div>
        <h3>المستشار الذكي</h3>
      </div>

      <p style={{ color: "#94a3b8", lineHeight: 1.9 }}>
        حلل أي شارت خلال ثوانٍ بمنهج ICT و CRT، واحصل على تقرير واضح عن الاتجاه، السيولة، مناطق الدخول، وإدارة الصفقة.
      </p>

      <label className="upload">
        <input type="file" accept="image/*" onChange={onFile} />
        <div>
          <UploadCloud size={38} />
          <p style={{ fontWeight: 800 }}>اضغط لرفع صورة الشارت</p>
          <small style={{ color: "#94a3b8" }}>PNG • JPG • JPEG</small>
        </div>
      </label>

      {preview && (
        <img
          className="preview"
          src={preview}
          style={{ display: "block" }}
          alt="chart"
        />
      )}

      <button className="btn" onClick={analyze} disabled={loading}>
        {loading ? "جاري التحليل..." : "🧠 ابدأ التحليل"}
      </button>

      <div className={`result ${result === "نتيجة التحليل تظهر هنا." ? "empty" : ""}`}>
        {result === "نتيجة التحليل تظهر هنا."
          ? "🧠 بانتظار تحليل أول شارت."
          : result}
      </div>
    </section>

    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: "12px",
        marginBottom: "18px",
      }}
    >
      <div className="mini">
        <b>⚡ سكالب</b>
        <span>1M • 5M • 15M</span>
      </div>

      <div className="mini">
        <b>📈 سوينغ</b>
        <span>1H • H4 • D1</span>
      </div>
    </section>

    <section
      style={{
        display: "grid",
        gap: "12px",
        marginBottom: "18px",
      }}
    >
      <div
        className="result"
        onClick={() => setTab("signals")}
        style={{ cursor: "pointer" }}
      >
        <h3 style={{ marginTop: 0 }}>🧠 مركز التوصيات</h3>
        <p>محرك الرصد الذكي يعمل الآن.</p>
        <p style={{ color: "#22d3ee" }}>
          الفرص النشطة: {providerSignals?.length || 0}
        </p>
      </div>

      <div
        className="result"
        onClick={() => setTab("notifications")}
        style={{ cursor: "pointer" }}
      >
        <h3 style={{ marginTop: 0 }}>🔔 آخر التنبيهات</h3>
        <p>
          {notifications?.[0]?.title || "لا توجد تنبيهات جديدة حالياً"}
        </p>
        {notifications?.[0]?.message && (
          <p style={{ color: "#94a3b8" }}>{notifications[0].message}</p>
        )}
      </div>

      <div className="result">
        <h3 style={{ marginTop: 0 }}>🌍 السوق الآن</h3>
        <p>الذهب: تحت المراقبة</p>
        <p>الدولار: بانتظار بيانات جديدة</p>
        <p>ناسداك: مراقبة الزخم</p>
      </div>
    </section>
  </>
)}

 {tab === "advisor" && (
  <section className="card">
    <div className="card-title">
      <div className="icon">
        <Brain size={23} />
      </div>
      <h3>المستشار الذكي</h3>
    </div>

    <div
      style={{
        background:
          "radial-gradient(circle at top right,rgba(20,241,149,.18),transparent 35%),linear-gradient(135deg,#04111f,#07182d)",
        border: "1px solid #155e75",
        borderRadius: "24px",
        padding: "20px",
        marginBottom: "18px",
        boxShadow: "0 0 28px rgba(34,211,238,0.12)",
      }}
    >
      <h2 style={{ color: "#22d3ee", marginBottom: 10 }}>
        🧠 غرفة التحليل الذكي
      </h2>

      <p style={{ color: "#94a3b8", lineHeight: 1.9, margin: 0 }}>
        ارفع صورة الشارت وصورة الحساب، ثم اكتب سؤالك. سيقوم المستشار بتحليل الصفقة وفق منهج ICT و CRT.
      </p>
    </div>

    <div style={{ display: "grid", gap: "10px", marginBottom: "18px" }}>
      {[
        "① ارفع صورة الشارت",
        "② ارفع صورة الحساب والهامش",
        "③ اكتب سؤالك عن الصفقة",
        "④ اضغط تحليل",
      ].map((step) => (
        <div
          key={step}
          style={{
            background: "#061225",
            border: "1px solid #17365d",
            borderRadius: "16px",
            padding: "13px",
            color: "#e5e7eb",
            fontWeight: 700,
            lineHeight: 1.6,
          }}
        >
          {step}
        </div>
      ))}
    </div>

    <label className="upload">
      <input type="file" accept="image/*" onChange={onFile} />
      <div>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>📈</div>
        <p style={{ margin: 0, fontWeight: 800 }}>رفع صورة الشارت</p>
        <small style={{ color: "#94a3b8" }}>
          الشارت، الهيكل، السيولة، ومناطق الدخول
        </small>
      </div>
    </label>

    {preview && (
      <img
        className="preview"
        src={preview}
        style={{ display: "block", marginTop: "12px", borderRadius: "16px" }}
        alt="chart"
      />
    )}

    <label className="upload" style={{ marginTop: 12 }}>
      <input type="file" accept="image/*" />
      <div>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>💰</div>
        <p style={{ margin: 0, fontWeight: 800 }}>رفع صورة الحساب والهامش</p>
        <small style={{ color: "#94a3b8" }}>
          الرصيد، الهامش، وحجم المخاطرة
        </small>
      </div>
    </label>

    <textarea
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      placeholder="مثال: هل أدخل الصفقة؟ هل أنقل وقف الخسارة؟ هل المخاطرة مناسبة؟"
      style={{
        minHeight: "120px",
        lineHeight: 1.8,
        fontSize: "15px",
      }}
    />

    <button className="btn" onClick={analyze} disabled={loading}>
      {loading ? "جاري التحليل..." : "🧠 تحليل بواسطة المستشار الذكي"}
    </button>

    <div
      className="result"
      style={{
        marginTop: "16px",
        whiteSpace: "pre-wrap",
        lineHeight: 1.9,
        fontSize: "15px",
      }}
    >
      {result}
    </div>
  </section>
)}

      {tab === "signals" && (
  <SignalsPage
    signals={signals}
    providerSignals={providerSignals}
    signalProviders={signalProviders}
    selectedSignal={selectedSignal}
    setSelectedSignal={setSelectedSignal}
    setTab={setTab}
  />
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
  <AcademyPage
    news={news}
    academyPosts={academyPosts}
    academyTab={academyTab}
    setAcademyTab={setAcademyTab}
    selectedNews={selectedNews}
    setSelectedNews={setSelectedNews}
    selectedPost={selectedPost}
    setSelectedPost={setSelectedPost}
    isVIP={isVIP}
    setTab={setTab}
  />
)}

{tab === "notifications" && (
  <section className="card">
    <div className="card-title">
      <div className="icon">
        <Bell size={23} />
      </div>
      <h3>الإشعارات</h3>
    </div>

   {notifications.length === 0 ? (
  <div className="result">
    لا توجد إشعارات حالياً
  </div>
) : (
  notifications.map((item) => (
    <div
      key={item.id}
      className="result"
    onClick={async () => {
  await markNotificationAsRead(item.id);
  if (item.target_table === "signals") {
    const signal = signals.find(
      (s) => String(s.id) === String(item.target_id)
    );

    if (signal) {
      setSelectedSignal(signal);
      setTab("signals");
    }
  }

  if (item.target_table === "academy_posts") {
    const post = academyPosts.find(
      (p) => String(p.id) === String(item.target_id)
    );

    if (post) {
      setSelectedPost(post);
      setAcademyTab(post.type);
      setTab("academy");
    }
  }

  if (item.target_table === "news") {
    const newsItem = news.find(
      (n) => String(n.id) === String(item.target_id)
    );

    if (newsItem) {
      setSelectedNews(newsItem);
      setAcademyTab("news");
      setTab("academy");
    }
  }
}}
      style={{
        marginBottom: "12px",
        cursor: "pointer",
      }}
    >
      <h4>{item.title}</h4>

{item.message && (
  <p>{item.message}</p>
)}

{item.body && item.body !== item.message && (
  <p style={{ color: "#94a3b8" }}>
    {item.body}
  </p>
)}
    </div>
  ))
)}
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
          <p>
  الخطة الحالية:{" "}
  <span className="plan">
    {subscription?.plan === "elite"
  ? "Flow Elite"
  : subscription?.plan === "trader"
  ? "Flow Trader"
  : "Flow Free"}
  </span>
</p>
          <button className="btn-dark" onClick={() => setTab("plans")}>ترقية الحساب</button>
          <button className="logout" onClick={logout}>تسجيل خروج</button>
        </section>
      )}
    {isAdmin && tab === "admin" && (
<AdminPage
  newSignal={newSignal}
  setNewSignal={setNewSignal}
  addSignal={addSignal}
  newsItem={newsItem}
  setNewsItem={setNewsItem}
  addNews={addNews}
  academyItem={academyItem}
  setAcademyItem={setAcademyItem}
  addAcademyContent={addAcademyContent}
  profiles={profiles}
  subscriptionUserId={subscriptionUserId}
  setSubscriptionUserId={setSubscriptionUserId}
  subscriptionPlan={subscriptionPlan}
  setSubscriptionPlan={setSubscriptionPlan}
  updateSubscription={updateSubscription}
  signalProviders={signalProviders}
  newProvider={newProvider}
  setNewProvider={setNewProvider}
  addProvider={addProvider}
  toggleProvider={toggleProvider}
  removeProvider={removeProvider}
/>
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
  <button
    className={`navbtn ${tab === "home" ? "active" : ""}`}
    onClick={() => setTab("home")}
  >
    <Home size={20} />
    الرئيسية
  </button>

  <button
    className={`navbtn ${tab === "advisor" ? "active" : ""}`}
    onClick={() => setTab("advisor")}
  >
    <Brain size={20} />
    المستشار
  </button>

  <button
    className={`navbtn ${tab === "signals" ? "active" : ""}`}
    onClick={() => setTab("signals")}
  >
    <Radio size={20} />
    الإشارات
  </button>

  <button
    className={`navbtn ${tab === "performance" ? "active" : ""}`}
    onClick={() => setTab("performance")}
  >
    <BarChart3 size={20} />
    الأداء
  </button>

  <button
    className={`navbtn ${tab === "academy" ? "active" : ""}`}
    onClick={() => setTab("academy")}
  >
    <GraduationCap size={20} />
    الأكاديمية
  </button>
        
  {isAdmin && (
    <button
      className={`navbtn ${tab === "admin" ? "active" : ""}`}
      onClick={() => setTab("admin")}
    >
      <Crown size={20} />
      إدارة
    </button>
  )}

  <button
    className={`navbtn ${tab === "profile" ? "active" : ""}`}
    onClick={() => setTab("profile")}
  >
    <User size={20} />
    ملفي
  </button>
</nav>
       </main>
  );
} 
