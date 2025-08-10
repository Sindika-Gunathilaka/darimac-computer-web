# DARIMAC TECHNOLOGIES - Deployment Guide


## Overview
This guide covers deploying the DARIMAC TECHNOLOGIES computer accessories e-commerce application.

## Prerequisites
- Node.js 18+ installed
- Git repository
- Vercel account (recommended) or other hosting platform
- Cloud database setup (required for production)

## 1. Database Setup for Production

### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection string

### Option B: PlanetScale
1. Sign up at [PlanetScale](https://planetscale.com)
2. Create a new database
3. Get the connection string

### Option C: Railway
1. Sign up at [Railway](https://railway.app)
2. Create a Postgres service
3. Get the connection string

## 2. Environment Variables Setup

Create these environment variables in your hosting platform:

```env
DATABASE_URL="your_production_database_connection_string"
CLOUDINARY_CLOUD_NAME="dmvr3aubu"
CLOUDINARY_API_KEY="351641278437436"
CLOUDINARY_API_SECRET="yLbkCgLekbnDNlXgxAWH2Z431I0"
```

## 3. Deploy to Vercel (Recommended)

### Quick Deploy
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Set environment variables
5. Deploy

### Manual Deploy
```bash
npm install -g vercel
vercel login
vercel --prod
```

## 4. Database Migration
After deployment, run the database migration:

```bash
npx prisma db push
```

## 5. Post-Deployment Checklist
- [ ] Test product listings
- [ ] Test cart functionality
- [ ] Test order placement
- [ ] Test admin dashboard
- [ ] Test image uploads
- [ ] Verify environment variables

## 6. Alternative Hosting Platforms

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

## Support
For deployment issues, contact: darimacdigital@gmail.com