import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const image = form.get("image") as File | null;
    if (!image) return NextResponse.json({ analysis: "لم يتم رفع صورة." }, { status: 400 });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ analysis: `نسخة تجريبية.\n\nلا يوجد رصيد API حالياً، لذلك التحليل الحقيقي غير مفعل.\n\nعند تفعيل API سيحلل المحرك السيولة و MSS و BOS و CHOCH و FVG و IFVG و OB و Premium و Discount.` });
    const bytes = await image.arrayBuffer(); const buffer = Buffer.from(bytes); const base64 = buffer.toString("base64"); const mime = image.type || "image/png";
    const client = new OpenAI({ apiKey });
    const prompt = `أنت محلل ICT عربي خاص بأكاديمية فلو. حلل صورة الشارت وفق ICT فقط. ممنوع استخدام المؤشرات التقليدية. اكتب بالعربية فقط: نظرة السوق، الأصل والفريم، الاتجاه العام، الاتجاه المحلي، السيولة، الهيكل، مناطق ICT، السيناريوهات، فرص السكالب والسوينغ، الرؤية المؤسساتية، درجة النموذج.`;
    const response = await client.chat.completions.create({ model:"gpt-4o-mini", messages:[{role:"user", content:[{type:"text", text:prompt},{type:"image_url", image_url:{url:`data:${mime};base64,${base64}`}}]}], temperature:0.25 });
    return NextResponse.json({ analysis: response.choices[0]?.message?.content || "لم يتم توليد تحليل." });
  } catch { return NextResponse.json({ analysis: "حدث خطأ أثناء التحليل." }, { status: 500 }); }
}
