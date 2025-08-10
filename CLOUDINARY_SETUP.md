# Cloudinary Setup Instructions

## 1. Create a Free Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After signing up, you'll be redirected to your dashboard

## 2. Get Your Cloudinary Credentials
In your Cloudinary dashboard, you'll see:
- **Cloud Name**: (e.g., `dxyz123abc`)
- **API Key**: (e.g., `123456789012345`)
- **API Secret**: (e.g., `abcdefghijklmnopqrstuvwxyz`)

## 3. Update Your Environment Variables
Open your `.env` file and replace the placeholder values:

```env
# Replace these with your actual Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## 4. Restart Your Development Server
After updating the `.env` file:
```bash
npm run dev
```

## 5. Test Image Upload
1. Go to http://localhost:3004/admin
2. Click "Add Product"
3. Try uploading an image - it should now go to Cloudinary!

## Features
- ✅ Images stored permanently in Cloudinary
- ✅ Automatic image optimization
- ✅ Fast global CDN delivery
- ✅ No more local storage issues
- ✅ Clean, user-friendly upload interface

## Free Tier Limits
- 25GB storage
- 25GB monthly bandwidth
- 25,000 transformations/month

Perfect for small to medium projects!