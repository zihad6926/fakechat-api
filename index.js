const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = process.env.PORT || 3000;

app.get("/messengerstylechat", async (req, res) => {
  const { name = "Unknown", dp, text = "Hello!" } = req.query;

  if (!dp) return res.status(400).send("Missing profile picture (dp) URL");

  const html = `
  <html>
  <head>
    <style>
      body { background: #000; margin: 0; font-family: Arial; color: white; }
      .chat { display: flex; align-items: flex-start; padding: 20px; }
      .avatar { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; }
      .bubble {
        background: #3a3a3a;
        padding: 10px 15px;
        border-radius: 20px;
        max-width: 300px;
        font-size: 16px;
        position: relative;
      }
      .name { font-size: 14px; color: #aaa; margin-bottom: 4px; }
    </style>
  </head>
  <body>
    <div class="chat">
      <img class="avatar" src="${dp}" />
      <div>
        <div class="name">${name}</div>
        <div class="bubble">${text}</div>
      </div>
    </div>
  </body>
  </html>`;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const imageBuffer = await page.screenshot({ type: "png" });
  await browser.close();

  res.set("Content-Type", "image/png");
  res.send(imageBuffer);
});

app.listen(port, () => {
  console.log(`Fakechat API running at http://localhost:${port}`);
});
