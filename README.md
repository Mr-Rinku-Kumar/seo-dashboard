# 🚀 SEO Dashboard & Dynamic Homepage Management System

A complete, production-ready admin dashboard for managing website SEO, schema markup, and dynamic homepage content with automatic head tag injection.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Deployment](#deployment)
- [Live Demo](#live-demo)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **SEO Dashboard** is a full-stack web application that allows administrators to:

- ✅ Manage complete website SEO settings (Meta tags, Open Graph, Twitter Cards)
- ✅ Generate and inject JSON-LD Schema markup (5 schema types)
- ✅ Dynamically manage homepage content (Hero, About, Vehicles, Occasions, Testimonials, Gallery, Contact)
- ✅ Upload and manage media with SEO-friendly alt tags
- ✅ Reorder vehicles with drag-and-drop functionality
- ✅ Role-based access control (Admin/Editor)
- ✅ Automatic head tag injection for SEO optimization
- ✅ Mobile-responsive admin panel and public website

All changes made through the admin panel reflect instantly on the website without modifying source code.

---

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin / Editor)
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- User management (Admin only)

### 🔍 SEO Management
- Meta Title, Description, Keywords
- Canonical URL
- Robots Tags (Index/Noindex, Follow/Nofollow)
- Open Graph Tags (OG Title, Description, Image)
- Twitter Card Tags (Title, Description, Image)
- Automatic head section injection

### 📐 Schema Management
- Organization Schema
- FAQ Schema
- Breadcrumb Schema
- Website Schema
- Local Business Schema
- Automatic JSON-LD generation and injection

### 🏠 Dynamic Homepage Management
- **Hero Section**: Heading, Sub-heading, Banner Image, CTA
- **About Us**: Title, Description, Featured Image
- **Vehicles**: Name, Image, Seating Capacity, Description, Features
- **Occasions**: Title, Description, Image
- **Testimonials**: Customer Name, Review, Rating, Image
- **Gallery**: Image Upload, Alt Tags
- **Contact**: Phone, Email, Address, Google Map Embed

### 🎨 UI/UX Features
- Responsive design (Mobile, Tablet, Desktop)
- Modern, clean interface
- Drag-and-drop vehicle reordering
- Image upload with preview
- Toast notifications
- Loading states
- Error handling with retry

### 🛡️ Security
- JWT authentication
- Role-based permissions
- Input validation
- CORS configuration
- Rate limiting
- Helmet.js security headers

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.9 | React framework with App Router |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| React Hook Form | 7.x | Form handling |
| Zod | 3.x | Schema validation |
| React Hot Toast | 2.x | Toast notifications |
| Heroicons | 2.x | Icons |
| DnD Kit | Latest | Drag-and-drop |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | Web framework |
| MongoDB Atlas | Latest | Cloud database |
| Mongoose | 7.x | ODM |
| JWT | 9.x | Authentication |
| Bcrypt | 2.x | Password hashing |
| Cloudinary | Latest | File upload & storage |
| CORS | 2.x | Cross-origin resource sharing |
| Helmet | 7.x | Security headers |

---

## Project Structure

### Frontend Structure
frontend/
├── app/
│ ├── (admin)/
│ │ ├── dashboard/
│ │ ├── homepage/
│ │ │ ├── about/
│ │ │ ├── gallery/
│ │ │ ├── hero/
│ │ │ ├── occasions/
│ │ │ ├── testimonials/
│ │ │ └── vehicles/
│ │ ├── seo/
│ │ │ ├── schema/
│ │ │ └── page.tsx
│ │ ├── settings/
│ │ │ ├── contact/
│ │ │ └── page.tsx
│ │ ├── users/
│ │ └── layout.tsx
│ ├── login/
│ │ ├── LoginClient.tsx
│ │ └── page.tsx
│ ├── vehicles/
│ │ └── [slug]/
│ │ └── page.tsx
│ ├── favicon.ico
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
├── components/
│ ├── ImageUpload.tsx
│ ├── JsonLd.tsx
│ └── MobileNav.tsx
├── hooks/
│ └── useAuth.ts
├── lib/
│ ├── api-client.ts
│ ├── data.ts
│ └── metadata.ts
├── public/
├── .env.local
├── package.json
├── tailwind.config.js
├── next.config.ts
└── tsconfig.json

text

### Backend Structure
backend/
├── src/
│ ├── config/
│ │ └── database.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── homepageController.js
│ │ ├── schemaController.js
│ │ ├── seoController.js
│ │ └── uploadController.js
│ ├── middleware/
│ │ ├── auth.js
│ │ └── upload.js
│ ├── models/
│ │ ├── About.js
│ │ ├── Contact.js
│ │ ├── Gallery.js
│ │ ├── Hero.js
│ │ ├── Occasion.js
│ │ ├── Schema.js
│ │ ├── SEO.js
│ │ ├── Testimonial.js
│ │ ├── User.js
│ │ └── Vehicle.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── homepageRoutes.js
│ │ ├── schemaRoutes.js
│ │ ├── seoRoutes.js
│ │ └── uploadRoutes.js
│ └── utils/
│ └── helpers.js
├── uploads/
├── .env
├── package.json
└── server.js

text

---

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/Mr-Rinku-Kumar/seo-dashboard.git
cd seo-dashboard
Step 2: Setup Backend
bash
cd backend
npm install
Create a .env file in the backend directory:

env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/seo_dashboard?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Note: Replace <username>, <password>, and <cluster> with your MongoDB Atlas credentials.

Step 3: Setup Frontend
bash
cd frontend
npm install
Create a .env.local file in the frontend directory:

env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Step 4: Create Admin User
bash
cd backend
node src/scripts/createAdmin.js
Environment Variables
Backend (.env)
Variable	Description	Example
PORT	Server port	5000
MONGODB_URI	MongoDB connection string	mongodb+srv://...
JWT_SECRET	Secret key for JWT	your_secret_key
JWT_EXPIRE	JWT expiration time	7d
NODE_ENV	Environment	development
UPLOAD_PATH	Upload directory	./uploads
MAX_FILE_SIZE	Max file size (bytes)	5242880
CLOUDINARY_CLOUD_NAME	Cloudinary cloud name	your_cloud_name
CLOUDINARY_API_KEY	Cloudinary API key	your_api_key
CLOUDINARY_API_SECRET	Cloudinary API secret	your_api_secret
Frontend (.env.local)
Variable	Description	Example
NEXT_PUBLIC_API_URL	Backend API URL	http://localhost:5000/api
Running the Application
Start Backend Server
bash
cd backend
npm run dev
Server will run on: http://localhost:5000

Start Frontend Server
bash
cd frontend
npm run dev
Application will run on: http://localhost:3000

Login Credentials
text
Email: admin@example.com
Password: Admin123!
API Documentation
Authentication Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get current user
GET	/api/auth/users	Get all users (Admin only)
PUT	/api/auth/users/:id	Update user (Admin only)
DELETE	/api/auth/users/:id	Delete user (Admin only)
SEO Endpoints
Method	Endpoint	Description
GET	/api/seo	Get SEO settings
POST	/api/seo	Update SEO settings
GET	/api/seo/public	Get public SEO settings
Schema Endpoints
Method	Endpoint	Description
GET	/api/schemas	Get all schemas
POST	/api/schemas	Create/update schema
GET	/api/schemas/public	Get public schemas
DELETE	/api/schemas/:id	Delete schema
Homepage Endpoints
Method	Endpoint	Description
GET/POST	/api/homepage/hero	Manage hero section
GET/POST	/api/homepage/about	Manage about section
GET/POST	/api/homepage/vehicles	Manage vehicles
POST	/api/homepage/vehicles/reorder	Reorder vehicles
GET/POST	/api/homepage/occasions	Manage occasions
GET/POST	/api/homepage/testimonials	Manage testimonials
GET/POST	/api/homepage/gallery	Manage gallery
GET/POST	/api/homepage/contact	Manage contact
Upload Endpoints
Method	Endpoint	Description
POST	/api/upload	Upload single image
POST	/api/upload/multiple	Upload multiple images
DELETE	/api/upload/:filename	Delete uploaded file
Testing
Test Login
bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
Test SEO API
bash
curl http://localhost:5000/api/seo/public
Test Vehicles API
bash
curl http://localhost:5000/api/homepage/vehicles/public
Deployment
Deploy Backend (Render)
Push code to GitHub repository

Create a new Web Service on Render

Connect your GitHub repository

Set environment variables

Add persistent disk for uploads

Deploy

Deploy Frontend (Vercel)
bash
cd frontend
vercel --prod
Or deploy via Vercel Dashboard:

Import your GitHub repository

Set environment variables

Deploy

Docker Deployment
bash
docker-compose up -d
Live Demo
Service	URL
Frontend	https://seo-dashboard-blush-one.vercel.app
Backend API	https://seo-dashboard-vv2j.onrender.com/api
Health Check	https://seo-dashboard-vv2j.onrender.com/api/health
Demo Credentials
text
Email: admin@example.com
Password: Admin123!
Contributing
Fork the repository

Create a feature branch: git checkout -b feature-name

Commit changes: git commit -m 'Add feature'

Push: git push origin feature-name

Create a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.

📧 Contact
For support or queries, please contact:

Email: support@seodashboard.com

GitHub: Mr-Rinku-Kumar

🙏 Acknowledgments
Next.js team for the amazing framework

Tailwind CSS for the utility-first CSS framework

MongoDB Atlas for the cloud database solution

Cloudinary for image hosting

All open-source contributors

Built with ❤️ by Rinku Kumar