# 📱 Data Expiry Tracker - Backend Edition

Never lose your data again! Track all your data subscriptions in one place and get Telegram reminders before they expire.

## ✨ Features

- 📊 **Track All Data** - Add all your data subscriptions (MTN, Airtel, Glo, 9mobile)
- ⏰ **Expiry Countdown** - See exactly how many days left before expiry
- ⚠️ **Telegram Reminders** - Get notified before your data expires
- 💰 **Cost Tracking** - See how much you spend on data
- 🔄 **Easy Renew** - One-click renewal updates purchase date
- 📱 **Mobile Friendly** - Works perfectly on your phone
- ☁️ **Cloud Sync** - Data stored on server (no localStorage needed)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Telegram (Optional - for reminders)

```bash
export TELEGRAM_BOT_TOKEN="your-bot-token"
export TELEGRAM_CHAT_ID="your-chat-id"
```

To get a bot token: Message @BotFather on Telegram
To get your chat ID: Message @userinfobot or use @getidsbot

### 3. Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

The app will be available at `http://localhost:3000`

## 🔔 Setting Up Reminders

### Option 1: Cron Job (Recommended)

Add to your crontab (`crontab -e`):

```bash
# Run every hour
0 * * * * cd /path/to/data-tracker && npm run reminder
```

### Option 2: PM2 Process Manager

```bash
npm install -g pm2
pm2 start server.js --name data-tracker
pm2 start reminder-bot.js --name data-reminder --cron "0 * * * *"
```

## 📱 Using the App

1. Open the app in your browser
2. Click "Add New" to add a data plan
3. Enter: Network, Phone, Data Amount, Cost, Purchase Date, Validity
4. Click "Add Data Plan"
5. Watch the countdown!

## 🌐 Deployment

### Railway (Free)

```bash
npm install -g railway
railway login
railway init
railway up
```

Set environment variables on Railway dashboard:
- `PORT` (default: 3000)
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

### Render.com (Free)

1. Connect your GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`

### VPS/DigitalOcean

```bash
pm2 start server.js --name data-tracker
pm2 startup  # Follow instructions
pm2 save
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data` | Get all data plans |
| GET | `/api/data/expiring/:days` | Get plans expiring within X days |
| POST | `/api/data` | Add new data plan |
| DELETE | `/api/data/:id` | Delete data plan |
| POST | `/api/data/:id/renew` | Renew (update purchase date) |

### Example: Add Data Plan

```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "network": "MTN",
    "phone": "07053331253",
    "dataAmount": "2GB",
    "cost": 500,
    "purchaseDate": "2026-03-01",
    "validity": 30
  }'
```

## 📁 Project Structure

```
data-tracker/
├── server.js         # Express API server
├── reminder-bot.js   # Telegram reminder script
├── data.json         # Data storage (auto-created)
├── reminder-state.json # Reminder tracking (auto-created)
├── index.html        # Frontend app
├── package.json      # Node dependencies
└── README.md         # This file
```

## 🤝 Contributing

Feel free to fork and improve this app!

---

Made with ❤️ by **Engr. Dammie Optimus**

*Built by BumbleBee 🐝*
