# Portfolio Security Implementation

## 🔒 Security Features Implemented

### 1. **Rate Limiting**
Protects against brute-force attacks and spam:
- **Login**: 5 attempts per 15 minutes
- **Hire Requests**: 10 per hour
- **Reviews**: 5 per hour
- **General API**: 100 requests per 15 minutes

**How it works**: Tracks requests by client IP address and blocks excessive attempts.

---

### 2. **Security Headers**

All responses include protective headers:

| Header | Purpose |
|--------|---------|
| `X-Frame-Options: DENY` | Prevents clickjacking attacks |
| `X-Content-Type-Options: nosniff` | Prevents MIME type sniffing |
| `X-XSS-Protection: 1; mode=block` | Enables browser XSS protection |
| `Content-Security-Policy` | Prevents injection attacks |
| `Referrer-Policy` | Controls referrer information |
| `Permissions-Policy` | Restricts browser features |
| `Strict-Transport-Security` | Enforces HTTPS (production only) |

---

### 3. **Input Validation & Sanitization**

All user inputs are validated:
- **Email validation**: RFC-compliant email format checking
- **Password validation**: Minimum 8 characters with uppercase, lowercase, number, special character
- **Phone validation**: Basic format validation
- **HTML sanitization**: All text inputs are escaped to prevent XSS

**Examples**:
```
name: "John" → sanitized to prevent <script> injection
email: "john@example.com" → validated against email regex
```

---

### 4. **Secure Session Management**

Enhanced session cookie security:
- **HttpOnly flag**: Prevents JavaScript access (XSS protection)
- **SameSite=Strict**: Prevents CSRF attacks
- **Secure flag**: HTTPS-only transmission (production)
- **Max-Age**: 12-hour expiration

---

### 5. **Password Security**

Passwords are hashed using scrypt:
- **Algorithm**: scrypt (industry-standard key derivation)
- **Format**: `scrypt:salt:hash`
- **Timing-safe comparison**: Prevents timing attacks

---

### 6. **Client IP Detection**

Accurately identifies client IP for rate limiting:
- Handles X-Forwarded-For headers (for proxies)
- Falls back to socket remote address

---

### 7. **Security Logging**

Failed login attempts and suspicious activities are logged:
- Tracks: IP address, email, action, timestamp
- Helps identify attack patterns
- Disabled in production for privacy

---

## 🚀 Deployment Best Practices

### Environment Variables (Required for Production)

Create a `.env` file or set these in your hosting provider:

```env
# Essential
NODE_ENV=production
PORT=5678

# Admin credentials (CHANGE THESE!)
ADMIN_EMAIL=your-email@gmail.com
ADMIN_PASSWORD=YourStrongPassword123!

# Contact Information
CONTACT_PHONE=+1-234-567-8900
CONTACT_WHATSAPP=1234567890
CONTACT_EMAIL=your-email@gmail.com

# Files
CV_FILE=/path/to/cv.pdf
PROFILE_IMAGE_FILE=/path/to/profile.jpeg

# Optional
DATA_DIR=/path/to/data
ALLOWED_ORIGIN=https://my-portfolio-zdd8.onrender.com
```

### Render.com Deployment Setup

1. **Set Environment Variables** in your Render dashboard:
   - Go to Settings → Environment Variables
   - Add all variables from `.env`

2. **Use Strong Admin Password**:
   ```
   ✗ Bad: PortfolioAdmin2026!
   ✓ Good: Tr0ub4dour&Uygg7^*Hj9
   ```

3. **Enable Auto-Deploy from Git** (not recommended with sensitive data)

4. **Use Build & Start Scripts**:
   - Build command: `npm install`
   - Start command: `node server.js`

---

## ⚠️ Security Warnings

### DO NOT:
- ❌ Commit credentials to git
- ❌ Use default passwords
- ❌ Disable HTTPS in production
- ❌ Share admin credentials via email
- ❌ Allow CORS from `*` in production (update `ALLOWED_ORIGIN`)

### DO:
- ✅ Use strong, unique passwords
- ✅ Rotate credentials regularly
- ✅ Monitor failed login attempts
- ✅ Keep Node.js updated
- ✅ Review security logs periodically
- ✅ Use HTTPS only in production

---

## 🔐 Attack Prevention

### XSS (Cross-Site Scripting)
- ✅ Input sanitization
- ✅ Content Security Policy header
- ✅ HttpOnly cookies
- ✅ X-XSS-Protection header

### CSRF (Cross-Site Request Forgery)
- ✅ SameSite=Strict cookies
- ✅ Same-origin validation

### Brute Force Attacks
- ✅ Rate limiting on login
- ✅ No enumeration leaks (same error for invalid email/password)

### DDoS Attacks
- ✅ Rate limiting on all endpoints
- ✅ Request size limits (1MB max body)

### Injection Attacks
- ✅ Input validation
- ✅ No dangerous operations on user input
- ✅ Proper JSON handling

---

## 📝 Maintenance

### Regular Tasks:
1. Monitor failed login attempts
2. Update Node.js dependencies: `npm update`
3. Review database for spam/abuse
4. Rotate admin credentials quarterly
5. Check Render logs for security alerts

### Check for Updates:
```bash
npm outdated
npm audit
```

---

## 🆘 Emergency Response

### If Compromised:
1. Change admin password immediately
2. Review all database records
3. Delete suspicious hire requests/reviews
4. Check Render deployment logs
5. Force logout all sessions (restart server)

---

## 📞 Security Support

For security issues:
- **Do NOT** post issues in public forums
- Report privately to your host (Render.com)
- Keep detailed logs of suspicious activity

---

**Last Updated**: May 2, 2026  
**Security Level**: Enhanced
