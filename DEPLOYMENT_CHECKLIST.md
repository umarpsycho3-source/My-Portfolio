# Pre-Deployment Security Checklist

Complete this checklist before deploying to production:

## 🔐 Credentials & Secrets
- [ ] Changed admin email from `umarxgamer04@gmail.com` to your email
- [ ] Created a strong admin password (min 8 chars, uppercase, lowercase, number, special char)
- [ ] Created `.env` file with all variables (DO NOT commit to git)
- [ ] Added `.env` to `.gitignore`
- [ ] Verified all contact information is correct
- [ ] Removed default credentials from comments

## 🌐 Deployment Configuration
- [ ] Set `NODE_ENV=production` in Render environment
- [ ] Configured all environment variables in Render Dashboard
- [ ] Enabled HTTPS/SSL (automatic on Render)
- [ ] Set `ALLOWED_ORIGIN` to your actual domain if needed

## 🛡️ Security Headers
- [ ] Verified Content-Security-Policy is appropriate
- [ ] Checked X-Frame-Options is set to DENY
- [ ] Confirmed HSTS header is enabled (production only)
- [ ] Tested security headers with: https://securityheaders.com

## 📝 Code Review
- [ ] No hardcoded passwords in code
- [ ] No sensitive data in version control
- [ ] All user inputs are validated
- [ ] Rate limiting is enabled on login and forms
- [ ] CORS is properly configured

## 🗄️ Database
- [ ] Database file exists and is writable
- [ ] Initial data (projects, reviews) is correct
- [ ] Backup of database created
- [ ] No sensitive test data left in database

## ✅ Testing
- [ ] Test login with admin credentials
- [ ] Test hire request submission
- [ ] Test review submission
- [ ] Verify rate limiting works (test rapid requests)
- [ ] Test on HTTPS (production URL)
- [ ] Check for console errors in browser
- [ ] Verify all API endpoints respond correctly

## 🔗 Links & URLs
- [ ] All project links are correct
- [ ] CV download link works
- [ ] Profile image loads correctly
- [ ] Contact information is accurate
- [ ] Social media links are current

## 📊 Monitoring
- [ ] Set up email alerts for errors
- [ ] Monitor Render logs regularly
- [ ] Keep a note of failed login attempts
- [ ] Review submitted hire requests weekly

## 🚀 Final Steps
- [ ] Take a backup of the database
- [ ] Deploy to Render
- [ ] Test production URL thoroughly
- [ ] Update your portfolio link on LinkedIn/GitHub
- [ ] Monitor for any errors in first 24 hours

---

## 🆘 Troubleshooting

### Credentials Not Working
- Check that environment variables are set in Render
- Restart the server (redeploy)
- Verify email/password format

### Rate Limiting Issues
- Clear browser cache
- Try from different IP/device
- Wait for rate limit window to expire

### CSS/JS Not Loading
- Check browser console for CSP errors
- Verify Content-Security-Policy header
- Clear CDN cache if applicable

### Database Issues
- Check file permissions
- Verify DATA_DIR is writable
- Check Render logs for errors

---

**Status**: Ready for review  
**Date**: [Current Date]  
**Reviewer**: [Your Name]
