const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;
const USERS_FILE = path.join(__dirname, '../data/users.json');

// ✅ Helper: Read users from file
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading users.json:', err);
    return [];
  }
}

// ✅ Helper: Save users to file
function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error writing to users.json:', err);
  }
}

// ✅ Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('[REGISTER]', { username, email });

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const users = readUsers();
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, email, password: hashedPassword };
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: 'User registered successfully.' });
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[LOGIN]', { email });

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({
    message: 'Login successful.',
    token,
    username: user.username
  });
});

// ✅ Protected Profile Route
router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: `Welcome ${decoded.username}` });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;
