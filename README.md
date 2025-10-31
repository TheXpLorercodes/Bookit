🎯 Overview
BookIt is a modern, full-stack web application for booking travel experiences. Users can browse hundreds of unique travel experiences, select their preferred dates and times, and complete bookings seamlessly. The platform features a beautiful responsive design, real-time price calculations, and support for promotional codes.

✨ Key Features
🌍 Browse Experiences: 10+ curated travel experiences

🔍 Smart Search: Filter by experience name or location

📅 Date Selection: Unique dates with multiple time slots

💰 Real-time Pricing: Instant price calculation

🎟️ Promo Codes: Support for discount codes

📱 Responsive Design: Works on mobile, tablet, and desktop

⚡ Fast Performance: Built with Vite and React

🔒 TypeScript: Full type safety

🎨 Beautiful UI: Professional design with smooth animations

✅ Form Validation: Client and server-side validation

📋 Table of Contents
Quick Start

Installation

Project Structure

Frontend

Backend

API Documentation

Features

Configuration

Troubleshooting

Contributing

🚀 Quick Start
Prerequisites
Node.js v14 or higher

npm or yarn package manager

Modern web browser

Clone & Setup (5 minutes)
bash
# 1. Create project folder
mkdir bookit
cd bookit

# 2. Create frontend & backend folders
mkdir frontend backend

# 3. Setup Frontend
cd frontend
npm create vite@latest . -- --template react-ts
npm install axios react-router-dom
npm run dev

# 4. Setup Backend (new terminal)
cd backend
npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
npm run dev
📦 Installation
Step 1: Frontend Installation
bash
cd frontend

# Install dependencies
npm install

# Install additional packages
npm install axios react-router-dom

# Start development server
npm run dev
Frontend runs on: http://localhost:5173

Step 2: Backend Installation
bash
cd backend

# Install dependencies
npm install

# Install dev dependencies
npm install --save-dev nodemon

# Start development server
npm run dev
Backend runs on: http://localhost:5000

Step 3: Verify Setup
Open http://localhost:5173 in your browser

You should see the BookIt homepage

Click on any experience to test the booking flow

Complete a mock booking to verify everything works

🏗️ Project Structure
Frontend Directory
text
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Navigation component
│   │   ├── Footer.tsx           # Footer component
│   │   └── ExperienceCard.tsx   # Experience card component
│   ├── pages/
│   │   ├── HomePage.tsx         # Home page with experience list
│   │   ├── DetailsPage.tsx      # Experience details & booking
│   │   ├── CheckoutPage.tsx     # Checkout form
│   │   └── ResultPage.tsx       # Booking confirmation
│   ├── context/
│   │   └── BookingContext.tsx   # Global state management
│   ├── App.tsx                  # Main app component with routes
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global styles
│   ├── types.ts                 # TypeScript interfaces
│   └── api.ts                   # API client
├── public/                      # Static files
├── index.html                   # HTML template
├── package.json
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── .env                        # Environment variables
└── .gitignore

Backend Directory
text
backend/
├── src/
│   └── server.js               # Express server
├── package.json
├── .env                        # Environment variables
└── .gitignore
💻 Frontend
Overview
Built with React 18, TypeScript, React Router, and Axios. Uses Vite as the build tool for lightning-fast development.

Pages
HomePage.tsx
Displays all available experiences in a responsive grid

Search functionality to filter experiences

Hero section with gradient background

Loading and error states

DetailsPage.tsx
Shows complete experience information

Date picker with unique dates (no duplicates!)

Time slot selection (2 slots per day)

Number of people selector

Real-time price calculation

Booking summary sidebar

CheckoutPage.tsx
Customer information form (name, email, phone)

Promo code validation

Order summary with price breakdown

Form validation

Automatic redirect to result page

ResultPage.tsx
Booking confirmation

Large, prominent booking ID display

Experience details recap

Guest information display

Price summary with discount

"Book Another Experience" button

Context
BookingContext.tsx provides global state management for:

selectedExperience - Currently selected experience

selectedSlot - Currently selected time slot

numPeople - Number of travelers

Methods to update all values

Styling
Uses pure CSS (no Tailwind) with:

Utility classes for layout and spacing

Responsive design utilities

Color system with CSS variables

Smooth transitions and hover states

Mobile-first responsive design

🔧 Backend
Overview
Built with Express.js and Node.js. Provides REST API for experience browsing, booking creation, and promo code validation.

Key Features
CORS enabled for frontend communication

Mock data with 10 pre-loaded experiences

Unique date generation (no duplicate dates!)

Full booking object returns (no data loss)

Console logging for debugging

Error handling on all endpoints

Mock Data
Experiences (10 total)
Sunset Desert Safari - Dubai, UAE

Hot Air Balloon Ride - Cappadocia, Turkey

Snorkeling Adventure - Great Barrier Reef

Mountain Trekking - Swiss Alps

Wine Tasting Tour - Napa Valley

Cooking Class - Tuscany, Italy

Northern Lights Tour - Iceland

Safari Wildlife Tour - Tanzania

Surfing Lessons - Bali, Indonesia

Historical City Walking Tour - Rome, Italy

Promo Codes
Code	Type	Value	Min Amount
SAVE10	Percentage	10%	$50
FLAT100	Fixed	$100	$500
WELCOME20	Percentage	20%	$100
🔌 API Documentation
Base URL
text
http://localhost:5000/api
Endpoints
GET /experiences
Get all experiences with pagination

Query Parameters:

page (optional, default: 1)

limit (optional, default: 10)

Response:

json
{
  "experiences": [
    {
      "id": "exp-001",
      "title": "Sunset Desert Safari",
      "description": "Experience the breathtaking beauty...",
      "location": "Dubai, UAE",
      "category": "Adventure",
      "pricePerPerson": 89.99,
      "duration": "4 hours",
      "maxCapacity": 15,
      "imageUrl": "https://..."
    }
  ],
  "total": 10,
  "page": 1,
  "totalPages": 1
}
GET /experiences/:id
Get single experience with all time slots

Response:

json
{
  "experience": {
    "id": "exp-001",
    "title": "Sunset Desert Safari",
    "description": "...",
    "location": "Dubai, UAE",
    "category": "Adventure",
    "pricePerPerson": 89.99,
    "duration": "4 hours",
    "maxCapacity": 15,
    "imageUrl": "https://...",
    "slots": [
      {
        "id": "slot-exp-001-1-1",
        "experienceId": "exp-001",
        "date": "2025-11-08",
        "startTime": "09:00",
        "endTime": "12:00",
        "availableSpots": 8,
        "totalSpots": 15,
        "isActive": true
      },
      {
        "id": "slot-exp-001-1-2",
        "experienceId": "exp-001",
        "date": "2025-11-08",
        "startTime": "14:00",
        "endTime": "17:00",
        "availableSpots": 12,
        "totalSpots": 15,
        "isActive": true
      }
    ]
  }
}
POST /bookings
Create a new booking

Request Body:

json
{
  "experience_id": "exp-001",
  "slot_id": "slot-exp-001-1-1",
  "num_people": 2,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "promo_code": "SAVE10"
}
Response:

json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "booking-1761937386384",
    "experienceId": "exp-001",
    "slotId": "slot-exp-001-1-1",
    "numPeople": 2,
    "totalAmount": 179.98,
    "discountAmount": 18,
    "finalAmount": 161.98,
    "promoCode": "SAVE10",
    "status": "confirmed",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "createdAt": "2025-11-01T00:30:00.000Z",
    "experience": { /* full experience object */ },
    "slot": { /* full slot object */ }
  }
}
GET /bookings/:id
Get booking details

Response:

json
{
  "booking": {
    "id": "booking-1761937386384",
    /* Full booking object */
  }
}
POST /promo/validate
Validate promo code

Request Body:

json
{
  "code": "SAVE10",
  "booking_amount": 179.98
}
Response (Valid):

json
{
  "valid": true,
  "discountType": "percentage",
  "discountValue": 10,
  "discountAmount": 18,
  "message": "Promo code is valid"
}
Response (Invalid):

json
{
  "valid": false,
  "message": "Invalid promo code"
}
🎨 Features in Detail
1. Experience Browsing
Hero section with eye-catching gradient

Grid layout of experience cards

Each card shows image, title, location, duration, and price

Hover effects and smooth transitions

"View Details" button on each card

2. Date & Time Selection
Smart date picker - Shows only unique dates (no repeats!)

Each date shows 2 available time slots (morning & afternoon)

Real-time availability display

Sold-out slots are disabled

3. Booking Summary
Live price calculation

Shows all selected details

Sticky sidebar on desktop

Mobile-friendly layout

4. Promo Code Support
Apply discount codes on checkout page

Real-time code validation

Display discount amount

Support for percentage and fixed discounts

5. Booking Confirmation
Large, prominent booking ID in blue section

Complete booking details

Guest information recap

Price breakdown with discount

Confirmation email message

"Book Another Experience" button

6. Responsive Design
Mobile (320px+)

Tablet (768px+)

Desktop (1024px+)

Touch-friendly buttons and inputs

⚙️ Configuration
Frontend Environment (.env)
text
VITE_API_BASE_URL=http://localhost:5000/api
Backend Environment (.env)
text
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
Package.json Scripts
Frontend:

bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
Backend:

bash
npm run dev      # Start with nodemon
npm start        # Start production server
🐛 Troubleshooting
Issue: "Cannot GET /api/experiences"
Solution: Ensure backend is running with npm run dev

Issue: "CORS error"
Solution: Check that CLIENT_URL in backend .env matches frontend URL

Issue: "Cannot find module"
Solution: Run npm install in both frontend and backend directories

Issue: "Port already in use"
Solution:

Change PORT in .env

Or kill process: lsof -ti:5000 | xargs kill -9

Issue: "Booking ID not showing"
Solution: Clear browser cache and refresh

Issue: "Text is faded/light"
Solution: Update src/index.css with provided clean CSS

Issue: "Duplicate dates appearing"
Solution: Update backend server.js with latest version

🚀 Deployment
Frontend (Vercel)
bash
# Build
npm run build

# Deploy
vercel
Backend (Heroku)
bash
# Create Procfile
echo "web: node src/server.js" > Procfile

# Deploy
heroku create
heroku config:set PORT=5000
git push heroku main
Environment Variables
Update these in your hosting platform:

VITE_API_BASE_URL (Frontend)

CLIENT_URL (Backend)

PORT (Backend)

📚 Technologies Used
Frontend
React 18 - UI library

TypeScript - Type safety

React Router v6 - Routing

Axios - HTTP client

Vite - Build tool

CSS3 - Styling

Backend
Node.js - Runtime

Express.js - Web framework

CORS - Cross-origin support

dotenv - Environment variables

📝 File Reference
File	Purpose	Status
src/pages/DetailsPage.tsx	Experience details	✅ Complete
src/pages/CheckoutPage.tsx	Checkout form	✅ Complete
src/pages/ResultPage.tsx	Booking confirmation	✅ Complete
src/pages/HomePage.tsx	Experience list	✅ Complete
src/context/BookingContext.tsx	State management	✅ Complete
backend/src/server.js	API server	✅ Complete
src/index.css	Global styles	✅ Complete
src/api.ts	API client	✅ Complete
src/types.ts	TypeScript types	✅ Complete
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License. See LICENSE file for details.

👨‍💻 Author
Built with ❤️ by your development team

📞 Support & Contact
For support, email: support@bookit.com
Or open an issue on GitHub

🎉 Acknowledgments
Unsplash for beautiful travel images

React community for amazing tools

Our users for feedback and suggestions

🔄 Version History
v1.0.0 (Current)
✅ Initial release

✅ 10 travel experiences

✅ Full booking flow

✅ Promo code support

✅ Responsive design

✅ Complete documentation

✅ Quick Checklist
Before going live, ensure:

 Frontend builds successfully

 Backend API working

 All CRUD operations functional

 Forms validate correctly

 Promo codes working

 Responsive design tested

 Cross-browser tested

 Performance optimized

 Security reviewed

 Error handling complete

