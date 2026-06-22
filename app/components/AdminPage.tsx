import { Crown } from "lucide-react";

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
};

export default function AdminPage({
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
  return (
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
          setAcademyItem({ ...academyItem, excerpt: e.target.value })
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

      <hr style={{ margin: "20px 0" }} />

      <h3>إدارة الاشتراكات</h3>

      <select
        value={subscriptionUserId}
        onChange={(e) => setSubscriptionUserId(e.target.value)}
      >
        <option value="">اختر المستخدم</option>

        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.full_name || profile.email || profile.id}
          </option>
        ))}
      </select>

      <select
        value={subscriptionPlan}
        onChange={(e) => setSubscriptionPlan(e.target.value)}
      >
        <option value="free">Flow Free</option>
        <option value="trader">Flow Trader</option>
        <option value="elite">Flow Elite</option>
      </select>

      <button className="btn" onClick={updateSubscription}>
        تحديث الاشتراك
      </button>
    </section>
  );
}
