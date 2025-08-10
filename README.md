# DARIMAC TECHNOLOGIES - Computer Accessories Store

A modern e-commerce platform for computer accessories built with Next.js 15, React 19, Prisma, and Tailwind CSS.

## 🚀 Features

- **Product Management**: Add, edit, delete products with multiple images
- **Shopping Cart**: Persistent cart with local storage
- **Order System**: Complete order management without payment processing
- **Admin Dashboard**: Manage products and orders
- **Responsive Design**: Mobile-friendly interface
- **Search & Filter**: Product search and category filtering
- **Image Upload**: Cloudinary integration for image hosting
- **Modern UI**: Blue technology theme with gradient designs

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM (SQLite for development, PostgreSQL for production)
- **Image Storage**: Cloudinary
- **Deployment**: Vercel (recommended)

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd computer-accessories
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your Cloudinary credentials and database URL.

4. **Set up database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3001](http://localhost:3001) to see the application.

## 📦 Deployment

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
4. Deploy!

For detailed deployment instructions, see [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md).

## 🏪 Store Information

**DARIMAC TECHNOLOGIES**
- Address: Kurunegala Road Polpithigama, Kurunegala 60620, Sri Lanka
- Phone: 076 458 0193
- Email: darimacdigital@gmail.com
- Hours: Monday-Saturday 9:00 AM - 6:00 PM

## 🖼 Screenshots

### Homepage
- Product grid with search and filtering
- Technology-themed design
- Responsive layout

### Admin Dashboard
- Product management with image upload
- Order management system
- Tabbed interface

### Shopping Cart
- Modal-based cart interface
- Customer information form
- Order placement system

## 🎯 Key Features Implemented

### ✅ Product Management
- Multiple image upload per product
- Category-based organization
- Stock management
- CRUD operations

### ✅ Shopping Experience
- Add to cart functionality
- Persistent cart (localStorage)
- Product search and filtering
- Pagination

### ✅ Order System
- Customer information capture
- Order placement without payment
- Order status management
- Admin order dashboard

### ✅ Modern Design
- Technology theme (blue/cyan gradients)
- Responsive design
- Professional UI/UX
- Loading states and animations

## 📱 Contact & Support

For technical support or business inquiries:
- **Phone**: 076 458 0193
- **Email**: darimacdigital@gmail.com
- **Location**: Kurunegala, Sri Lanka

## 📄 License

© 2024 DARIMAC TECHNOLOGIES. All rights reserved.

---

Built with ❤️ for quality computer accessories in Kurunegala."# darimac-computer-web" 
