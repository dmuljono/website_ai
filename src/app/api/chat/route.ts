export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { runWorkflow } from "@/lib/agents/runDanielTwin";
import { redis } from "@/lib/redis";

function sseEvent(name: string, data: any) {
  return `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

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

        const assistantText = result.output ?? "";

        // Send final response to client
        send("final", { text: assistantText });

        // Persist to Redis (non-blocking safe await)
        if (sessionId && lastUser && assistantText) {
          const key = `dt:chat:${sessionId}`;
          const record = {
            user: lastUser,
            assistant: assistantText,
            ts: Date.now(),
          };

          try {
            await redis.rpush(key, JSON.stringify(record));
            await redis.ltrim(key, -100, -1); // keep last 100 QAs
          } catch (err) {
            console.error("Redis persist error:", err);
          }
        }

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
