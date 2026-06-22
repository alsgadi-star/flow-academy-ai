import { useState } from "react";
import { Crown, Radio, Newspaper, GraduationCap, Radar, Users } from "lucide-react";

type AdminPageProps = {
  newSignal: any;
  setNewSignal: (value: any) => void;
  addSignal: () => void;

  newsItem: any;
  setNewsItem: (value: any) => void;
  addNews: () => void;

  academyItem: any;
  setAcademyItem: (value: any) => void;
  addAcademyContent: () => void;

  profiles: any[];
  subscriptionUserId: string;
  setSubscriptionUserId: (value: string) => void;
  subscriptionPlan: string;
  setSubscriptionPlan: (value: string) => void;
  updateSubscription: () => void;

  signalProviders: any[];

newProvider: any;
setNewProvider: (value: any) => void;

addProvider: () => void;
toggleProvider: (provider: any) => void;
removeProvider: (providerId: string) => void;
};

export default function AdminPage({

  signalProviders,

newProvider,
setNewProvider,

addProvider,
toggleProvider,
removeProvider,
  newSignal,
  setNewSignal,
  addSignal,
  newsItem,
  setNewsItem,
  addNews,
  academyItem,
  setAcademyItem,
  addAcademyContent,
  profiles,
  subscriptionUserId,
  setSubscriptionUserId,
  subscriptionPlan,
  setSubscriptionPlan,
  updateSubscription,
}: AdminPageProps) {
  const [adminTab, setAdminTab] = useState("signals");

  const tabs = [
    { id: "signals", title: "Flow VIP", icon: <Radio size={18} /> },
    { id: "news", title: "الأخبار", icon: <Newspaper size={18} /> },
    { id: "academy", title: "الأكاديمية", icon: <GraduationCap size={18} /> },
    { id: "radar", title: "Market Radar", icon: <Radar size={18} /> },
    { id: "subscriptions", title: "الاشتراكات", icon: <Users size={18} /> },
  ];

  return (
    <section className="card">
      <div className="card-title">
        <div className="icon">
          <Crown size={23} />
        </div>
        <h3>لوحة الإدارة</h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            style={{
              background:
                adminTab === tab.id
                  ? "linear-gradient(135deg,#facc15,#f59e0b)"
                  : "#08162e",
              color: adminTab === tab.id ? "#000" : "#cbd5e1",
              border:
                adminTab === tab.id
                  ? "1px solid #facc15"
                  : "1px solid #17365d",
              borderRadius: "16px",
              padding: "14px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {tab.icon}
            {tab.title}
          </button>
        ))}
      </div>

      {adminTab === "signals" && (
        <div style={{ display: "grid", gap: "12px" }}>
          <h3>إدارة إشارات Flow VIP</h3>

          <input placeholder="الرمز XAUUSD" value={newSignal.symbol} onChange={(e) => setNewSignal({ ...newSignal, symbol: e.target.value })} />

          <select value={newSignal.direction} onChange={(e) => setNewSignal({ ...newSignal, direction: e.target.value })}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>

          <input placeholder="سعر الدخول" value={newSignal.entry_price} onChange={(e) => setNewSignal({ ...newSignal, entry_price: e.target.value })} />
          <input placeholder="وقف الخسارة" value={newSignal.sl} onChange={(e) => setNewSignal({ ...newSignal, sl: e.target.value })} />
          <input placeholder="TP1" value={newSignal.tp1} onChange={(e) => setNewSignal({ ...newSignal, tp1: e.target.value })} />
          <input placeholder="TP2" value={newSignal.tp2} onChange={(e) => setNewSignal({ ...newSignal, tp2: e.target.value })} />
          <input placeholder="TP3" value={newSignal.tp3} onChange={(e) => setNewSignal({ ...newSignal, tp3: e.target.value })} />

          <select value={newSignal.access} onChange={(e) => setNewSignal({ ...newSignal, access: e.target.value })}>
            <option value="free">FREE</option>
            <option value="vip">VIP</option>
          </select>

          <button className="btn" onClick={addSignal}>
            إضافة إشارة
          </button>
        </div>
      )}

      {adminTab === "news" && (
        <div style={{ display: "grid", gap: "12px" }}>
          <h3>إدارة الأخبار الاقتصادية</h3>

          <input placeholder="عنوان الخبر" value={newsItem.title} onChange={(e) => setNewsItem({ ...newsItem, title: e.target.value })} />

          <textarea placeholder="محتوى الخبر" value={newsItem.content} onChange={(e) => setNewsItem({ ...newsItem, content: e.target.value })} />

          <select value={newsItem.impact} onChange={(e) => setNewsItem({ ...newsItem, impact: e.target.value })}>
            <option value="high">عالي التأثير</option>
            <option value="medium">متوسط التأثير</option>
            <option value="low">منخفض التأثير</option>
          </select>

          <button className="btn" onClick={addNews}>
            إضافة خبر
          </button>
        </div>
      )}

      {adminTab === "academy" && (
        <div style={{ display: "grid", gap: "12px" }}>
          <h3>إدارة محتوى الأكاديمية</h3>

          <input placeholder="عنوان المحتوى" value={academyItem.title} onChange={(e) => setAcademyItem({ ...academyItem, title: e.target.value })} />

          <textarea placeholder="وصف مختصر" value={academyItem.excerpt} onChange={(e) => setAcademyItem({ ...academyItem, excerpt: e.target.value })} />

          <textarea placeholder="محتوى الأكاديمية" value={academyItem.content} onChange={(e) => setAcademyItem({ ...academyItem, content: e.target.value })} />

          <select value={academyItem.type} onChange={(e) => setAcademyItem({ ...academyItem, type: e.target.value })}>
            <option value="article">مقال اقتصادي</option>
            <option value="daily">تحليل يومي</option>
            <option value="lesson">درس ICT و CRT</option>
            <option value="webinar">ويبينار</option>
          </select>

          <select value={academyItem.access} onChange={(e) => setAcademyItem({ ...academyItem, access: e.target.value })}>
            <option value="free">FREE</option>
            <option value="vip">VIP</option>
          </select>

          <button className="btn" onClick={addAcademyContent}>
            إضافة محتوى
          </button>
        </div>
      )}

      {adminTab === "radar" && (
        <div style={{ display: "grid", gap: "12px" }}>
          <h3>إدارة Market Radar</h3>
          <div className="result">
            هنا نضيف إدارة القنوات بالخطوة الجاية.
          </div>
        </div>
      )}

      {adminTab === "subscriptions" && (
        <div style={{ display: "grid", gap: "12px" }}>
          <h3>إدارة الاشتراكات</h3>

          <select value={subscriptionUserId} onChange={(e) => setSubscriptionUserId(e.target.value)}>
            <option value="">اختر المستخدم</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name || profile.email || profile.id}
              </option>
            ))}
          </select>

          <select value={subscriptionPlan} onChange={(e) => setSubscriptionPlan(e.target.value)}>
            <option value="free">Flow Free</option>
            <option value="trader">Flow Trader</option>
            <option value="elite">Flow Elite</option>
          </select>

          <button className="btn" onClick={updateSubscription}>
            تحديث الاشتراك
          </button>
        </div>
      )}
    </section>
  );
}
