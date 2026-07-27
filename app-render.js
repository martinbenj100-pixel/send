import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Servir l'HTML
  if (req.url === "/" && req.method === "GET") {
    try {
      const htmlPath = path.join(__dirname, "index-with-backend.html");
      const html = fs.readFileSync(htmlPath, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch (err) {
      console.error("Error loading HTML:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Error loading index.html" }));
    }
    return;
  }

  // API pour envoyer les emails
  if (req.url === "/api/send" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const { apiKey, from, to, subject, html, body: emailBody } = data;

        console.log(`[${new Date().toLocaleTimeString()}] Sending email to ${to}`);

        if (!apiKey) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "API key missing" }));
          return;
        }

        if (!from || !to || !subject || !emailBody) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Missing required fields" }));
          return;
        }

        try {
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

          const responseText = await response.text();
          console.log(`[${new Date().toLocaleTimeString()}] Resend response:`, responseText);

          let result;
          try {
            result = JSON.parse(responseText);
          } catch (e) {
            console.error("Failed to parse Resend response:", responseText);
            res.writeHead(500);
            res.end(JSON.stringify({ 
              error: "Invalid response from Resend API",
              details: responseText
            }));
            return;
          }

          res.writeHead(200);
          res.end(JSON.stringify(result));
        } catch (fetchErr) {
          console.error("Fetch error:", fetchErr.message);
          res.writeHead(500);
          res.end(JSON.stringify({ error: fetchErr.message }));
        }
      } catch (err) {
        console.error("Error parsing request:", err.message);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON: " + err.message }));
      }
    });

    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`🚀 NeonMail Pro running on port ${PORT}`);
  console.log(`📧 Visit http://localhost:${PORT}`);
});
