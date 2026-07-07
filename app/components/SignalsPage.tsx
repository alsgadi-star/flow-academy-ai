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
  const detectedSignals = providerSignals.length;

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

        <h2>🧠 تقرير Flow Radar AI</h2>

        <p>الأصل: {selectedSignal.symbol}</p>
        <p>
          الاتجاه:{" "}
          {selectedSignal.direction === "BUY" ? "شراء" : "بيع"}
        </p>
        <p>الدخول: {selectedSignal.entry_price}</p>
        <p>وقف الخسارة: {selectedSignal.sl}</p>
        <p>الهدف الأول: {selectedSignal.tp1}</p>
        <p>الهدف الثاني: {selectedSignal.tp2}</p>
        <p>الهدف الثالث: {selectedSignal.tp3}</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-title">
        <div className="icon">
          <Brain size={23} />
        </div>
        <h3>Flow Radar AI</h3>
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
              🧠 مركز الرصد الذكي
            </h2>
            <p style={{ color: "#94a3b8", marginTop: "8px", lineHeight: 1.8 }}>
              يراقب Flow Radar AI الأسواق العالمية، يحلل الفرص، ويتابع الصفقات لحظة بلحظة.
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
            <b>{activeEngines}</b>
            <span>محركات الرصد</span>
          </div>

          <div className="mini">
            <b>{detectedSignals}</b>
            <span>فرص مكتشفة</span>
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
          🧠 Flow Radar AI
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
          ⭐ Flow Elite
        </button>
      </div>

      {signalsTab === "radar" && (
        <>
          {providerSignals.length === 0 ? (
            <div className="result">لا توجد فرص مرصودة حالياً</div>
          ) : (
            providerSignals.map((item) => {
              const isBuy = item.direction === "BUY";

              return (
                <div
                  key={item.id}
                  style={{
                    background:
                      "linear-gradient(135deg,#061225,#07182d)",
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
                      📡 Verified by Flow Radar
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
                    {isBuy ? "🟢 فرصة شراء" : "🔴 فرصة بيع"} على {item.symbol}
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
                    🧠 تقييم Flow Radar AI
                    <br />
                    تمت مراجعة الفرصة آلياً، والمتابعة المباشرة مفعلة.
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
            <div className="result">لا توجد فرص Elite حالياً</div>
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
                    borderRadius: "20px",
                    padding: "20px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: statusColor }}>{statusLabel}</span>
                    {isVip && <span style={{ color: "#facc15" }}>Flow Elite</span>}
                  </div>

                  {isVip ? (
                    <div style={{ textAlign: "center", padding: "25px 0" }}>
                      <h2 style={{ color: "#facc15" }}>Flow Elite</h2>
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
        </>
      )}
    </section>
  );
}
