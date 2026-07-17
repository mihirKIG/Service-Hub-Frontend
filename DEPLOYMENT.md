# ServiceHub Frontend - VPS Deployment Guide

## Overview

Every time you push to `main` branch on GitHub, GitHub Actions will automatically:
1. Build the React/Vite project
2. SSH into your VPS
3. Deploy the `dist/` folder
4. Restart Nginx

---

## Step 1: VPS First Time Setup

SSH into your VPS and run these commands once:

```bash
# Create deployment directory
sudo mkdir -p /var/www/frontend/dist
sudo chown -R $USER:$USER /var/www/frontend
```

> Note: Nginx and your backend are already running on this VPS. You only need to create the dist directory.

---

## Step 2: Update Nginx Config

Edit `/etc/nginx/sites-available/servicehub_backend` on your VPS:

- Verify the `root` path is `/var/www/frontend`
- Verify the API port (default: 8000) and WebSocket port (default: 8001) match your backend

```bash
sudo nano /etc/nginx/sites-available/servicehub_backend
sudo nginx -t && sudo systemctl reload nginx
```

---

## Step 3: Add GitHub Secrets

Go to your GitHub repo:
**Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret Name | Value | Example |
|---|---|---|
| `VPS_HOST` | VPS IP address | `123.456.789.0` |
| `VPS_USERNAME` | SSH username | `root` |
| `VPS_PASSWORD` | SSH password | `your_password` |
| `VITE_API_BASE_URL` | Backend API URL | `http://127.0.0.1:8000/api` |
| `VITE_WS_BASE_URL` | WebSocket URL | `ws://127.0.0.1:8001/ws` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key | `pk_live_xxx` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `xxx.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `xxx` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `xxx.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID | `774...` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:xxx:web:xxx` |

---

## Step 4: Deploy

```bash
git add .
git commit -m "your message"
git push origin main
```

GitHub Actions will automatically build and deploy to your VPS.

---

## Step 5: Verify Deployment

Check if the site is live:

```bash
# On your local machine
curl -I http://your-vps-ip

# Or check GitHub Actions logs
# Go to repo → Actions tab → Click on latest workflow run
```

---

## Troubleshooting

### Build fails in GitHub Actions
- Check the **Actions** tab in your GitHub repo
- Click on the failed workflow → expand the failed step
- Common issue: missing environment variables in secrets

### Nginx 502 Bad Gateway
```bash
# On VPS - check if backend is running
sudo systemctl status your-backend-service
# Or check port 8000
sudo lsof -i :8000
```

### Files not updating after push
```bash
# On VPS - check if dist folder has new files
ls -la /var/www/frontend/dist/

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Permission denied on VPS
```bash
sudo chown -R www-data:www-data /var/www/frontend/dist
sudo chmod -R 755 /var/www/frontend/dist
```

### Rollback to previous version
```bash
# On VPS - if new deployment has issues
cd /var/www/frontend
sudo rm -rf dist
sudo mv dist-backup dist
sudo systemctl reload nginx
```

---

## File Structure on VPS

```
/var/www/frontend/
├── dist/                  # Current build (served by Nginx)
├── dist-backup/           # Previous build (backup)
```

---

## How It Works

```
git push origin main
       ↓
GitHub Actions triggers (.github/workflows/deploy.yml)
       ↓
Runs: npm ci → npm run build
       ↓
SSH into VPS (password auth)
       ↓
Backup current dist/ → dist-backup/
       ↓
Copy new dist/ files via SCP
       ↓
Set permissions (www-data:www-data)
       ↓
Nginx reload → Live!
```

---

## Manual Deploy (if needed)

If you need to deploy manually without GitHub Actions:

```bash
# Build locally
npm run build

# Upload dist/ folder to VPS via SCP
scp -r dist/* root@your-vps-ip:/var/www/frontend/dist/

# SSH into VPS and set permissions
ssh root@your-vps-ip
sudo chown -R www-data:www-data /var/www/frontend/dist
sudo chmod -R 755 /var/www/frontend/dist
sudo systemctl reload nginx
```
