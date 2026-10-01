const express = require("express");
const multer = require("multer");
const TelegramBot = require("node-telegram-bot-api");
const cors = require("cors");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN);
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🤖 E-KENZO Bot is online!\n\n✅ Bot is working."
  );
});
app.post("/order", upload.single("receipt"), async (req, res) => {
  try {
    const {
      orderId,
      roblox,
      telegram,
      packageName,
      price
    } = req.body;

    const message =
`🛒 NEW ORDER

🆔 Order ID: ${orderId}
🎮 Package: ${packageName}
💰 Price: $${price}

👤 Roblox: ${roblox}
📱 Telegram: ${telegram}`;

    await bot.sendMessage(process.env.CHAT_ID, message);

    if (req.file) {
      await bot.sendPhoto(
        process.env.CHAT_ID,
        req.file.buffer,
        {
          caption: `🧾 Receipt - ${orderId}`
        }
      );
    }

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
