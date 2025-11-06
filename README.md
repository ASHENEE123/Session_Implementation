# 🚀 Session Implementation — Hands‑On Practical Guide

Welcome! This repo is a compact, hands-on implementation showing how to use server sessions in an Express.js app. Follow along to run, explore, and experiment. This README has been enhanced with icons to make the modules and steps visually friendly and easier to scan.

---

[![Node.js](https://img.shields.io/badge/Node.js-%3E=_14-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A quick visual summary:
- ⚙️ Purpose: Demonstrate express-session lifecycle (create, store, read, destroy)
- 🎯 Focus: Session usage, rate-limiting per-session, validation, hashing, minimal templates
- 🧪 Learning style: Practical — run the code and modify to see effects

---

## 📁 What’s in this repo
- session.js — main server file (core of the hands-on demo)
- template/ — EJS view templates (`login.ejs`, `sign.ejs`) expected by the server

---

## 🧰 Modules used (with icons and short role descriptions)

- ⚡ express — Web framework for routing and middleware  
  Icon: ⚡ | Role: Server, routes, request handling

- 🧷 express-session — Session middleware (cookie + server session store)  
  Icon: 🧷 | Role: Create and manage sessions (cookie name, secret, expiry)

- 🚦 express-rate-limit — Rate limiter middleware  
  Icon: 🚦 | Role: Protect endpoints (per-session quotas configured)

- 🛣️ path — Node core module to handle file paths  
  Icon: 🛣️ | Role: Build platform-independent template path

- 🧾 joi — Input validation library  
  Icon: 🧾 | Role: Validate user input (password rules)

- 🔒 bcrypt — Password hashing library  
  Icon: 🔒 | Role: Hash passwords and compare securely

- 🖼️ ejs — Templating engine for rendering views  
  Icon: 🖼️ | Role: Render simple HTML forms (login / sign up)

---

## 🔎 How sessions are used — practical walkthrough

1. Initialize session middleware (session cookie behavior)
   - secret: your session secret (use env var in prod)
   - name: cookie name — change from placeholder
   - cookie: maxAge set short (1 min) for demo; secure:false for local dev; httpOnly:true

2. On POST /data
   - Validate password using Joi (alphanumeric, 10–20 chars)
   - Hash password with bcrypt
   - Store hashed password and username on session:
     - req.session.pass = <hashedPassword>
     - req.session.username = <username>

3. Protect routes
   - /dashboard checks req.session.username before granting access

4. Rate limiting
   - /dashboard rate limit uses KeyGenerator keyed by req.session.id (per-session quota)
   - /login also has a rate limit (global per-IP fallback if session absent)

5. Logout
   - /logout calls req.session.destroy(...) and clears cookie to remove session

---

## ⚠️ Bug found & practical fix (hands‑on debugging)

The original `/check` handler used bcrypt incorrectly. Correct usage is:

- Wrong:
  const result = crypt.compare(req.session.pass, word)

- Correct (inside an async handler):
  const result = await crypt.compare(word, req.session.pass)

bcrypt.compare(plainText, hashed) returns a promise (or uses callback). Practically, try `/check` before and after fixing to observe the behavior — great debugging exercise.

---

## 🧩 Endpoints & quick testing

- GET /login — renders login form (template: template/login.ejs)  
- POST /data — submit { username, password } to save username + hashed password in session  
- GET /sign-up — renders sign-up template (template/sign.ejs)  
- POST /check — compares supplied password with hashed password stored in session (fix needed)  
- GET /dashboard — protected route; returns welcome message if session has username  
- GET /logout — destroy session and clear cookie

Example minimal templates (place in template/):

/template/login.ejs
```html
<form action="/data" method="post">
  <input name="username" placeholder="username" required />
  <input name="password" type="password" placeholder="password (10-20 alnum)" required />
  <button type="submit">Login / Save Session</button>
</form>
```

/template/sign.ejs
```html
<form action="/check" method="post">
  <input name="password" type="password" placeholder="password to check" required />
  <button type="submit">Check</button>
</form>
```

---

## 🚀 Quick start (copy-paste)

1. Ensure Node.js (14+) and npm are installed.

2. From repo root:
```bash
npm init -y
npm install express express-session express-rate-limit ejs joi bcrypt
```

3. Run:
```bash
node session.js
# Visit http://localhost:3000/login
```

---

## 🔐 Security tips (practical)
- Use environment variables for secrets:
  - process.env.SESSION_SECRET
- Don’t keep password hashes in session in real apps — persist to DB and keep minimal user id in session.
- Use secure: true for cookies in production (HTTPS).
- Add CSRF protection, helmet, and a persistent session store (Redis) for production.

---

## ✨ Visual extras — module list with icons summary

- ⚡ express — fast routing  
- 🧷 express-session — session lifecycle  
- 🚦 express-rate-limit — rate controls  
- 🛣️ path — path utilities  
- 🧾 joi — validation  
- 🔒 bcrypt — hashing & verification  
- 🖼️ ejs — view rendering

---

## 💡 Improvements & exercises (try these)
- Replace in-memory session store with Redis for persistence across processes.
- Implement proper registration + login backed by a DB (MongoDB/Postgres).
- Add HTTPS and set cookie secure flag to true.
- Add CSRF tokens for form endpoints.
- Show a session inspector page that prints req.session (for debugging only).

---


