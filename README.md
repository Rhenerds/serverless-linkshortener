# Antigravity Link Shortener

A simple, serverless link shortener built with Next.js, Tailwind CSS, and Redis.

## Features

- 🚀 Serverless architecture
- ⚡ Fast redirects
- 🎨 Beautiful, modern UI
- 🔒 Simple Authentication (User/Password)
- 🏷️ Link Nicknames
- 📊 Detailed Analytics (IP, Country, User Agent, Referer)
- 💾 Redis storage

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Environment Variables:
   Create a `.env` file (or set in Vercel):
   ```env
   # Redis Connection (Optional for local dev, defaults to localhost:6379)
   REDIS_URL=redis://...

   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

Deploy to Vercel:

1. Push to GitHub.
2. Import project in Vercel.
3. Set the `REDIS_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` environment variables in Vercel project settings.
4. Redeploy.
