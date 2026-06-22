import { GraduationCap } from "lucide-react";

type AcademyPageProps = {
  news: any[];
  academyPosts: any[];
  academyTab: string;
  setAcademyTab: (value: string) => void;
  selectedNews: any;
  setSelectedNews: (value: any) => void;
  selectedPost: any;
  setSelectedPost: (value: any) => void;
  isVIP: boolean;
  setTab: (value: string) => void;
};

export default function AcademyPage({
  news,
  academyPosts,
  academyTab,
  setAcademyTab,
  selectedNews,
  setSelectedNews,
  selectedPost,
  setSelectedPost,
  isVIP,
  setTab,
}: AcademyPageProps) {
  if (selectedNews) {
    return (
      <section className="card">
        <button
          className="btn-dark"
          onClick={() => setSelectedNews(null)}
          style={{ marginBottom: "15px" }}
        >
          ← رجوع
        </button>

        <h2>{selectedNews.title}</h2>

        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.9",
            color: "#cbd5e1",
          }}
        >
          {selectedNews.content}
        </div>
      </section>
    );
  }

  if (selectedPost) {
    return (
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
    );
  }

  return (
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
                academyTab === item.id ? `0 0 20px ${item.color}40` : "none",
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
            <div
              key={item.id}
              className="result"
              onClick={() => setSelectedNews(item)}
              style={{ cursor: "pointer" }}
            >
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
  );
}
