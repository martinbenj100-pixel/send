import http from "http";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Servir index.html
  if (req.url === "/" && req.method === "GET") {
    try {
      const html = fs.readFileSync(path.join(process.cwd(), "index-with-backend.html"), "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch (err) {
      res.writeHead(500);
      res.end("Error loading index.html");
    }
    return;
  }

  // API endpoint pour envoyer les emails
  if (req.url === "/api/send" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const { apiKey, from, to, subject, html, body: emailBody } = data;

        if (!apiKey || !from || !to || !subject || !emailBody) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Données manquantes" }));
          return;
        }

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: from,
            to: to,
            subject: subject,
            [html ? "html" : "text"]: emailBody
          })
        });

        const result = await response.json();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error("Error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`🚀 NeonMail Pro running on port ${PORT}`);
  console.log(`📧 Access at http://localhost:${PORT}`);
});
