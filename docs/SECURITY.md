# Security Architecture & Hardening Specifications
## School Management & Information Platform

---

## 1. Authentication & Session Security

The platform employs a modern **Dual-Token Authentication Strategy** designed for high security, session persistence, and resilience against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).

```
+--------+                    +--------+                         +----------+
| Client |                    | Server |                         | Database |
+---+----+                    +---+----+                         +----+-----+
    |                             |                                   |
    | 1. POST /api/auth/login     |                                   |
    +---------------------------->| Verify Password (bcrypt)          |
    |                             | Check Account Status              |
    |                             +---------------------------------->|
    | 2. 200 OK                   | Save Refresh Token in whitelist   |
    |    Access Token (JSON)      |                                   |
    |    Refresh Token (Cookie)   |                                   |
    |<----------------------------+                                   |
    |                             |                                   |
    | 3. API Call: Bearer Token   |                                   |
    +---------------------------->| Verify JWT Signature & Expiry     |
    |                             | Execute Business Logic            |
    |                             |                                   |
    | 4. Token Expired (401)      |                                   |
    |<----------------------------+                                   |
    |                             |                                   |
    | 5. POST /api/auth/refresh   |                                   |
    |    (Cookie Sent Auto)       |                                   |
    +---------------------------->| Verify Cookie Token in DB         |
    |                             | Rotate Token: Revoke Old, New Pair|
    | 6. New Access + New Cookie  +---------------------------------->|
    |<----------------------------+                                   |
```

### 1.1 Access Tokens
- **Lifespan**: Short-lived (15 minutes).
- **Format**: Cryptographically signed JSON Web Token (JWT) using HMAC-SHA256.
- **Payload**: Contains minimal identity claims `{ userId, email, role }`.
- **Transmission**: Sent via the HTTP `Authorization: Bearer <token>` header. Kept in client application memory (never stored in `localStorage` in high-security production environments).

### 1.2 Refresh Tokens & Token Rotation
- **Lifespan**: Long-lived (7 days).
- **Transmission & Storage**: Stored exclusively within an `HttpOnly`, `Secure`, `SameSite=Strict` HTTP cookie (`path=/;`).
- **Token Rotation**: Every refresh invocation revokes the consumed refresh token and issues a brand-new refresh token.
- **Reuse Detection**: If a revoked refresh token is re-submitted, the system treats it as token theft and invalidates *all* active refresh tokens for that user account.

---

## 2. Password Hashing & Account Integrity

- **Algorithm**: **bcrypt** with a work factor (salt rounds) of 10.
- **Complexity Requirements**: Minimum 8 characters, requiring at least one lowercase letter, one uppercase letter, one digit, and one special character (enforced via Zod `RegisterSchema`).
- **Brute Force Protection**: Account temporarily locked for 15 minutes after 5 consecutive failed login attempts within 10 minutes.

---

## 3. Defense Against OWASP Top 10 Vulnerabilities

### 3.1 Injection (NoSQL / SQL / Command Injection)
- **Mongoose Parameterized Queries**: All queries pass through strongly typed Mongoose model schemas. Raw input is never concatenated into queries.
- **Sanitization Middleware**: Strips out dollar signs (`$`) and dots (`.`) from incoming JSON keys to prevent MongoDB query operator injection.

### 3.2 Broken Access Control (BAC)
- **Declarative Middleware**: Every protected endpoint is guarded by `authenticate` followed by `authorizeRoles('ROLE_A', 'ROLE_B')`.
- **Horizontal Access Verification**: Controllers explicitly check if a resource belongs to the calling user or their linked children before returning data.

### 3.3 Cross-Site Scripting (XSS)
- **Client Sanitization**: React escapes all rendered string variables by default.
- **CSP Headers**: Content-Security-Policy disallows inline scripts and limits script execution to trusted CDNs.
- **Input Sanitization**: Strings containing HTML are stripped using DOMPurify before storage.

### 3.4 Cross-Site Request Forgery (CSRF)
- Refresh token cookies use `SameSite=Strict` (production) and `SameSite=Lax` (staging/dev).
- State-altering API endpoints require `Authorization: Bearer <token>` in headers, which cannot be forged via cross-site form submissions.

---

## 4. HTTP Security Headers (Helmet.js)

```typescript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://fonts.googleapis.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"], // Disallows clickjacking
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,              // X-Content-Type-Options: nosniff
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
```

---

## 5. Rate Limiting Strategy

Tiered rate limiting implemented via `express-rate-limit`:

| Tier | Window | Max Requests | Endpoints Covered |
| :--- | :--- | :--- | :--- |
| **Global API** | 15 minutes | 300 | All `/api/*` endpoints |
| **Authentication** | 15 minutes | 15 | `/api/auth/login`, `/api/auth/refresh` |
| **Public Admissions** | 60 minutes | 10 | `/api/admissions/apply` |
| **Status Tracking** | 15 minutes | 30 | `/api/admissions/track/*` |
