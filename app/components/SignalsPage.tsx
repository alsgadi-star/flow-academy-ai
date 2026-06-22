import { useState } from "react";
import { Radio, Radar, Star } from "lucide-react";

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

  const activeProviders = signalProviders.length;
  const todaySignals = providerSignals.length;

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

        <h2>
          {selectedSignal.symbol} {selectedSignal.direction}
        </h2>

        <p>الدخول: {selectedSignal.entry_price}</p>
        <p>وقف الخسارة: {selectedSignal.sl}</p>
        <p>TP1: {selectedSignal.tp1}</p>
        <p>TP2: {selectedSignal.tp2}</p>
        <p>TP3: {selectedSignal.tp3}</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-title">
        <div className="icon">
          <Radio size={23} />
        </div>
        <h3>الإشارات</h3>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg,#061225,#0b2b3f)",
          border: "1px solid #164e63",
          borderRadius: "22px",
          padding: "18px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, color: "#22d3ee" }}>Market Radar</h2>
            <p style={{ color: "#94a3b8", marginTop: "6px" }}>
              مراقبة إشارات القنوات الاحترافية
            </p>
          </div>

          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "18px",
              background: "#042f2e",
              display: "grid",
              placeItems: "center",
              color: "#14f195",
            }}
          >
            <Radar size={26} />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "10px",
            marginTop: "16px",
          }}
        >
          <div className="mini">
            <b>{activeProviders}</b>
            <span>قنوات مراقبة</span>
          </div>

          <div className="mini">
            <b>{todaySignals}</b>
            <span>إشارة اليوم</span>
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
          📡 Market Radar
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
          ⭐ Flow VIP
        </button>
      </div>

      {signalsTab === "radar" && (
        <>
          {providerSignals.length === 0 ? (
            <div className="result">لا توجد إشارات قنوات حالياً</div>
          ) : (
            providerSignals.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#07182d",
                  border: "1px solid #075985",
                  borderRadius: "20px",
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
                    📩 {item.provider_name}
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

                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.9",
                    color: "#e5e7eb",
                    fontSize: "15px",
                  }}
                >
                  {item.raw_message}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {signalsTab === "vip" && (
        <>
          {signals.length === 0 ? (
            <div className="result">لا توجد إشارات VIP حالياً</div>
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
        </>
      )}
    </section>
  );
}
