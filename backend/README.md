# Hospital Vaccine Search & Slot Booking Backend

Backend for a hospital vaccine search and booking platform built with Node.js, Express, and MongoDB.

## Features
- User registration, login, and JWT authentication
- Role-based authorization (`patient`, `admin`)
- Vaccine catalog CRUD for admin
- Hospital CRUD and vaccine offerings management
- Daily slot capacity with atomic booking and overbooking prevention
- Search hospitals by city, pincode, vaccine, price, and date
- Geospatial nearby hospital search
- Patient booking, cancellation, rescheduling, and quick rebook
- Email confirmation using Nodemailer/Ethereal
- Swagger API documentation at `/api-docs`
- Rate limiting for global traffic, login, and booking endpoints

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API Docs
Open `http://localhost:5000/api-docs` after starting the server.
