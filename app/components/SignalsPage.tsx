import { useState } from "react";
import { Brain, Radar, Star } from "lucide-react";

type SignalsPageProps = {
  signals: any[];
  providerSignals: any[];
  signalProviders: any[];
  selectedSignal: any;
  setSelectedSignal: (value: any) => void;
  setTab: (value: string) => void;
};

export default function SignalsPage({
  signals,
  providerSignals,
  signalProviders,
  selectedSignal,
  setSelectedSignal,
  setTab,
}: SignalsPageProps) {
  const [signalsTab, setSignalsTab] = useState("radar");

  const activeEngines = signalProviders.length;
  const activeSignals = providerSignals.filter(
    (s) => s.signal_status === "active"
  ).length;

  function symbolName(symbol: string) {
    const s = String(symbol || "").toUpperCase();

    if (s === "GOLD" || s === "XAUUSD") return "الذهب";
    if (s === "BTCUSD" || s === "BTC") return "البتكوين";
    if (s === "EURUSD") return "اليورو دولار";
    if (s === "GBPUSD") return "الباوند دولار";
    if (s === "AUDUSD") return "الأسترالي دولار";
    if (s === "USDJPY") return "الدولار ين";
    if (s === "NAS100") return "ناسداك";
    if (s === "US30") return "الداو جونز";

    return s;
  }

  function directionLabel(direction: string) {
    return direction === "BUY" ? "شراء" : "بيع";
  }

  function statusLabel(status: string) {
    if (status === "pending") return "قيد الانتظار";
    if (status === "active") return "نشطة";
    if (status === "tp1") return "حققت الهدف الأول";
    if (status === "tp2") return "حققت الهدف الثاني";
    if (status === "closed") return "مغلقة";
    if (status === "stopped") return "وقف خسارة";
    return "قيد المتابعة";
  }

  if (selectedSignal) {
    return (
      <section className="card">
        <button
          className="btn-dark"
          onClick={() => setSelectedSignal(null)}
          style={{ marginBottom: "15px" }}
        >
          ← رجوع
        </button>

        <h2>🧠 تقرير الصفقة</h2>

        <div className="result">
          <p>الأصل: {symbolName(selectedSignal.symbol)}</p>
          <p>الاتجاه: {directionLabel(selectedSignal.direction)}</p>
          <p>الدخول: {selectedSignal.entry_price}</p>
          <p>وقف الخسارة: {selectedSignal.sl}</p>
          <p>الهدف الأول: {selectedSignal.tp1}</p>
          <p>الهدف الثاني: {selectedSignal.tp2}</p>
          <p>الهدف الثالث: {selectedSignal.tp3}</p>
          <p>الحالة: {statusLabel(selectedSignal.status)}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-title">
        <div className="icon">
          <Brain size={23} />
        </div>
        <h3>مركز التوصيات</h3>
      </div>

      <div
        style={{
          background:
            "radial-gradient(circle at top right,rgba(20,241,149,0.22),transparent 35%), linear-gradient(135deg,#04111f,#061a2d,#07182d)",
          border: "1px solid #155e75",
          borderRadius: "24px",
          padding: "20px",
          marginBottom: "16px",
          boxShadow: "0 0 28px rgba(34,211,238,0.12)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "14px" }}>
          <div>
            <h2 style={{ margin: 0, color: "#22d3ee" }}>
              🧠 مركز التوصيات
            </h2>
            <p style={{ color: "#94a3b8", marginTop: "8px", lineHeight: 1.8 }}>
              يراقب محرك الرصد الذكي الأسواق العالمية، ويحلل فرص التداول، ويتابع الصفقات حتى الإغلاق.
            </p>
          </div>

          <div
            style={{
              minWidth: "58px",
              height: "58px",
              borderRadius: "20px",
              background: "#042f2e",
              display: "grid",
              placeItems: "center",
              color: "#14f195",
              boxShadow: "0 0 18px rgba(20,241,149,0.25)",
            }}
          >
            <Radar size={29} />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "10px",
            marginTop: "18px",
          }}
        >
          <div className="mini">
            <b>{activeSignals}</b>
            <span>فرص نشطة</span>
          </div>

          <div className="mini">
            <b>{activeEngines}</b>
            <span>محركات التحليل</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "10px",
          background: "#061225",
          padding: "6px",
          borderRadius: "18px",
          marginBottom: "18px",
          border: "1px solid #17365d",
        }}
      >
        <button
          onClick={() => setSignalsTab("radar")}
          style={{
            border: "none",
            borderRadius: "14px",
            padding: "14px",
            fontWeight: 800,
            cursor: "pointer",
            color: signalsTab === "radar" ? "#001018" : "#94a3b8",
            background:
              signalsTab === "radar"
                ? "linear-gradient(135deg,#14f195,#22d3ee)"
                : "transparent",
          }}
        >
          🧠 مركز التوصيات
        </button>

        <button
          onClick={() => setSignalsTab("vip")}
          style={{
            border: "none",
            borderRadius: "14px",
            padding: "14px",
            fontWeight: 800,
            cursor: "pointer",
            color: signalsTab === "vip" ? "#000" : "#94a3b8",
            background:
              signalsTab === "vip"
                ? "linear-gradient(135deg,#facc15,#f59e0b)"
                : "transparent",
          }}
        >
          💎 التوصيات الاحترافية
        </button>
      </div>

      {signalsTab === "radar" && (
        <>
          {providerSignals.length === 0 ? (
            <div className="result">لا توجد فرص تداول مرصودة حالياً.</div>
          ) : (
            providerSignals.map((item) => {
              const isBuy = item.direction === "BUY";

              return (
                <div
                  key={item.id}
                  style={{
                    background: "linear-gradient(135deg,#061225,#07182d)",
                    border: "1px solid #075985",
                    borderRadius: "22px",
                    padding: "18px",
                    marginBottom: "14px",
                    boxShadow: "0 0 18px rgba(14,165,233,0.12)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #17365d",
                      paddingBottom: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    <strong style={{ color: "#38bdf8" }}>
                      🧠 تم تحليلها بواسطة محرك الرصد الذكي
                    </strong>

                    <span style={{ color: "#64748b", fontSize: "12px" }}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleTimeString("ar-IQ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>

                  <h2
                    style={{
                      color: isBuy ? "#14f195" : "#fb7185",
                      textAlign: "center",
                      marginBottom: "14px",
                    }}
                  >
                    {isBuy ? "🟢 فرصة شراء" : "🔴 فرصة بيع"} على{" "}
                    {symbolName(item.symbol)}
                  </h2>

                  <div
                    style={{
                      display: "grid",
                      gap: "8px",
                      color: "#e5e7eb",
                      lineHeight: 1.8,
                    }}
                  >
                    <p>الدخول: {item.entry_price}</p>
                    <p>وقف الخسارة: {item.sl}</p>
                    {item.tp1 && <p>الهدف الأول: {item.tp1}</p>}
                    {item.tp2 && <p>الهدف الثاني: {item.tp2}</p>}
                    {item.tp3 && <p>الهدف الثالث: {item.tp3}</p>}
                    <p>الحالة: {statusLabel(item.status)}</p>
                  </div>

                  <div
                    style={{
                      marginTop: "14px",
                      padding: "12px",
                      borderRadius: "16px",
                      background: "rgba(20,241,149,0.08)",
                      border: "1px solid rgba(20,241,149,0.18)",
                      color: "#a7f3d0",
                      lineHeight: 1.7,
                    }}
                  >
                    🧠 تحليل النظام
                    <br />
                    درجة الثقة: عالية
                    <br />
                    المتابعة المباشرة: مفعلة
                    <br />
                    يتم مراقبة الصفقة بشكل مستمر حتى الإغلاق.
                  </div>
                </div>
              );
            })
          )}
        </>
      )}

      {signalsTab === "vip" && (
        <>
          {signals.length === 0 ? (
            <div className="result">لا توجد توصيات احترافية حالياً</div>
          ) : (
            signals.map((signal) => {
              const isVip = signal.access === "vip";
              const isBuy = signal.direction === "BUY";

              return (
                <div
                  key={signal.id}
                  style={{
                    background: "#08162e",
                    border: isVip ? "1px solid #facc15" : "1px solid #17365d",
                    borderRadius: "20px",
                    padding: "20px",
                    marginBottom: "16px",
                  }}
                >
                  {isVip ? (
                    <div style={{ textAlign: "center", padding: "25px 0" }}>
                      <h2 style={{ color: "#facc15" }}>التوصيات الاحترافية</h2>
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
                        {isBuy ? "شراء" : "بيع"} {symbolName(signal.symbol)}
                      </h2>

                      <p>الدخول: {signal.entry_price}</p>
                      <p>وقف الخسارة: {signal.sl}</p>
                      <p>الهدف الأول: {signal.tp1}</p>
                      <p>الهدف الثاني: {signal.tp2}</p>
                      <p>الهدف الثالث: {signal.tp3}</p>
                    </>
                  )}
                </div>
              );
            })
          )}
        </>
      )}
    </section>
  );
}
