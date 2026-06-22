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

        {selectedSignal.access === "vip" && (
          <span style={{ color: "#facc15" }}>VIP</span>
        )}
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
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <button
          className={signalsTab === "radar" ? "btn" : "btn-dark"}
          onClick={() => setSignalsTab("radar")}
        >
          <Radar size={16} /> Market Radar
        </button>

        <button
          className={signalsTab === "vip" ? "btn" : "btn-dark"}
          onClick={() => setSignalsTab("vip")}
        >
          <Star size={16} /> Flow VIP
        </button>
      </div>

      {signalsTab === "radar" && (
        <>
          <div
            className="result"
            style={{
              marginBottom: "14px",
              background: "#061225",
              border: "1px solid #17365d",
            }}
          >
            <h4>Market Radar</h4>
            <p>
              مراقبة إشارات القنوات الاحترافية. عدد القنوات المفعلة:{" "}
              {signalProviders.length}
            </p>
          </div>

          {providerSignals.length === 0 ? (
            <div className="result">لا توجد إشارات قنوات حالياً</div>
          ) : (
            providerSignals.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#08162e",
                  border: "1px solid #0b4f8a",
                  borderRadius: "18px",
                  padding: "18px",
                  marginBottom: "14px",
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
                    📡 {item.provider_name}
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
                    lineHeight: "1.8",
                    color: "#e5e7eb",
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
          <div
            className="result"
            style={{
              marginBottom: "14px",
              background: "#111827",
              border: "1px solid #facc15",
            }}
          >
            <h4>Flow VIP</h4>
            <p>إشارات أكاديمية فلو الرسمية والحصرية.</p>
          </div>

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
                    borderRadius: "18px",
                    padding: "20px",
                    marginBottom: "16px",
                    opacity: isVip ? 0.75 : 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: statusColor }}>{statusLabel}</span>
                    {isVip && <span style={{ color: "#facc15" }}>VIP</span>}
                  </div>

                  {isVip ? (
                    <div style={{ textAlign: "center", padding: "25px 0" }}>
                      <h2 style={{ color: "#facc15" }}>إشارة VIP</h2>
                      <p style={{ color: "#94a3b8" }}>
                        الترقية مطلوبة للوصول
                      </p>
                      <button
                        className="btn-dark"
                        onClick={() => setTab("plans")}
                      >
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
