const express = require('express');
const cors = require('cors');
require('dotenv').config(); // ✅ This line is critical
const authRoutes = require('./routes/auth');

const app = express();
const FRONTEND_URL = 'https://registrationlogin-frontend.onrender.com';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend running with local JSON DB!');
});

app.use('/', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
