 "use client";

import { useState } from "react";
import { UploadCloud, Brain, BarChart3, Activity, Sparkles, User, Home } from "lucide-react";

export default function HomePage() {
  const [tab, setTab] = useState("chart");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("نتيجة التحليل تظهر هنا.");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult("تم رفع الصورة. اضغط حلل الآن.");
  }

  async function analyze() {
    if (!file) {
      setResult("ارفع صورة الشارت أولاً.");
      return;
    }

    setLoading(true);
    setResult("جاري قراءة الشارت وتحليل السيولة والهيكل...");

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: data });
      const json = await res.json();
      setResult(json.analysis || "لم تصل نتيجة تحليل.");
    } catch {
      setResult("تعذر الاتصال بالمحرك. تأكد من إضافة OPENAI_API_KEY عند النشر.");
    } finally {
      setLoading(false);
    }
  }

  function ask() {
    if (!question.trim()) return;
    setResult(`سؤال المحلل:
${question}

سيتم ربط هذه الصفحة في المرحلة القادمة بنفس الشارت المرفوع، بحيث يجاوب المحلل اعتماداً على ICT فقط.`);
    setTab("chart");
  }

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
        <div className="pill">ICT</div>
      </header>

      <section className="hero">
        <small>ارفع الشارت فقط</small>
        <h2>تحليل ذكي بمنهج السيولة والهيكل</h2>
        <div className="ai-box">
          يتعرف النظام على الأصل والفريم من الصورة، ثم يحلل الشارت وفق MSS و Liquidity و FVG و OB فقط.
        </div>
      </section>

      <section className="grid">
        <div className="mini"><b>A+</b><span>نموذج مكتمل</span></div>
        <div className="mini"><b>ICT</b><span>بدون مؤشرات</span></div>
      </section>

      <div className="tabs">
        <button className={`tab ${tab === "chart" ? "active" : ""}`} onClick={() => setTab("chart")}>الشارت</button>
        <button className={`tab ${tab === "advisor" ? "active" : ""}`} onClick={() => setTab("advisor")}>المحلل</button>
        <button className={`tab ${tab === "stats" ? "active" : ""}`} onClick={() => setTab("stats")}>الأداء</button>
      </div>

      <section className={`card ${tab !== "chart" ? "hidden" : ""}`}>
        <div className="card-title">
          <div className="icon"><UploadCloud size={23}/></div>
          <h3>تحليل الشارت</h3>
        </div>

        <label className="upload">
          <input type="file" accept="image/*" onChange={onFile}/>
          <div>
            <UploadCloud size={36}/>
            <p>اضغط هنا لرفع صورة الشارت</p>
          </div>
        </label>

        {preview && <img className="preview" src={preview} style={{display:"block"}} alt="chart preview"/>}

        <button className="btn" onClick={analyze} disabled={loading}>
          {loading ? "جاري التحليل..." : "حلل الآن"}
        </button>

        <div className={`result ${result === "نتيجة التحليل تظهر هنا." ? "empty" : ""}`}>{result}</div>
      </section>

      <section className={`card ${tab !== "advisor" ? "hidden" : ""}`}>
        <div className="card-title">
          <div className="icon"><Brain size={23}/></div>
          <h3>اسأل المحلل</h3>
        </div>
        <textarea value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="مثال: هل النموذج مكتمل؟ وين السيولة المستهدفة؟"/>
        <button className="btn" onClick={ask}>اسأل الآن</button>
      </section>

      <section className={`card ${tab !== "stats" ? "hidden" : ""}`}>
        <div className="card-title">
          <div className="icon"><Activity size={23}/></div>
          <h3>الأداء</h3>
        </div>
        <div className="result">
          <span className="grade">A+</span>
          {"\n"}النموذج المكتمل يحتاج Sweep + MSS + Displacement + FVG + OB + Kill Zone.
          {"\n\n"}أي نموذج ناقص يظهر بدرجة أقل أو يرفضه المحرك.
        </div>
      </section>

      <nav className="bottom">
        <button className={`navbtn ${tab === "chart" ? "active" : ""}`} onClick={()=>setTab("chart")}><Home size={20}/>الرئيسية</button>
        <button className={`navbtn ${tab === "advisor" ? "active" : ""}`} onClick={()=>setTab("advisor")}><Brain size={20}/>المحلل</button>
        <button className={`navbtn ${tab === "stats" ? "active" : ""}`} onClick={()=>setTab("stats")}><BarChart3 size={20}/>الأداء</button>
        <button className="navbtn"><User size={20}/>الحساب</button>
      </nav>
    </main>
  );
}
