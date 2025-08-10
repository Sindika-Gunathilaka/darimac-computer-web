# DARIMAC TECHNOLOGIES - Step-by-Step Deployment

## Current Status
✅ Application is ready for deployment
✅ Environment variables configured
🔄 Database needs to be configured for production

## Immediate Next Steps

### Step 1: Choose Your Database Provider
Since SQLite doesn't work in serverless environments, you need a cloud database:

**Option A: Vercel Postgres** (Recommended - Free tier available)
1. Go to https://vercel.com/dashboard
2. Create account and new project
3. Go to Storage → Create Database → Postgres
4. Copy the DATABASE_URL

**Option B: Railway** (Simple setup)
1. Go to https://railway.app
2. Create account
3. New Project → Postgres
4. Copy connection string

**Option C: PlanetScale** (Good for scaling)
1. Go to https://planetscale.com
2. Create database
3. Get connection string

### Step 2: Deploy to Vercel (Recommended)

1. **Push to GitHub first:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - DARIMAC TECHNOLOGIES"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`: Your database connection string
     - `CLOUDINARY_CLOUD_NAME`: dmvr3aubu
     - `CLOUDINARY_API_KEY`: 351641278437436  
     - `CLOUDINARY_API_SECRET`: yLbkCgLekbnDNlXgxAWH2Z431I0
   - Click Deploy

3. **After deployment:**
   - Run database setup: `npx prisma db push`
   - Add some sample products through admin dashboard

### Step 3: Alternative - Deploy to Railway

1. Go to https://railway.app
2. Create new project from GitHub
3. Add same environment variables
4. Deploy automatically

## Post-Deployment Testing Checklist
- [ ] Homepage loads correctly
- [ ] Admin dashboard accessible
- [ ] Can add products
- [ ] Can view products
- [ ] Cart functionality works
- [ ] Orders can be placed
- [ ] Images upload properly

## Live URL
Once deployed, your store will be available at:
- Vercel: `https://your-app-name.vercel.app`
- Railway: `https://your-app-name.railway.app`

## Need Help?
Contact: darimacdigital@gmail.com
Phone: 076 458 0193