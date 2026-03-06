# 🚀 One-Click Deploy to Railway

Since I can't deploy from my sandbox, follow these simple steps:

---

## Option 1: Deploy in 2 Minutes (Easiest)

### Step 1: Go to Railway
Open: **https://railway.app/new**

### Step 2: Connect GitHub
- Click "Login with GitHub"
- Authorize Railway

### Step 3: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose the `data-tracker` repository
4. Railway auto-detects Node.js - click "Deploy"

### Step 4: Add Environment Variables
After deployment:
1. Go to your project → "Variables" tab
2. Add:
   - `TELEGRAM_BOT_TOKEN` = (your bot token from @BotFather)
   - `TELEGRAM_CHAT_ID` = (your chat ID from @userinfobot)
3. Click "Deploy"

### Step 5: Get Your URL
- Go to "Settings" → "Domains"
- Copy your URL (e.g., `https://data-tracker.up.railway.app`)

---

## Option 2: CLI Deployment (If you prefer terminal)

```bash
# Install Railway
npm install -g railway

# Login
railway login

# Link to your project
cd /root/.openclaw/workspace/data-tracker
railway link

# Deploy
railway up

# Set variables
railway env set TELEGRAM_BOT_TOKEN=your_token
railway env set TELEGRAM_CHAT_ID=your_id

# Get URL
railway domain
```

---

## 🔔 Setting Up Hourly Reminders

1. In Railway dashboard → your project
2. Go to "Jobs" tab
3. Click "New Job"
4. Configure:
   - **Name**: `reminder-check`
   - **Command**: `npm run reminder`
   - **Schedule**: `0 * * * *` (every hour)
5. Click "Create Job"

---

## 📱 Using Your Tracker

1. Open your Railway URL
2. Click "Add New"
3. Add your data plans
4. Get Telegram alerts before expiry!

---

## 🔧 Troubleshooting

**App not loading?**
- Check "Deployments" tab for errors
- Make sure `npm start` works locally first

**Reminders not sending?**
- Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set
- Test bot: send `/start` to your bot on Telegram

**Data not persisting?**
- Railway's free tier has ephemeral filesystem
- Use "Persist" volume or upgrade to paid ($5/mo)
- Or use the localStorage fallback (data stays on your device)

---

## Need Help?

Your repo is already created at:
**https://github.com/EngrDammie/data-tracker**

Just deploy from there! 🐝
