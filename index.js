// create-image-api/index.js

const express = require("express");
const fetch = require("node-fetch");
const { createCanvas, loadImage } = require("canvas");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/api/create-image", async (req, res) => {
  try {
    const { url, price } = req.body;
    if (!url || !price) {
      return res.status(400).json({ status: "error", message: "Missing url or price" });
    }

    // Load image from URL
    const image = await loadImage(url);

    // Resize logic
    const desiredWidth = 800;
    const scaleFactor = desiredWidth / image.width;
    const newWidth = desiredWidth;
    const newHeight = image.height * scaleFactor;

    const canvas = createCanvas(newWidth, newHeight);
    const ctx = canvas.getContext("2d");

    // Draw the resized image
    ctx.drawImage(image, 0, 0, newWidth, newHeight);

    // Red border
    ctx.lineWidth = 10;
    ctx.strokeStyle = "red";
    ctx.strokeRect(0, 0, newWidth, newHeight);

    // Black box at bottom-right
    const boxX = newWidth - 250;
    const boxY = newWidth - 350;
    const boxWidth = 250;
    const boxHeight = 120;

    ctx.fillStyle = 'black';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Price text in yellow
    ctx.fillStyle = 'yellow';
    ctx.font = 'bold 90px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(price, boxX + boxWidth / 2, boxY + boxHeight / 2);

    // Outline box with lime stroke
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Convert to base64
    const dataUrl = canvas.toDataURL("image/jpeg");
    res.json({ status: "success", dataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
