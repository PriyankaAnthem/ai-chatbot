import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { prompt } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const today = new Date().toDateString(); // e.g., "Mon Jun 16 2025"
  const context = ""; // Optional: You can populate this with relevant info if needed

  const fullPrompt = context
    ? `Today is ${today}.\n\nContext:\n${context}\n\nQuestion:\n${prompt}`
    : `Today is ${today}.\n\n${prompt}`;

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const chat = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chat.sendMessage(fullPrompt); // ✅ Use fullPrompt here
  const response = result.response.text();

  return new Response(JSON.stringify({ reply: response }), {
    headers: { "Content-Type": "application/json" },
  });
}
