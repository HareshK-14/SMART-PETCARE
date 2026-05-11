/**
 * SmartPetCare - Auth Server (Node.js)
 * Runs on port 8080 — matches the exact API the frontend expects.
 * Sends REAL verification emails via Gmail SMTP using Nodemailer.
 * Users are stored in auth-users.json (created automatically).
 *
 * Setup:
 *   1. npm install
 *   2. Fill in your Gmail address + App Password below (or in .env)
 *   3. node auth-server.js
 */

const express   = require('express');
const cors      = require('cors');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto    = require('crypto');
const fs        = require('fs');
const path      = require('path');

// ─── Configuration — EDIT THESE ──────────────────────────────────────────────
const CONFIG = {
  GMAIL_USER:     process.env.GMAIL_USER     || 'hareeshraj15@gmail.com',
  GMAIL_PASS:     process.env.GMAIL_PASS     || 'fkkb uwiq iqgw zctx',
  JWT_SECRET:     process.env.JWT_SECRET     || 'SmartPetCare_Secret_Key_2026_XYZ',
  FRONTEND_URL:   process.env.FRONTEND_URL   || 'http://localhost:5173', // Using localhost for stability
  PORT:           process.env.PORT           || 8081,
};
// ─────────────────────────────────────────────────────────────────────────────

const DB_FILE = path.join(__dirname, 'auth-users.json');

// Simple JSON "database"
const db = {
  read() {
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ users: {}, tokens: {} }));
    return JSON.parse(fs.readFileSync(DB_FILE));
  },
  write(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); },
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: CONFIG.GMAIL_USER, pass: CONFIG.GMAIL_PASS },
});

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── POST /api/auth/signup ────────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Full name, email, and password are required.' });
  }

  const data = db.read();

  if (data.users[email.toLowerCase()]) {
    return res.status(400).json({ message: 'Error: Email is already in use!' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomUUID();

  data.users[email.toLowerCase()] = {
    id:               Date.now(),
    email:            email.toLowerCase(),
    fullName,
    phone:            phone || '',
    passwordHash:     hashed,
    role:             (role || 'OWNER').toUpperCase(),
    isEmailVerified:  false,
    createdAt:        new Date().toISOString(),
  };
  data.tokens[verifyToken] = {
    email:      email.toLowerCase(),
    expiresAt:  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  db.write(data);

  // Send verification email
  const verifyUrl = `${CONFIG.FRONTEND_URL}/verify-email?token=${verifyToken}`;
  try {
    await transporter.sendMail({
      from:    `"SmartPetCare" <${CONFIG.GMAIL_USER}>`,
      to:      email,
      subject: '✅ SmartPetCare — Verify your Email Address',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;background:#f9fafb;border-radius:16px;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:40px;">🐾</span>
            <h2 style="color:#1e293b;margin:8px 0 4px;">Welcome to SmartPetCare!</h2>
            <p style="color:#64748b;margin:0;">Hi <strong>${fullName}</strong>, verify your email to get started.</p>
          </div>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}"
               style="display:inline-block;background:linear-gradient(135deg,#6366f1,#14b8a6);color:#fff;font-weight:700;font-size:16px;padding:14px 36px;border-radius:12px;text-decoration:none;">
              ✅ Verify Email Address
            </a>
          </div>
          <p style="color:#94a3b8;font-size:13px;text-align:center;">This link expires in 24 hours.<br>If you did not register, please ignore this email.</p>
          <p style="color:#cbd5e1;font-size:11px;text-align:center;margin-top:24px;">© 2026 SmartPetCare Platform</p>
        </div>
      `,
    });
    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    // User is saved — return success but mention email issue
    return res.json({ message: 'Registered! (Email send failed — check Gmail App Password config)' });
  }

  res.json({ message: 'User registered successfully! Please check your email to verify your account.' });
});

// ── POST /api/auth/verify-email  (POST so crawlers can't pre-consume the token) ────
app.post('/api/auth/verify-email', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Error: No token provided.' });

  const data = db.read();
  const entry = data.tokens[token];

  if (!entry) return res.status(400).json({ message: 'Error: Invalid verification link.' });
  if (new Date(entry.expiresAt) < new Date()) {
    delete data.tokens[token];
    db.write(data);
    return res.status(400).json({ message: 'Error: Verification link has expired. Please register again.' });
  }

  const user = data.users[entry.email];
  if (!user) return res.status(400).json({ message: 'Error: User not found.' });

  user.isEmailVerified = true;
  delete data.tokens[token];
  db.write(data);

  res.json({ message: 'Account successfully verified! You can now log in.' });
});

// ── POST /api/auth/resend-verification ───────────────────────────────────────
app.post('/api/auth/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const data = db.read();
  const user = data.users[email.toLowerCase()];

  if (!user) return res.status(404).json({ message: 'No account found with this email.' });
  if (user.isEmailVerified) return res.status(400).json({ message: 'This email is already verified.' });

  const verifyToken = crypto.randomUUID();
  data.tokens[verifyToken] = {
    email:      email.toLowerCase(),
    expiresAt:  new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  db.write(data);

  const verifyUrl = `${CONFIG.FRONTEND_URL}/verify-email?token=${verifyToken}`;
  try {
    await transporter.sendMail({
      from:    `"SmartPetCare" <${CONFIG.GMAIL_USER}>`,
      to:      email,
      subject: '✅ SmartPetCare — Resend: Verify your Email Address',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;background:#fefce8;border-radius:16px;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:40px;">🐾</span>
            <h2 style="color:#854d0e;margin:8px 0 4px;">Email Verification</h2>
            <p style="color:#a16207;margin:0;">Hi <strong>${user.fullName}</strong>, here is your new verification link.</p>
          </div>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}"
               style="display:inline-block;background:linear-gradient(135deg,#eab308,#ca8a04);color:#fff;font-weight:700;font-size:16px;padding:14px 36px;border-radius:12px;text-decoration:none;">
              ✅ Verify Email Address
            </a>
          </div>
          <p style="color:#a16207;font-size:13px;text-align:center;">This link expires in 24 hours.</p>
          <p style="color:#d97706;font-size:11px;text-align:center;margin-top:24px;">© 2026 SmartPetCare Platform</p>
        </div>
      `,
    });
    res.json({ message: 'A new verification email has been sent to your inbox.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
  }
});

// ── POST /api/auth/signin ────────────────────────────────────────────────────
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const data = db.read();
  const user = data.users[email.toLowerCase()];

  if (!user) return res.status(401).json({ message: 'No account found with this email.' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: 'Incorrect password. Please try again.' });

  if (!user.isEmailVerified) {
    return res.status(401).json({ message: 'Email not verified. Please check your inbox and click the verification link before signing in.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    CONFIG.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, id: user.id, email: user.email, role: user.role });
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'SmartPetCare Auth Server running ✅' }));

app.listen(CONFIG.PORT, () => {
  console.log(`\n🐾 SmartPetCare Auth Server running on http://localhost:${CONFIG.PORT}`);
  console.log(`📧 Gmail: ${CONFIG.GMAIL_USER}`);
  console.log(`🔗 Frontend: ${CONFIG.FRONTEND_URL}\n`);
  if (CONFIG.GMAIL_USER === 'your-gmail@gmail.com') {
    console.warn('⚠️  WARNING: Gmail credentials not configured! Edit CONFIG in auth-server.js\n');
  }
});
