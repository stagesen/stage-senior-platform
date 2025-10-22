import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

/**
 * Rate limiter for tour request submissions
 * Aggressive limits to prevent spam and bot attacks
 */
export const tourRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 tour requests per IP per 15 min
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skipFailedRequests: true, // Don't count failed validations
  skipSuccessfulRequests: false, // Count successful requests
  message: {
    error: 'Too many tour requests from this IP address',
    retryAfter: 'Please try again in 15 minutes',
  },
  handler: (req: Request, res: Response) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    console.warn(`[Rate Limit] Blocked tour request from IP: ${ip}, User-Agent: ${req.headers['user-agent']}`);
    
    res.status(429).json({
      message: 'Too many tour requests. Please try again later or call us directly at (970) 444-4689',
      retryAfter: (req as any).rateLimit?.resetTime,
    });
  },
  keyGenerator: (req: Request) => {
    // Use IP as the key for rate limiting
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
});

/**
 * Verify Cloudflare Turnstile CAPTCHA token
 */
export async function verifyCaptcha(token: string, remoteIp: string): Promise<{
  success: boolean;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('[CAPTCHA] TURNSTILE_SECRET_KEY not configured, skipping verification');
    // In development, allow requests without CAPTCHA
    if (process.env.NODE_ENV === 'development') {
      return { success: true, score: 1.0 };
    }
    return { success: false, 'error-codes': ['missing-secret-key'] };
  }

  try {
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: remoteIp,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[CAPTCHA] Verification error:', error);
    return { success: false, 'error-codes': ['server-error'] };
  }
}

/**
 * Honeypot field detection
 * Bots often auto-fill hidden fields
 */
export function detectHoneypot(honeypotValue: string | undefined): boolean {
  if (honeypotValue && honeypotValue.trim() !== '') {
    return true; // Bot detected
  }
  return false;
}

/**
 * Speed check - reject submissions that are too fast
 * Humans typically take at least 3 seconds to fill a form
 */
export function detectSpeedAnomaly(formLoadTime: number | undefined): boolean {
  if (!formLoadTime) {
    return false; // No timestamp provided, skip check
  }
  
  const submissionTime = Date.now();
  const timeDiff = (submissionTime - formLoadTime) / 1000; // Convert to seconds
  
  // Reject if submitted in less than 3 seconds
  if (timeDiff < 3) {
    return true; // Too fast, likely a bot
  }
  
  // Also reject if timestamp is in the future or more than 1 hour old
  if (timeDiff < 0 || timeDiff > 3600) {
    return true; // Invalid timestamp
  }
  
  return false;
}

/**
 * Log security events for monitoring and analysis
 */
export function logSecurityEvent(event: {
  type: 'rate_limit' | 'captcha_fail' | 'honeypot' | 'speed_check' | 'success';
  ip: string;
  userAgent: string;
  details?: any;
}) {
  const timestamp = new Date().toISOString();
  const logMessage = `[Security] ${timestamp} - ${event.type.toUpperCase()} - IP: ${event.ip} - UA: ${event.userAgent}`;
  
  if (event.type === 'success') {
    console.log(logMessage, event.details || '');
  } else {
    console.warn(logMessage, event.details || '');
  }
  
  // In production, you might want to send these to a monitoring service
  // or store them in a database for analysis
}
