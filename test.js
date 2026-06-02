// SMTP connection tester — run with: node test.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const required = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD'];
const missing = required.filter((k) => !process.env[k]);

if (missing.length > 0) {
  console.error('❌ Missing .env variables:', missing.join(', '));
  console.error('   Copy .env.example to .env and fill in your values.');
  process.exit(1);
}

console.log('🔍 Testing SMTP connection with:');
console.log('   HOST:', process.env.EMAIL_HOST);
console.log('   PORT:', process.env.EMAIL_PORT);
console.log('   USER:', process.env.EMAIL_USER);
console.log('   PASS:', process.env.EMAIL_PASSWORD ? '✓ (set)' : '✗ (missing)');
console.log('');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   → Wrong EMAIL_HOST or EMAIL_PORT');
    } else if (error.responseCode === 535 || error.responseCode === 534) {
      console.error('   → Wrong password. Gmail users: use an App Password');
      console.error('     https://myaccount.google.com/apppasswords');
    }
  } else {
    console.log('✅ SMTP connection successful! Your email config is working.');
  }
});
