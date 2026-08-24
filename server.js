const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 10000;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function send(res, status, type, data) {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store"
  });
  res.end(data);
}

function serveFile(res, file) {
  fs.readFile(file, (err, data) => {
    if (err) {
      send(
        res,
        404,
        "text/plain; charset=utf-8",
        "404 - File Not Found"
      );
      return;
    }

    const ext = path.extname(file).toLowerCase();
    send(res, 200, MIME[ext] || "application/octet-stream", data);
  });
}

const server = http.createServer((req, res) => {
  let requestPath;

  try {
    requestPath = decodeURIComponent(req.url.split("?")[0]);
  } catch {
    send(res, 400, "text/plain; charset=utf-8", "Bad request");
    return;
  }

  // Health check for Render
  if (requestPath === "/health") {
    send(
      res,
      200,
      "application/json; charset=utf-8",
      JSON.stringify({
        status: "online",
        system: "SIN̄U CYBERPUNK VOICE PANEL",
        mode: "browser-native",
        api: false,
        time: new Date().toISOString()
      })
    );
    return;
  }

  // Basic server information
  if (requestPath === "/api/status") {
    send(
      res,
      200,
      "application/json; charset=utf-8",
      JSON.stringify({
        online: true,
        database: "LOCAL",
        voice: "BROWSER",
        aiMode: "LOCAL COMMAND ENGINE",
        apiRequired: false,
        serverTime: new Date().toISOString()
      })
    );
    return;
  }

  if (requestPath === "/" || requestPath === "/admin") {
    serveFile(
      res,
      path.join(ROOT, "admin_cyberpunk_ai_voice.html")
    );
    return;
  }

  // Static files
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const file = path.join(ROOT, safePath);

  if (!file.startsWith(ROOT)) {
    send(res, 403, "text/plain; charset=utf-8", "Forbidden");
    return;
  }

  serveFile(res, file);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("======================================");
  console.log(" SINU CYBERPUNK ADMIN SERVER");
  console.log("======================================");
  console.log("PORT:", PORT);
  console.log("MODE: Browser Native Voice");
  console.log("API : Disabled");
  console.log("URL : http://localhost:" + PORT);
  console.log("======================================");
});