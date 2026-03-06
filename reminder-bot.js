/**
 * Data Expiry Reminder Bot
 * Checks for expiring data and sends Telegram reminders
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');
const STATE_FILE = path.join(__dirname, 'reminder-state.json');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Reminder thresholds (in days)
const REMIND_BEFORE = [3, 1];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return [];
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) {}
  return { reminded: {} };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function getExpiringPlans(data, daysThreshold) {
  const now = new Date();
  return data.filter(plan => {
    const expiryDate = new Date(plan.expiryDate);
    const daysLeft = (expiryDate - now) / (1000 * 60 * 60 * 24);
    return daysLeft >= 0 && daysLeft <= daysThreshold;
  });
}

function formatExpiryDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function sendTelegramMessage(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured. Message:', message);
    return false;
  }
  
  try {
    const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    const result = await resp.json();
    return result.ok;
  } catch (e) {
    console.error('Telegram error:', e);
    return false;
  }
}

async function checkAndRemind() {
  console.log('🔍 Checking for expiring data...');
  
  const data = loadData();
  if (!data || data.length === 0) {
    console.log('No data plans found');
    return;
  }
  
  const state = loadState();
  const now = new Date();
  
  for (const threshold of REMIND_BEFORE) {
    const expiring = getExpiringPlans(data, threshold);
    
    for (const plan of expiring) {
      const expiryDate = new Date(plan.expiryDate);
      const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((expiryDate - now) / (1000 * 60 * 60));
      
      const reminderKey = `${plan.id}-${threshold}`;
      const lastReminded = state.reminded[reminderKey] || 0;
      const hoursSinceLastReminded = (now - new Date(lastReminded)) / (1000 * 60 * 60);
      
      // Only remind once per threshold per plan
      if (hoursSinceLastReminded < 24) {
        console.log(`Skipping ${plan.network} ${plan.dataAmount} - already reminded recently`);
        continue;
      }
      
      let timeText = daysLeft > 0 ? `${daysLeft} day${daysLeft > 1 ? 's' : ''}` : `${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}`;
      
      const message = `📱 <b>Data Expiring Soon!</b>

🕐 <b>${timeText} left</b>

📡 Network: ${plan.network}
💾 Data: ${plan.dataAmount}
📱 Phone: ${plan.phone}
💰 Cost: ₦${plan.cost}
📅 Expires: ${formatExpiryDate(plan.expiryDate)}

<i>Renew now to avoid losing your data!</i>`;
      
      const sent = await sendTelegramMessage(message);
      if (sent) {
        console.log(`✅ Reminder sent for ${plan.network} ${plan.dataAmount}`);
        state.reminded[reminderKey] = now.toISOString();
      }
    }
  }
  
  saveState(state);
  console.log('✅ Check complete');
}

// Run if called directly
if (require.main === module) {
  checkAndRemind().then(() => process.exit(0));
}

module.exports = { checkAndRemind };
