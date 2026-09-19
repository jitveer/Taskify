const rateLimit = require('express-rate-limit');

// 1. Strict Limiter for Login / Auth routes (Brute-Force & Credential Stuffing Protection)
// Allows max 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 requests per window
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    statusCode: 429,
    message: {
        success: false,
        message: "Too many login attempts from this IP address. Please wait 15 minutes before trying again."
    }
});

// 2. General API Limiter (DoS / Spam Protection)
// Allows max 300 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: {
        success: false,
        message: "Too many requests from this IP. Please slow down and try again shortly."
    }
});

module.exports = {
    authLimiter,
    apiLimiter
};
