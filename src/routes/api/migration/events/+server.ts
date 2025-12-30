/**
 * SSE endpoint for real-time migration updates
 *
 * Clients connect via EventSource and receive state updates as they happen.
 * Initial connection sends full state, subsequent updates send only new logs.
 */

import { requireUtCodeMember } from "$lib/server/database/auth.server";
import { migrationActor } from "$lib/server/services/migration/state.server";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  await requireUtCodeMember();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      function cleanup() {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }

      // Send initial state
      const initialState = migrationActor.getState();
      const initEvent = `event: init\ndata: ${JSON.stringify(initialState)}\n\n`;
      controller.enqueue(encoder.encode(initEvent));

      // Subscribe to updates
      const unsubscribe = migrationActor.subscribe((state, newLogs) => {
        if (closed) return;
        try {
          const update = {
            status: state.status,
            startedAt: state.startedAt,
            completedAt: state.completedAt,
            result: state.result,
            error: state.error,
            newLogs,
          };
          const updateEvent = `event: update\ndata: ${JSON.stringify(update)}\n\n`;
          controller.enqueue(encoder.encode(updateEvent));
        } catch {
          cleanup();
        }
      });

      // Send heartbeat every 30s to keep connection alive
      const heartbeat = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(":heartbeat\n\n"));
        } catch {
          cleanup();
        }
      }, 30000);

      // Cleanup on abort
      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store",
      Connection: "keep-alive",
    },
  });
};
