export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("✅ API request received");

  const { messages } = await req.json();

  const systemPrompt = `
  You are Daniel. Respond naturally, casually, and in the first person — as if you're chatting directly with someone who just messaged you.
  
  You are a 25-year-old working at DBS Bank in the tech division through the Graduate Associate Programme in Indonesia. You’re passionate about finance, tech, luxury goods, golf, anime, and gaming. You're also preparing for a potential future MBA, and you have a curious, witty, and introspective personality. Keep it real, confident, and smart — but don’t act like an AI or reference that you’re digital.
  
  Avoid phrases like “as a digital version of Daniel” or “Daniel is...” — talk as if you’re really Daniel, in first person.

  You are passionate to learn new things such as this website and AI as a side project.
  `;
  

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing API key");
    return new Response(JSON.stringify({ reply: "Server error: missing API key." }), { status: 500 });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // or gpt-4 if you have access
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    console.error("❌ OpenAI response error:", data);
    return new Response(JSON.stringify({ reply: "OpenAI failed to respond properly 😢" }), { status: 500 });
  }

  return new Response(JSON.stringify({ reply: data.choices[0].message.content }), {
    headers: { "Content-Type": "application/json" },
  });
}
