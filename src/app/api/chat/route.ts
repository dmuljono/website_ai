export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { runWorkflow } from "@/lib/agents/runDanielTwin";

function sseEvent(name: string, data: any) {
  return `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastUser =
    [...messages].reverse().find((m: any) => m.role === "user")?.content ?? "";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, payload: any) => {
        controller.enqueue(encoder.encode(sseEvent(event, payload)));
      };

      try {
        const result = await runWorkflow({
          input_as_text: lastUser,
          onStatus: (text) => send("status", { text }),
        });

        send("final", { text: result.output });
        controller.close();
      } catch (e) {
        send("error", { text: "Server error generating response." });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
