import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const image = form.get("image") as File | null;
    const userId = form.get("user_id") as string | null;

    if (!image) {
      return NextResponse.json({ analysis: "لم يتم رفع صورة." }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mime = image.type || "image/png";

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const demoAnalysis = `نسخة تجريبية جاهزة للنشر.

أضف OPENAI_API_KEY في إعدادات Vercel حتى يعمل التحليل الحقيقي.

القالب المعتمد:
نظرة السوق
التعرف على الأصل والفريم
الاتجاه العام
الاتجاه المحلي
السيولة المستهدفة
الهيكل السعري
مناطق FVG
مناطق OB
السيناريو الصاعد
السيناريو الهابط
فرصة السكالب
فرصة السوينغ
الرؤية المؤسساتية
درجة النموذج`;

      await saveAnalysis(userId, demoAnalysis, "demo", "unknown");

      return NextResponse.json({ analysis: demoAnalysis });
    }

    const client = new OpenAI({ apiKey });

    const prompt = `
أنت محلل ICT عربي خاص بأكاديمية فلو.
حلل صورة الشارت فقط وفق ICT.
ممنوع استخدام RSI أو MACD أو Moving Average أو Bollinger Bands أو النماذج الكلاسيكية.

المطلوب:
1. حاول التعرف على الأصل والفريم من الصورة.
2. حلل السيولة: BSL, SSL, Equal Highs, Equal Lows, Sweep.
3. حلل الهيكل: MSS, BOS, CHoCH.
4. حدد FVG, IFVG, OB, Breaker, Mitigation إذا ظهرت بوضوح.
5. حدد Dealing Range, Premium, Discount إذا أمكن.
6. اذكر السيناريو الصاعد والهابط.
7. اذكر فرصة سكالب وفرصة سوينغ فقط إذا النموذج واضح.
8. أعط درجة النموذج: A+ أو A أو B أو C.
9. إذا لا توجد فرصة واضحة قل: لا توجد فرصة ICT عالية الجودة حالياً.

اكتب بالعربية فقط وبنفس الترتيب:
نظرة السوق
الأصل والفريم
الاتجاه العام
الاتجاه المحلي
السيولة المستهدفة
الهيكل السعري
مناطق ICT
السيناريو الصاعد
السيناريو الهابط
فرصة السكالب
فرصة السوينغ
الرؤية المؤسساتية
درجة النموذج
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${mime};base64,${base64}` },
            },
          ],
        },
      ],
      temperature: 0.25,
    });

    const analysis =
      response.choices[0]?.message?.content || "لم يتم توليد تحليل.";

    const symbol = extractField(analysis, "الأصل والفريم") || "unknown";
    const timeframe = extractTimeframe(analysis) || "unknown";

    await saveAnalysis(userId, analysis, symbol, timeframe);

    return NextResponse.json({ analysis });
  } catch (e) {
    return NextResponse.json(
      { analysis: "حدث خطأ أثناء التحليل." },
      { status: 500 }
    );
  }
}

function extractField(text: string, label: string) {
  const lines = text.split("\n");
  const index = lines.findIndex((line) => line.includes(label));
  if (index === -1) return "";
  return lines[index + 1]?.trim() || "";
}

function extractTimeframe(text: string) {
  const match = text.match(/\b(1M|5M|15M|30M|1H|4H|D1|Daily|H4|M1|M5|M15)\b/i);
  return match?.[0] || "";
}

async function saveAnalysis(
  userId: string | null,
  result: string,
  symbol: string,
  timeframe: string
) {
  if (!userId) return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return;

  await fetch(`${supabaseUrl}/rest/v1/analyses`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      user_id: userId,
      analysis_type: "chart",
      symbol,
      timeframe,
      result,
    }),
  });
}
