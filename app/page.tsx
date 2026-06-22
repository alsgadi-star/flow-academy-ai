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
    loadSubscription(data.user.id);
  }
});

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
setLoadingAuth(false);

if (session?.user) {
  loadSubscription(session.user.id);
} else {
  setSubscription(null);
}
  });

  

  async function loadNews() {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    setNews(data || []);
  }

   async function loadAcademyPosts() {
  const { data } = await supabase
    .from("academy_posts")
    .select("*")
    .order("created_at", { ascending: false });

  setAcademyPosts(data || []);
}

   async function loadNotifications() {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  setNotifications(data || []);
}

   async function loadSubscription(userId: string) {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) {
    setSubscription(data);
    return;
  }

  const { data: newSubscription } = await supabase
    .from("subscriptions")
    .insert([
      {
        user_id: userId,
        plan: "free",
        status: "active",
      },
    ])
    .select()
    .single();

  setSubscription(newSubscription);
}


   async function loadProfiles() {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  setProfiles(data || []);
}

loadSignals();
loadNews();
loadAcademyPosts();
loadNotifications();
loadProfiles();

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
  const { data: insertedSignal, error } = await supabase
    .from("signals")
    .insert([newSignal])
    .select()
    .single();

  if (!error) {
    await supabase.from("notifications").insert([
      {
        title: "إشارة تداول جديدة",
        message: `${newSignal.symbol} ${newSignal.direction}`,
        body: `الدخول: ${newSignal.entry_price} | الستوب: ${newSignal.sl}`,
        type: "signal",
        target_id: insertedSignal.id,
        target_table: "signals",
      },
    ]);

    alert("تمت إضافة الإشارة");

    const { data } = await supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false });

    setSignals(data || []);

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
  } else {
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
  const { data: insertedNews, error } = await supabase
    .from("news")
    .insert([newsItem])
    .select()
    .single();

  if (!error) {
    await supabase.from("notifications").insert([
      {
        title: "خبر اقتصادي جديد",
        message: newsItem.title,
        body: newsItem.content,
        type: "news",
        target_id: insertedNews.id,
        target_table: "news",
      },
    ]);

    alert("تمت إضافة الخبر");

    setNewsItem({
      title: "",
      content: "",
      impact: "medium",
    });
  } else {
    alert(error.message);
  }
}

async function addAcademyContent() {
 const { data: insertedPost, error } = await supabase
  .from("academy_posts")
  .insert([academyItem])
  .select()
  .single();

  if (!error) {

  const { error: notificationError } = await supabase
    .from("notifications")
    .insert([
      {
        title: "محتوى جديد في الأكاديمية",
        message: academyItem.title,
        type: academyItem.type,
        target_id: insertedPost.id,
        target_table: "academy_posts",
      },
    ]);

  if (notificationError) {
    alert(notificationError.message);
    return;
  }

  alert("تمت إضافة محتوى الأكاديمية");
    const { data } = await supabase
      .from("academy_posts")
      .select("*")
      .order("created_at", { ascending: false });

    setAcademyPosts(data || []);

    setAcademyItem({
  title: "",
  excerpt: "",
  content: "",
  type: "article",
  access: "free",
});
  } else {
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

  const { error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: selectedProfile.id,
        plan: subscriptionPlan,
        status: "active",
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) {
    alert(error.message);
    return;
  }

  alert("تم تحديث الاشتراك بنجاح");

  setSubscriptionUserId("");
  setSubscriptionPlan("free");
}

  
async function markNotificationAsRead(notificationId: string) {
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  setNotifications((prev) =>
    prev.map((item) =>
      item.id === notificationId
        ? { ...item, is_read: true }
        : item
    )
  );
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
  <SignalsPage
    signals={signals}
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

{item.body && (
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
