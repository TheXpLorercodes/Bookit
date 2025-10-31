📖 BookIt - Complete Project Documentation
🎯 Project Overview
BookIt is a full-stack travel experiences booking application built with React, TypeScript, and Express.js. Users can browse travel experiences, select dates and times, provide customer information, and complete bookings.

✨ Features
Browse 10+ travel experiences

Search experiences by name or location

Select dates and time slots

Validate promo codes

Complete bookings with customer information

View booking confirmation with ID

Responsive design

Real-time price calculation

🏗️ Project Structure
text
bookit/
├── frontend/                 # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Header.tsx   # Navigation header
│   │   │   ├── Footer.tsx   # Footer
│   │   │   └── ExperienceCard.tsx  # Experience card
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.tsx      # Browse experiences
│   │   │   ├── DetailsPage.tsx   # Experience details & booking
│   │   │   ├── CheckoutPage.tsx  # Customer info & payment
│   │   │   └── ResultPage.tsx    # Booking confirmation
│   │   ├── context/
│   │   │   └── BookingContext.tsx  # Global state management
│   │   ├── App.tsx          # Main app with routing
│   │   ├── main.tsx         # React entry point
│   │   ├── index.css        # Global styles
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── api.ts           # API service layer
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
│
└── backend/                 # Express.js Backend
    ├── src/
    │   └── server.js        # Main server file
    ├── package.json
    ├── .env
    └── .gitignore
🚀 Quick Start
Prerequisites
Node.js (v14+)

npm or yarn

Installation
1. Frontend Setup
bash
cd frontend
npm install
npm run dev
Frontend runs on: http://localhost:5173

2. Backend Setup (New Terminal)
bash
cd backend
npm install
npm run dev
Backend runs on: http://localhost:5000

📁 Component Documentation
Frontend Components
HomePage.tsx
Displays all travel experiences with search functionality.

Features:

Hero section with search bar

Grid display of experiences

Filter by name or location

Loading states

Error handling

Props: None (uses API)

State:

experiences[] - List of all experiences

search - Search query

loading - Loading state

error - Error message

DetailsPage.tsx
Shows experience details and allows booking selection.

Features:

Experience image and description

Date picker (unique dates only)

Time slot selection

Number of people counter

Booking summary sidebar

Price calculation

Props: None (uses URL params)

State:

experience - Current experience details

selectedDate - Selected booking date

selectedSlot - Selected time slot

numPeople - Number of people

loading - Loading state

error - Error message

CheckoutPage.tsx
Customer information and payment confirmation.

Features:

Customer name, email, phone input

Promo code validation

Order summary

Price breakdown

Form validation

Redirect to result page

Props: None (uses context)

State:

formData - Customer information

promoValidation - Promo code validation result

loading - Loading state

error - Error message

validationErrors - Form validation errors

ResultPage.tsx
Booking confirmation page.

Features:

Display booking ID (large, prominent)

Experience details

Booking information

Guest information

Price summary with discount

Confirmation message

"Book Another" button

Props: None (uses URL params)

State:

booking - Booking details

loading - Loading state

error - Error message

Header.tsx
Navigation header component.

Features:

Logo/brand name

Navigation links

Footer.tsx
Footer component.

Features:

Company information

Quick links

Contact information

Copyright notice

ExperienceCard.tsx
Reusable card component for displaying experiences.

Props:

experience: Experience - Experience data

Features:

Experience image

Category badge

Title, location, description

Price per person

Duration

Click to view details

Context & State Management
BookingContext.tsx
Global state management for booking flow.

Provides:

selectedExperience - Selected experience

selectedSlot - Selected time slot

numPeople - Number of people

setSelectedExperience() - Set experience

setSelectedSlot() - Set slot

setNumPeople() - Set number of people

resetBooking() - Reset all booking data

🔌 API Documentation
Base URL
text
http://localhost:5000/api
Endpoints
GET /experiences
Get all experiences with pagination.

Query Parameters:

page (default: 1)

limit (default: 10)

Response:

json
{
  "experiences": [...],
  "total": 10,
  "page": 1,
  "totalPages": 1
}
GET /experiences/:id
Get single experience with time slots.

Response:

json
{
  "experience": {
    "id": "exp-001",
    "title": "Experience Name",
    "description": "Description",
    "location": "Location",
    "category": "Category",
    "pricePerPerson": 99.99,
    "duration": "3 hours",
    "maxCapacity": 10,
    "imageUrl": "url",
    "slots": [
      {
        "id": "slot-1",
        "date": "2024-11-08",
        "startTime": "09:00",
        "endTime": "12:00",
        "availableSpots": 5,
        "totalSpots": 10
      }
    ]
  }
}
POST /bookings
Create a new booking.

Request Body:

json
{
  "experience_id": "exp-001",
  "slot_id": "slot-1",
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
    "slotId": "slot-1",
    "numPeople": 2,
    "totalAmount": 199.98,
    "discountAmount": 20,
    "finalAmount": 179.98,
    "promoCode": "SAVE10",
    "status": "confirmed",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "createdAt": "2024-11-01T00:30:00Z",
    "experience": {...},
    "slot": {...}
  }
}
GET /bookings/:id
Get booking details.

Response:

json
{
  "booking": {
    "id": "booking-1761937386384",
    ...
  }
}
POST /promo/validate
Validate promo code.

Request Body:

json
{
  "code": "SAVE10",
  "booking_amount": 199.98
}
Response:

json
{
  "valid": true,
  "discountType": "percentage",
  "discountValue": 10,
  "discountAmount": 20,
  "message": "Promo code is valid"
}
💾 Data Types
Experience
typescript
interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  pricePerPerson: number;
  duration: string;
  maxCapacity: number;
  imageUrl: string;
}
TimeSlot
typescript
interface TimeSlot {
  id: string;
  experienceId: string;
  date: string;
  startTime: string;
  endTime: string;
  availableSpots: number;
  totalSpots: number;
  isActive: boolean;
}
Booking
typescript
interface Booking {
  id: string;
  experienceId: string;
  slotId: string;
  numPeople: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  promoCode?: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  createdAt: string;
  experience?: Experience;
  slot?: TimeSlot;
}
🎨 Styling
CSS Classes
Buttons
.btn-primary - Primary action button

.btn-secondary - Secondary action button

Forms
.input-field - Text input styling

Cards
.card - Card container

Text
.text-xs, .text-sm, .text-base, .text-lg, .text-xl, .text-2xl, .text-4xl, .text-6xl

.font-semibold, .font-bold

.text-primary-600, .text-gray-600, .text-red-600, .text-green-600

Spacing
.mb-2, .mb-4, .mb-6, .mb-8, .mb-12

.p-2, .p-4, .p-6, .p-8

.gap-2, .gap-4, .gap-6, .gap-8

Layout
.flex, .flex-col, .items-center, .justify-center, .justify-between

.grid, .grid-cols-1, .grid-cols-2, .grid-cols-3, .grid-cols-4

.max-w-2xl, .max-w-7xl, .mx-auto

🔐 Environment Variables
Frontend (.env)
text
VITE_API_BASE_URL=http://localhost:5000/api
Backend (.env)
text
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
📝 Promo Codes (Test Data)
Code	Type	Value	Minimum
SAVE10	Percentage	10% off	$50
FLAT100	Fixed	$100 off	$500
WELCOME20	Percentage	20% off	$100
🐛 Troubleshooting
Issue: Backend not connecting
Solution:

Ensure backend is running: npm run dev

Check PORT is 5000

Verify CORS is enabled

Issue: Dates showing duplicates
Solution:

Update backend server.js to use unique dates

Restart backend server

Issue: Text is faded/light
Solution:

Update src/index.css with index-CLEAN.css

Refresh browser

Issue: Booking ID not showing
Solution:

Ensure backend returns full booking object

Check ResultPage uses correct booking ID from URL params

📱 Browser Support
Chrome (latest)

Firefox (latest)

Safari (latest)

Edge (latest)

🚀 Deployment
Frontend (Vercel/Netlify)
Build: npm run build

Deploy dist folder

Set environment variables

Backend (Heroku/Railway)
Set environment variables

Deploy src/server.js

Update CORS origin

📚 Technologies Used
Frontend
React 18

TypeScript

React Router

Axios

Vite

TailwindCSS (optional)

Backend
Node.js

Express.js

CORS

dotenv

📄 File Checksums
File	Type	Status
src/pages/DetailsPage.tsx	✅ Complete	Working
src/pages/CheckoutPage.tsx	✅ Complete	Working
src/pages/ResultPage.tsx	✅ Complete	Working
src/pages/HomePage.tsx	✅ Complete	Working
backend/src/server.js	✅ Complete	Working
src/index.css	✅ Complete	Working
🤝 Contributing
Fork the repository

Create a feature branch

Make your changes

Submit a pull request

📝 License
MIT License - Feel free to use this project

📞 Support
For issues or questions, please refer to the documentation or contact support.

✅ Final Checklist
 Frontend setup complete

 Backend setup complete

 All pages working

 API endpoints working

 Promo codes working

 Booking flow complete

 Responsive design

 Error handling

 Loading states

 Documentation complete

Last Updated: November 1, 2025
Version: 1.0.0
Status: Production Ready ✅