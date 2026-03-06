const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static('.'));

// Load data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

// Save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all data plans
app.get('/api/data', (req, res) => {
  const data = loadData();
  const now = new Date();
  
  const processed = data.map(plan => {
    const expiryDate = new Date(plan.expiryDate);
    const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return { ...plan, daysLeft };
  });
  
  res.json(processed);
});

// Add new data plan
app.post('/api/data', (req, res) => {
  const { network, phone, dataAmount, cost, purchaseDate, purchaseTime, validity } = req.body;
  
  // Calculate expiry date with time
  const purchaseDateTime = purchaseTime 
    ? new Date(purchaseDate + 'T' + purchaseTime)
    : new Date(purchaseDate + 'T00:00');
  purchaseDateTime.setDate(purchaseDateTime.getDate() + parseInt(validity));
  
  const newPlan = {
    id: Date.now().toString(),
    network,
    phone,
    dataAmount,
    cost: parseFloat(cost),
    purchaseDate,
    purchaseTime: purchaseTime || '00:00',
    validity: parseInt(validity),
    expiryDate: purchaseDateTime.toISOString(),
    createdAt: new Date().toISOString()
  };
  
  const data = loadData();
  data.push(newPlan);
  saveData(data);
  
  res.json(newPlan);
});

// Delete data plan
app.delete('/api/data/:id', (req, res) => {
  const data = loadData();
  const filtered = data.filter(p => p.id !== req.params.id);
  saveData(filtered);
  res.json({ success: true });
});

// Renew data plan (update purchase date to today)
app.post('/api/data/:id/renew', (req, res) => {
  const data = loadData();
  const index = data.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  const today = new Date().toISOString().split('T')[0];
  data[index].purchaseDate = today;
  
  const expiryDate = new Date(today);
  expiryDate.setDate(expiryDate.getDate() + data[index].validity);
  data[index].expiryDate = expiryDate.toISOString();
  
  saveData(data);
  res.json(data[index]);
});

// Get expiring soon (within days)
app.get('/api/data/expiring/:days', (req, res) => {
  const data = loadData();
  const now = new Date();
  const days = parseInt(req.params.days);
  
  const expiring = data.filter(plan => {
    const expiryDate = new Date(plan.expiryDate);
    const daysLeft = (expiryDate - now) / (1000 * 60 * 60 * 24);
    return daysLeft >= 0 && daysLeft <= days;
  });
  
  res.json(expiring);
});

app.listen(PORT, () => {
  console.log(`Data Tracker API running on port ${PORT}`);
});
