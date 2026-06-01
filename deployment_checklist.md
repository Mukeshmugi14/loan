# Production Deployment Checklist: Neofi-Loan App

Follow this checklist to ensure that all environment variables are correctly configured and verified prior to production deployment.

## 1. Secrets Generation
- [ ] **Generate cryptographically secure keys** for your JWT secrets. Do not reuse development secrets in production.
  * Generate using Node:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```
- [ ] Set `JWT_SECRET` in `.env.production` to the generated access token key.
- [ ] Set `JWT_REFRESH_SECRET` in `.env.production` to the generated refresh token key.

## 2. MongoDB Atlas Configuration
- [ ] **IP Whitelisting**: Ensure your production servers (or your PaaS provider's IP range) are whitelisted in the MongoDB Atlas Network Access console.
- [ ] **URL Encoding**: If your production database password contains special characters (e.g., `@`, `/`, `+`), ensure they are URL-encoded in the `MONGODB_URI` (e.g., `@` becomes `%40`).

## 3. Google OAuth Configuration
- [ ] **Authorized JavaScript Origins**: Log into Google Cloud Console, navigate to APIs & Services > Credentials, edit your OAuth Client, and add your production frontend URL (e.g. `https://loan.neofi.com`) under **Authorized JavaScript Origins**.
- [ ] **Authorized Redirect URIs**: Ensure redirect URIs for Google Login are updated to include production domain paths if applicable.
- [ ] Set both `GOOGLE_CLIENT_ID` (backend) and `VITE_GOOGLE_CLIENT_ID` (frontend) to the same client ID.
- [ ] Set `GOOGLE_CLIENT_SECRET` on the backend.

## 4. SMTP / OTP Email Configuration
- [ ] **App Passwords**: If using Gmail, do NOT use your master password. Generate an App Password in your Google Account settings (Security > 2-Step Verification > App passwords) and paste it into `EMAIL_PASSWORD` (16 letters).
- [ ] Set `EMAIL_FROM` to matches your verified sending domain (e.g. `"MSMERAISE Auth <support@neofi.com>"`).
- [ ] **SMTP SSL/TLS Ports**: Use port `465` for SSL or `587` for STARTTLS.

## 5. Security & Network Config
- [ ] Set `NODE_ENV` to `production`.
- [ ] Set `CORS_ORIGIN` to your exact frontend domain URL (e.g., `https://loan.neofi.com`). Avoid wildcard `*` origins.
- [ ] Set `BCRYPT_ROUNDS` to `12` or higher (increase security while ensuring CPU latency is acceptable).
- [ ] Set `OTP_LENGTH` to `6` (recommended) or higher.
- [ ] Ensure HTTPS/SSL is active on both frontend and backend server hosts.

## 6. Pre-Flight Verification Checks
- [ ] Start the backend server with production environment variables to verify that the startup validation middleware passes.
- [ ] Trigger the health check API endpoint `/api/auth/health` to confirm that:
  - Database status is `connected`
  - SMTP status is `connected`
  - Google OAuth status is `configured`
