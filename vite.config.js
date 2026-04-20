import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import chatHandler from "./api/chat.js";
import leadHandler from "./api/lead.js";

function localChatApiPlugin() {
  const routes = {
    "/api/chat": chatHandler,
    "/api/lead": leadHandler,
  };

  return {
    name: "local-chat-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || "").split("?")[0];
        const routeEntry = Object.entries(routes).find(
          ([route]) => pathname === route || pathname === `${route}/`
        );

        if (!routeEntry) {
          return next();
        }

        const [, routeHandler] = routeEntry;

        try {
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(Buffer.from(chunk));
          }

          const rawBody = Buffer.concat(chunks).toString("utf8").trim();
          const parsedBody = rawBody ? JSON.parse(rawBody) : {};

          const mockReq = {
            method: req.method,
            headers: req.headers,
            url: pathname,
            body: parsedBody,
          };

          const mockRes = {
            statusCode: 200,
            status(code) {
              this.statusCode = code;
              return this;
            },
            json(payload) {
              res.statusCode = this.statusCode || 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(payload));
              return this;
            },
          };

          await routeHandler(mockReq, mockRes);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: error?.message || "Local API middleware failed.",
            })
          );
        }

        return undefined;
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [react(), localChatApiPlugin()],
  };
});
