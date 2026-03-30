import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" });
  try {
    const { id, business, website } = await req.json();

    if (!website) return NextResponse.json({ error: "No website provided" }, { status: 400 });

    // Ensure proper URL formatting for Firecrawl
    let targetUrl = website;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    // 1. Scrape the website using Firecrawl
    const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({ url: targetUrl, formats: ["markdown"] }),
    });

    const scrapeData = await scrapeRes.json();
    const markdown = scrapeData.data?.markdown || "";

    if (!markdown || markdown.trim() === "") {
      return NextResponse.json({ error: "insufficient_data" }, { status: 400 });
    }

    // 2. Process with OpenAI
    const prompt = `
      You are a high-level digital marketing auditor. Please analyze the following website content for the local business: "${business}" at "${website}".
      
      Website Content:
      ${markdown.substring(0, 12000)}

      Return ONLY a JSON object structured exactly like this (no markdown ticks):
      {
        "score": "A percentage (e.g., '44%') evaluating their digital presence",
        "problem": "One critical issue (e.g., 'No clear WhatsApp or lead capture')",
        "solution": "The best high-value fix (e.g., 'Add WhatsApp CTA + fast mobile page')",
        "whatsapp": "A customized 2-sentence cold outreach message referencing this exact business and the critical issue found."
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a specialized lead auditor. Respond in pure JSON only." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const aiResponse = completion.choices[0].message.content;
    const finalReport = JSON.parse(aiResponse || "{}");

    // On audit completion: Update lead status = "analyzed"
    try {
      if (id && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        await supabaseAdmin
          .from("mzansi_leads")
          .update({ 
            status: "analyzed",
            audit_json: finalReport
          })
          .eq("id", id);
      }
    } catch (e) {
      console.error("Non-fatal Supabase update error:", e);
    }

    // 3. Return the fully formed report!
    return NextResponse.json(finalReport);

  } catch (err: any) {
    console.error("Audit Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
