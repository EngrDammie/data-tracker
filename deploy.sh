#!/bin/bash
# Deploy Data Tracker to Railway - Run this on your local machine

echo "🚀 Deploying Data Expiry Tracker to Railway..."

# 1. Install Railway CLI
npm install -g railway

# 2. Login (opens browser)
railway login

# 3. Initialize project
railway init
# Choose "Empty Project" when prompted
# Name it: data-tracker

# 4. Deploy
railway up

# 5. Set environment variables (replace with your values)
railway env set TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN"
railway env set TELEGRAM_CHAT_ID="YOUR_CHAT_ID"

# 6. Get your URL
railway domain

echo "✅ Deployment complete!"
echo "📱 Open your app at: https://data-tracker.up.railway.app"
echo ""
echo "📝 To set up hourly reminders:"
echo "   1. Go to Railway dashboard"
echo "   2. Find your project → Jobs"
echo "   3. Create a new job that runs 'npm run reminder' every hour"
