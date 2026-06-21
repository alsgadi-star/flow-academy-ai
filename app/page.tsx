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
  Crown,
  Bell,
} from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [tab, setTab] = useState("home");
  const [academyTab, setAcademyTab] = useState("news");
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("نتيجة التحليل تظهر هنا.");
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState("");

  const [signals, setSignals] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [academyPosts, setAcademyPosts] = useState<any[]>([]);

  const [notifications, setNotifications] = useState<any[]>([]);

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
  });

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
    setLoadingAuth(false);
  });

  async function loadSignals() {
    const { data } = await supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false });

    setSignals(data || []);
  }

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

loadSignals();
loadNews();
loadAcademyPosts();
loadNotifications();

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
  const { error } = await supabase
    .from("signals")
    .insert([newSignal]);

  if (!error) {
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
const isVIP = isAdmin;
  
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

      {notifications.length > 0 && (
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
        <section className="card">
          <div className="card-title">
            <div className="icon"><Radio size={23} /></div>
            <h3>الإشارات</h3>
          </div>

          {signals.length === 0 ? (
            <div className="result">لا توجد إشارات حالياً</div>
          ) : (
            signals.map((signal) => {
              const isVip = signal.access === "vip";
              const isBuy = signal.direction === "BUY";

              const statusLabel =
                signal.status === "active"
                  ? "نشطة"
                  : signal.status === "closed"
                  ? "منتهية"
                  : signal.status === "tp_hit"
                  ? "حققت الهدف"
                  : signal.status || "نشطة";

              const statusColor =
                signal.status === "active"
                  ? "#22c55e"
                  : signal.status === "closed"
                  ? "#ef4444"
                  : signal.status === "tp_hit"
                  ? "#facc15"
                  : "#22c55e";

              return (
                <div
                  key={signal.id}
                  style={{
                    background: "#08162e",
                    border: isVip ? "1px solid #facc15" : "1px solid #17365d",
                    borderRadius: "18px",
                    padding: "20px",
                    marginBottom: "16px",
                    opacity: isVip ? 0.75 : 1,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: statusColor }}>{statusLabel}</span>
                    {isVip && <span style={{ color: "#facc15" }}>VIP</span>}
                  </div>

                  {isVip ? (
                    <div style={{ textAlign: "center", padding: "25px 0" }}>
                      <h2 style={{ color: "#facc15" }}>إشارة VIP</h2>
                      <p style={{ color: "#94a3b8" }}>الترقية مطلوبة للوصول</p>
                      <button className="btn-dark" onClick={() => setTab("plans")}>
                        ترقية الحساب
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2
                        style={{
                          color: isBuy ? "#00ff88" : "#ff4d4d",
                          textAlign: "center",
                          marginBottom: "15px",
                        }}
                      >
                        {signal.symbol} {signal.direction}
                      </h2>

                      <p>الدخول: {signal.entry_price}</p>
                      <p>وقف الخسارة: {signal.sl}</p>
                      <p>TP1: {signal.tp1}</p>
                      <p>TP2: {signal.tp2}</p>
                      <p>TP3: {signal.tp3}</p>
                    </>
                  )}
                </div>
              );
            })
          )}
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
  selectedPost ? (
    <section className="card">
      <button
        className="btn-dark"
        onClick={() => setSelectedPost(null)}
        style={{ marginBottom: "15px" }}
      >
        ← رجوع
      </button>

      <h2>{selectedPost.title}</h2>

      {selectedPost.access === "vip" && (
        <div
          style={{
            background: "#facc15",
            color: "#000",
            padding: "6px 10px",
            borderRadius: "10px",
            display: "inline-block",
            marginBottom: "12px",
            fontWeight: "bold",
          }}
        >
          VIP
        </div>
      )}

      <div
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.9",
          color: "#cbd5e1",
        }}
      >
        {selectedPost.content}
      </div>

      {selectedPost.video_url && (
        <a
          href={selectedPost.video_url}
          target="_blank"
          rel="noreferrer"
          className="btn"
          style={{ marginTop: "20px", display: "block" }}
        >
          مشاهدة الفيديو
        </a>
      )}
    </section>
  ) : (
    <section className="card">
      <div className="card-title">
        <div className="icon">
          <GraduationCap size={23} />
        </div>
        <h3>الأكاديمية</h3>
      </div>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "12px",
    marginBottom: "20px",
  }}
>
  {[
    { id: "news", icon: "📰", title: "الأخبار", color: "#0ea5e9" },
    { id: "article", icon: "📚", title: "المقالات", color: "#8b5cf6" },
    { id: "daily", icon: "📈", title: "التحليل", color: "#22c55e" },
    { id: "lesson", icon: "🎓", title: "ICT & CRT", color: "#f59e0b" },
    { id: "webinar", icon: "🎥", title: "الويبينارات", color: "#ef4444" },
  ].map((item) => (
    <div
      key={item.id}
      onClick={() => setAcademyTab(item.id)}
      style={{
        background:
          academyTab === item.id
            ? "linear-gradient(180deg,#0b2345,#08162e)"
            : "#08162e",
        border:
          academyTab === item.id
            ? `1px solid ${item.color}`
            : "1px solid #17365d",
        borderRadius: "18px",
        padding: "18px",
        cursor: "pointer",
        textAlign: "center",
        boxShadow:
          academyTab === item.id
            ? `0 0 20px ${item.color}40`
            : "none",
      }}
    >
      <div style={{ fontSize: "28px", marginBottom: "10px" }}>
        {item.icon}
      </div>

      <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>
        {item.title}
      </div>

      <div
        style={{
          fontSize: "11px",
          color: "#94a3b8",
          marginTop: "6px",
        }}
      >
        {item.id === "news"
          ? news.length
          : academyPosts.filter((p) => p.type === item.id).length}{" "}
        محتوى
      </div>
    </div>
  ))}
</div>

      {academyTab === "news" ? (
        news.length === 0 ? (
          <div className="result">لا توجد أخبار حالياً</div>
        ) : (
          news.map((item) => (
            <div key={item.id} className="result">
              <h4>{item.title}</h4>
              <p>{item.content}</p>
            </div>
          ))
        )
      ) : academyPosts.filter((post) => post.type === academyTab).length === 0 ? (
        <div className="result">لا يوجد محتوى حالياً</div>
      ) : (
        academyPosts
          .filter((post) => post.type === academyTab)
          .map((post) => {
            const locked = post.access === "vip" && !isVIP;

            return (
              <div
                key={post.id}
                className="result"
                onClick={() => {
                  if (!locked) {
                    setSelectedPost(post);
                  }
                }}
                style={{ cursor: locked ? "default" : "pointer" }}
              >
                <h4>{post.title}</h4>

                {locked ? (
                  <>
                    <p>🔒 محتوى VIP</p>

                    <button
                      className="btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTab("plans");
                      }}
                    >
                      ترقية الحساب
                    </button>
                  </>
                ) : (
                  <>
                    <p>{post.excerpt || post.content}</p>

                    {post.access === "vip" && (
                      <span style={{ color: "#facc15" }}>VIP</span>
                    )}
                  </>
                )}
              </div>
            );
          })
      )}
    </section>
  )
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
      onClick={() => {
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
          setAcademyTab("news");
          setTab("academy");
        }

        if (item.type === "signal") {
          setTab("signals");
        }
      }}
      style={{
        marginBottom: "12px",
        cursor: "pointer",
      }}
    >
      <h4>{item.title}</h4>
      <p>{item.message || item.body}</p>
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
          <p>الخطة الحالية: <span className="plan">Flow Free</span></p>
          <button className="btn-dark" onClick={() => setTab("plans")}>ترقية الحساب</button>
          <button className="logout" onClick={logout}>تسجيل خروج</button>
        </section>
      )}
      {isAdmin && tab === "admin" && (
  <section className="card">
    <div className="card-title">
      <div className="icon">
        <Crown size={23} />
      </div>
      <h3>لوحة الإدارة</h3>
    </div>

    <div style={{ display: "grid", gap: "12px" }}>
      <input
        placeholder="الرمز (XAUUSD)"
        value={newSignal.symbol}
        onChange={(e) =>
          setNewSignal({ ...newSignal, symbol: e.target.value })
        }
      />

      <select
        value={newSignal.direction}
        onChange={(e) =>
          setNewSignal({ ...newSignal, direction: e.target.value })
        }
      >
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>

      <input
        placeholder="سعر الدخول"
        value={newSignal.entry_price}
        onChange={(e) =>
          setNewSignal({ ...newSignal, entry_price: e.target.value })
        }
      />

      <input
        placeholder="وقف الخسارة"
        value={newSignal.sl}
        onChange={(e) =>
          setNewSignal({ ...newSignal, sl: e.target.value })
        }
      />

      <input
        placeholder="TP1"
        value={newSignal.tp1}
        onChange={(e) =>
          setNewSignal({ ...newSignal, tp1: e.target.value })
        }
      />

      <input
        placeholder="TP2"
        value={newSignal.tp2}
        onChange={(e) =>
          setNewSignal({ ...newSignal, tp2: e.target.value })
        }
      />

      <input
        placeholder="TP3"
        value={newSignal.tp3}
        onChange={(e) =>
          setNewSignal({ ...newSignal, tp3: e.target.value })
        }
      />

      <select
        value={newSignal.access}
        onChange={(e) =>
          setNewSignal({ ...newSignal, access: e.target.value })
        }
      >
        <option value="free">FREE</option>
        <option value="vip">VIP</option>
      </select>

      <button className="btn" onClick={addSignal}>
        إضافة إشارة
      </button>

          <hr style={{ margin: "20px 0" }} />



<h3>إضافة خبر اقتصادي</h3>



<input

  placeholder="عنوان الخبر"

  value={newsItem.title}

  onChange={(e) =>

    setNewsItem({ ...newsItem, title: e.target.value })

  }

/>



<textarea

  placeholder="محتوى الخبر"

  value={newsItem.content}

  onChange={(e) =>

    setNewsItem({ ...newsItem, content: e.target.value })

  }

/>



<select

  value={newsItem.impact}

  onChange={(e) =>

    setNewsItem({ ...newsItem, impact: e.target.value })

  }

>

  <option value="high">عالي التأثير</option>

  <option value="medium">متوسط التأثير</option>

  <option value="low">منخفض التأثير</option>

</select>



<button className="btn" onClick={addNews}>

  إضافة خبر

</button>
    </div>

    <hr style={{ margin: "20px 0" }} />

<h3>إضافة محتوى للأكاديمية</h3>

<input
  placeholder="عنوان المحتوى"
  value={academyItem.title}
  onChange={(e) =>
    setAcademyItem({ ...academyItem, title: e.target.value })
  }
/>

<textarea
  placeholder="وصف مختصر"
  value={academyItem.excerpt}
  onChange={(e) =>
    setAcademyItem({
      ...academyItem,
      excerpt: e.target.value,
    })
  }
/>

<textarea
  placeholder="محتوى الأكاديمية"
  value={academyItem.content}
  onChange={(e) =>
    setAcademyItem({ ...academyItem, content: e.target.value })
  }
/>

<select
  value={academyItem.type}
  onChange={(e) =>
    setAcademyItem({ ...academyItem, type: e.target.value })
  }
>
  <option value="article">مقال اقتصادي</option>
  <option value="daily">تحليل يومي</option>
  <option value="lesson">درس ICT و CRT</option>
  <option value="webinar">ويبينار</option>
</select>

<select
  value={academyItem.access}
  onChange={(e) =>
    setAcademyItem({ ...academyItem, access: e.target.value })
  }
>
  <option value="free">FREE</option>
  <option value="vip">VIP</option>
</select>

<button className="btn" onClick={addAcademyContent}>
  إضافة محتوى
</button>
    
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
