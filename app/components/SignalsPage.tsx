import { Radio } from "lucide-react";

type SignalsPageProps = {
  signals: any[];
  selectedSignal: any;
  setSelectedSignal: (value: any) => void;
  setTab: (value: string) => void;
};

export default function SignalsPage({
  signals,
  selectedSignal,
  setSelectedSignal,
  setTab,
}: SignalsPageProps) {
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
  );
}
