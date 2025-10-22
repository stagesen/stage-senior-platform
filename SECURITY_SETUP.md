# Security Configuration Guide

This application includes comprehensive bot protection and rate limiting for the tour request form. Follow this guide to configure the security features.

## Features Implemented

### 1. **Rate Limiting**
- **Max Requests**: 3 tour requests per IP per 15 minutes
- **Technology**: `express-rate-limit`
- **Behavior**: Returns 429 status code when limit exceeded
- **No configuration required** - works out of the box

### 2. **Cloudflare Turnstile CAPTCHA**
- **Type**: Invisible bot scoring (no user interaction required for humans)
- **Free tier**: Unlimited requests
- **Privacy-friendly**: Better than reCAPTCHA

### 3. **Honeypot Field Detection**
- Hidden form field that bots auto-fill
- Invisible to real users
- **No configuration required**

### 4. **Speed Anomaly Detection**
- Rejects submissions completed in < 3 seconds
- Prevents automated form submissions
- **No configuration required**

## Setup Instructions

### Step 1: Get Cloudflare Turnstile Keys

1. Go to [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Sign in or create a free Cloudflare account
3. Click "Add Site"
4. Configure your site:
   - **Site name**: Your application name
   - **Domain**: Add your domains (e.g., `yourapp.replit.app`, `localhost` for testing)
   - **Widget mode**: Select "Managed" (recommended)
5. Click "Create"
6. Copy the **Site Key** and **Secret Key**

### Step 2: Configure Environment Variables

Add these environment variables to your Replit project:

#### Backend (Required in production)
```bash
TURNSTILE_SECRET_KEY=your_secret_key_here
```

#### Frontend (Required in production)
```bash
VITE_TURNSTILE_SITE_KEY=your_site_key_here
```

**Note**: In development mode, the backend will skip CAPTCHA verification if `TURNSTILE_SECRET_KEY` is not set. The frontend will not display the CAPTCHA widget if `VITE_TURNSTILE_SITE_KEY` is not set.

### Step 3: Test the Configuration

1. Load the tour request form
2. Fill out the form fields
3. The CAPTCHA widget should appear at the bottom (invisible challenge)
4. Submit the form
5. Check server logs for security events

## Configuration Options

### Rate Limiting

You can adjust rate limits in `server/security-middleware.ts`:

```typescript
export const tourRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // Time window (15 minutes)
  max: 3,                     // Max requests per window
  // ... other options
});
```

**Recommended settings:**
- **High-traffic sites**: 5 requests per 15 minutes
- **Low-traffic sites**: 3 requests per 15 minutes
- **Testing**: Increase to 10+ requests

### CAPTCHA Score Threshold

Currently disabled by default. To enable score-based rejection, edit `server/routes.ts`:

```typescript
// Cloudflare Turnstile doesn't return scores by default
// It uses challenge-based verification instead
```

## Security Event Logging

All security events are logged to the console with the following format:

```
[Security] 2025-10-22T12:00:00.000Z - SUCCESS - IP: 192.168.1.1 - UA: Mozilla/5.0...
[Security] 2025-10-22T12:00:00.000Z - HONEYPOT - IP: 192.168.1.2 - UA: Bot/1.0
[Security] 2025-10-22T12:00:00.000Z - CAPTCHA_FAIL - IP: 192.168.1.3 - UA: ...
[Rate Limit] Blocked tour request from IP: 192.168.1.4, User-Agent: ...
```

### Event Types
- `success`: Valid submission passed all checks
- `honeypot`: Bot detected via honeypot field
- `speed_check`: Submission too fast (< 3 seconds)
- `captcha_fail`: CAPTCHA verification failed
- `rate_limit`: Too many requests from IP

## Monitoring & Analysis

### View Logs
Check your Replit console or server logs for security events.

### Common Patterns to Watch
1. **Multiple honeypot triggers from same IP** → Bot attack
2. **High rate limit blocks** → Possible DDoS or aggressive bot
3. **Multiple CAPTCHA failures** → Bot attempting to bypass

### Recommended Actions
1. **High bot activity**: Lower rate limits temporarily
2. **Persistent attacks**: Consider adding IP-based blocking
3. **False positives**: Adjust speed check threshold (increase from 3 seconds)

## Testing

### Test Rate Limiting
1. Submit 3 tour requests quickly from the same IP
2. 4th request should be blocked with 429 status

### Test Honeypot
1. Use browser dev tools to make the honeypot field visible
2. Fill it with any value
3. Form submission should fail with "Invalid submission"

### Test Speed Check
1. Use automated tools to submit form in < 3 seconds
2. Should fail with "Please fill out the form completely"

### Test CAPTCHA
1. Disable JavaScript or block Cloudflare
2. Form should still submit (degrades gracefully)
3. In production with keys set, CAPTCHA is required

## Troubleshooting

### CAPTCHA not appearing
- Check that `VITE_TURNSTILE_SITE_KEY` is set
- Verify domain is added to Cloudflare Turnstile dashboard
- Check browser console for JavaScript errors

### CAPTCHA failing in production
- Verify `TURNSTILE_SECRET_KEY` is correct
- Check that domain matches Cloudflare configuration
- Review server logs for specific error codes

### Too many legitimate users blocked
- Increase rate limit `max` value
- Extend rate limit `windowMs` window
- Adjust speed check threshold

## Production Checklist

Before deploying to production:

- [ ] Set `TURNSTILE_SECRET_KEY` in backend environment
- [ ] Set `VITE_TURNSTILE_SITE_KEY` in frontend environment
- [ ] Add production domain to Cloudflare Turnstile dashboard
- [ ] Test form submission on production domain
- [ ] Monitor logs for first 24 hours
- [ ] Set up alerts for high rate limit blocks
- [ ] Document rate limit settings for team

## Additional Security Recommendations

1. **Add Redis for distributed rate limiting** (if using multiple servers)
2. **Implement IP reputation checking** (AbuseIPDB, IPQualityScore)
3. **Add email/phone validation** (verify email exists, phone is valid)
4. **Set up monitoring dashboards** (track security events over time)
5. **Regular security audits** (review logs monthly for patterns)

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Review Cloudflare Turnstile dashboard for analytics
3. Test with CAPTCHA disabled (remove env vars) to isolate issues
