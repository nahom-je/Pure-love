# PURE LOVE Charity Platform

> **PURE LOVE** is the JIT Christian Students Charity Group at Jimma Institute of Technology, Ethiopia.
> This repository contains a Telegram intake bot (Node.js) and a public-facing React landing page.

---

## Features

### Telegram Bot (`bot/`)
- 🌐 **Bilingual** — Amharic (አማርኛ) and English, chosen at `/start`
- 👫 **Gender-based Admin Routing** — Male requests are routed to the male admin; female requests are routed to the female admin.
- 📋 **Aid request flow** — consent → name → phone → gender → reference code
- 📞 **Phone validation** — Ethiopian formats (`09XX`, `07XX`, `+251XX`)
- 🔖 **Reference codes** — `PL-1042` style, queryable with `/status PL-XXXX`
- 👮 **Admin panel** — inline `Contacted / Ready / Done` buttons per request
- 📊 **Scoped admin commands** — `/pending`, `/stats`, `/export` (CSV) scoped to each admin's group
- 🔄 **Status notifications** — student gets a message in their language when status changes
- 🛡️ **Rate limiting** — max 3 requests per user per day
- 🗑️ **Auto-cleanup** — requests older than 90 days (status: done) are deleted nightly
- 🔒 **Secure** — phone numbers never logged, all secrets in `.env`

### Landing Page (`frontend/`)
- 🏠 All sections: Hero, What We Offer, How It Works, Privacy Promise, Donate, Get Involved, FAQ, Footer
- 💳 **Donation section** — CBE bank transfer card with **Copy** button and account holder name
- 🌍 **i18n** — Amharic / English switch, remembers choice in `localStorage`
- 📱 **Mobile-first**, Noto Sans Ethiopic font, accessible
- ⚡ Vite build, Tailwind CSS

---

## Project Structure

```
pure-love/
├── bot/
│   ├── src/
│   │   ├── index.js                 # Entry point
│   │   ├── locales.js               # All Amharic + English bot strings
│   │   ├── conversations/
│   │   │   └── requestAid.js        # Multi-step aid request flow with gender routing
│   │   ├── handlers/
│   │   │   ├── start.js             # /start, language picker
│   │   │   ├── admin.js             # /pending /stats /export + inline buttons (scoped)
│   │   │   ├── student.js           # /status /language
│   │   │   └── errors.js            # Global error handler
│   │   ├── services/
│   │   │   ├── db.js                # Prisma client singleton
│   │   │   └── cleanup.js           # Nightly 90-day cleanup job
│   │   └── utils/
│   │       ├── adminRouter.js       # Gender-based admin routing & authorization
│   │       ├── validation.js        # Phone + name validators
│   │       ├── rateLimit.js         # 3 requests/day per user
│   │       └── referenceCode.js     # PL-XXXX generator
│   ├── prisma/schema.prisma
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/              # Header, Hero, WhatWeOffer, …, Footer
│   │   ├── pages/Home.jsx
│   │   ├── locales/am.json
│   │   ├── locales/en.json
│   │   ├── config.js                # Public donation details
│   │   ├── i18n.js
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitignore
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- npm

### Bot setup

```bash
cd bot
npm install
npx prisma generate
npx prisma db push
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
# Edit .env with your BOT_TOKEN, MALE_ADMIN_ID, and FEMALE_ADMIN_ID
```

### Frontend setup

```bash
cd frontend
npm install
```

---

## Configuration

Edit `bot/.env`:

```env
BOT_TOKEN=your_bot_token
MALE_ADMIN_ID=123456789
FEMALE_ADMIN_ID=987654321
DATABASE_URL=file:./dev.db
WEBHOOK_URL=https://your-domain.com
PORT=3000
NODE_ENV=development
```

Donation account details (public) live in `frontend/src/config.js` and can be updated there freely.

---

## Running Locally

### Bot (development — long polling)

```bash
cd bot
npm run dev        # uses node --watch for auto-restart
```

### Frontend

```bash
cd frontend
npm run dev        # starts Vite dev server on http://localhost:5173
```

---

## Deployment

### Frontend → Vercel

1. Push the repo to GitHub.
2. Import on [vercel.com](https://vercel.com) → select the `frontend/` subfolder as root.
3. No environment variables needed (all public).

### Bot → Render (or Railway)

1. Create a new **Web Service** on [render.com](https://render.com).
2. Set **Root Directory** to `bot/`.
3. **Build command**: `npm install && npx prisma generate && npx prisma db push`
4. **Start command**: `node src/index.js`
5. Add environment variables:
   - `BOT_TOKEN` — from BotFather
   - `MALE_ADMIN_ID` — male admin Telegram ID
   - `FEMALE_ADMIN_ID` — female admin Telegram ID
   - `DATABASE_URL` — `file:./dev.db` (or a PostgreSQL URL for production)
   - `WEBHOOK_URL` — your Render service URL (e.g. `https://pure-love-bot.onrender.com`)
   - `PORT` — `3000`
   - `NODE_ENV` — `production`

---

## Setup Guide

### 1. Create your bot with @BotFather

1. Open Telegram and search for **@BotFather**.
2. Send `/newbot` and follow the prompts.
3. Copy the **bot token** (looks like `123456789:ABCdef...`).
4. Put it in `bot/.env` as `BOT_TOKEN=...`.

### 2. Find admin Telegram IDs

1. Each admin opens Telegram and messages **@userinfobot**.
2. It replies with their user ID (a number like `123456789`).
3. Set `MALE_ADMIN_ID` and `FEMALE_ADMIN_ID` in `bot/.env`.

### 3. Why both admins must press Start once

Telegram bots **cannot initiate a message** to a user who has never started the bot. Both the male admin and female admin must open the bot and press **Start** (or send `/start`) at least once. If an admin hasn't done this, the bot catches the error, marks the request as `Undelivered` in the database, and confirms the reference code to the student without crashing.

---

## Security Notes

- **No secrets in code** — `BOT_TOKEN`, `MALE_ADMIN_ID`, and `FEMALE_ADMIN_ID` are only read from environment variables.
- **`.env` is in `.gitignore`** — it is never committed.
- **Phone numbers are never logged** — they are stored in the database but excluded from all console output.
- **Minimum data** — only first name, phone, and gender are collected.
- **90-day auto-delete** — completed requests are deleted after 90 days by a nightly cron job.
- **Admin validation** — all admin commands verify sender ID against `MALE_ADMIN_ID` or `FEMALE_ADMIN_ID`.
- **Gender scoping** — admins only access and manage requests matching their student gender group.
- **Rate limiting** — max 3 requests per Telegram user per calendar day.

---

## Aid Types Provided

| ✅ Provided | ❌ Not provided |
|------------|---------------|
| Clothing | Direct financial / cash aid |
| Shoes | |
| Personal hygiene products | |
| Feminine sanitary items | |
| Study supplies | |

---

*PURE LOVE — JIT Christian Students Charity Group, Jimma Institute of Technology, Ethiopia*
