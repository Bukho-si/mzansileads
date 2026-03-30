import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
  });
  try {
    const { niche, location } = await req.json();

    if (!niche || !location) {
      return NextResponse.json({ error: 'Missing niche or location' }, { status: 400 });
    }

    // Following exactly the Gemini prompt logic from the user's slide
    const prompt = `
I am acting as a digital marketing agency owner in ${location}. I need to build a high-quality prospecting list for the niche: ${niche}.
Please use your internal knowledge to list 5 highly plausible, active local SME businesses in ${location} fitting this criteria. Do NOT include large franchises or national chains; focus on local SMBs with established websites.

For each lead, organize the data into an array of objects structured EXACTLY like this JSON format:
{
  "leads": [
    {
      "businessName": "Name of Business",
      "websiteURL": "https://example.com",
      "niche": "${niche}",
      "decisionMaker": "Owner / General Manager",
      "auditHook": "Briefly analyze their likely digital presence (website quality, likely SEO gaps, social media activity) and suggest one specific high-value service I should pitch them (e.g., 'Website is non-responsive; pitch a redesign' or 'Low Google Review count; pitch Reputation Management').",
      "phoneNumber": "Public Phone Number from Google Business Profile",
      "coldEmail": "Write a custom 2-sentence 'cold email opener' referencing the specific weakness you identified in the audit hook."
    }
  ]
}

Ensure the response is STRICTLY valid JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost effective for prospecting!
      messages: [{ role: "system", content: "You are a lead generation assistant. Return ONLY a valid JSON object." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const aiResponse = completion.choices[0].message.content;
    const report = JSON.parse(aiResponse || '{"leads": []}');

    return NextResponse.json(report);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}    
