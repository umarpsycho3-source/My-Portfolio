# 🚀 Quick Security Setup for Render.com

## Step 1: Prepare Environment Variables

Create a `.env` file locally (don't commit to git):

```env
NODE_ENV=production
PORT=5678
ADMIN_EMAIL=your-email@gmail.com
ADMIN_PASSWORD=YourStrongPassword123!
CONTACT_PHONE=+1-234-567-8900
CONTACT_WHATSAPP=1234567890
CONTACT_EMAIL=your-email@gmail.com
ALLOWED_ORIGIN=https://my-portfolio-zdd8.onrender.com
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&)

❌ Bad: `password123` or `MyPassword`  
✅ Good: `Tr0ub4dour&Uygg7^*Hj9` or `MyP@ssw0rd!`

## Step 2: Add to .gitignore

Ensure `.env` is never committed:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

Verify:
```bash
git status
# Should NOT show .env file
```

## Step 3: Configure Render Dashboard

### 3.1 Go to Environment Variables

1. Open your Render dashboard
2. Select your portfolio service
3. Click **Settings** → **Environment**

### 3.2 Add Environment Variables

Copy all variables from your `.env` file:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `ADMIN_EMAIL` | `your-email@gmail.com` |
| `ADMIN_PASSWORD` | `YourStrongPassword123!` |
| `CONTACT_PHONE` | `+1-234-567-8900` |
| `CONTACT_WHATSAPP` | `1234567890` |
| `CONTACT_EMAIL` | `your-email@gmail.com` |
| `ALLOWED_ORIGIN` | `https://my-portfolio-zdd8.onrender.com` |

### 3.3 Save and Deploy

1. Click **Save Changes**
2. Render automatically redeploys your service
3. Wait for deployment to complete (2-3 minutes)

## Step 4: Test Your Setup

### 4.1 Test HTTPS
```
https://my-portfolio-zdd8.onrender.com
```

Should show:
- ✅ Green lock icon in browser
- ✅ Portfolio loads without errors

### 4.2 Test Login

1. Open **Admin Panel** (if available at `/admin` or similar)
2. Enter credentials from environment variables
3. Should login successfully

### 4.3 Test Rate Limiting

1. Submit hire request
2. Immediately submit another
3. Should see rate limit message after 10 requests per hour

### 4.4 Test Security Headers

Visit: https://securityheaders.com

Enter your URL: `https://my-portfolio-zdd8.onrender.com`

Expected result: A (or A+) rating

## Step 5: Ongoing Maintenance

### Weekly
- [ ] Check Render logs for errors
- [ ] Monitor for failed login attempts

### Monthly
- [ ] Review submitted hire requests
- [ ] Update project information if needed

### Quarterly
- [ ] Rotate admin password
- [ ] Update Node.js dependencies

---

## 🔒 Security Verification Checklist

After deployment, verify:

```bash
# 1. Check Security Headers
curl -I https://my-portfolio-zdd8.onrender.com
# Should include: X-Frame-Options, X-Content-Type-Options, etc.

# 2. Check HTTPS Redirect
curl -I http://my-portfolio-zdd8.onrender.com
# Should redirect to https://

# 3. Check Admin Login Works
# Test at https://my-portfolio-zdd8.onrender.com (admin panel)
```

---

## 🆘 Common Issues & Fixes

### Issue: Login not working
**Solution**:
1. Verify credentials in Render Environment
2. Restart deployment: Settings → Manual Deploy
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Getting 403 Forbidden
**Solution**:
1. Check if trying to access `/data` directory
2. Verify file paths in environment variables

### Issue: SSL Certificate Error
**Solution**:
1. Render provides automatic SSL
2. Just wait 10-15 minutes after first deploy
3. Force browser cache clear

### Issue: Rate Limiting Too Strict
**Solution**:
1. Edit `RATE_LIMITS` in `server.js`
2. Redeploy to Render

---

## 📞 Need Help?

Check these resources:
- [Render Documentation](https://render.com/docs)
- [SECURITY.md](./SECURITY.md) - Detailed security info
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist

---

**Secure Deployment Status**: ✅ Ready  
**Last Updated**: May 2, 2026
