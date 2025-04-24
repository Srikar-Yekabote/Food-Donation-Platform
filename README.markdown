# AI-Powered Food Donation & Redistribution Platform

## Overview

The AI-Powered Food Donation & Redistribution Platform is a web-based solution designed to connect donors (individuals, restaurants, grocery stores) with food banks, shelters, and volunteers to reduce food waste and alleviate hunger in local communities. The platform leverages artificial intelligence to predict food expiry dates and matches donors with volunteers for pickups based on geolocation.

## Key Features

- **AI-Based Expiry Prediction**: Predicts food expiry dates to prioritize pickups.
- **Geolocation Matching**: Connects donations to nearby food banks, shelters, and volunteers.
- **Volunteer System**: Tracks pickup status (Pickup, In Transit, Delivered) and volunteer registration.
- **Donation History**: Provides donors with a record of their contributions.
- **Volunteer Dashboard**: Displays analytics for volunteer activities.
- **SMS Notifications**: Sends updates for pickups and deliveries via Twilio.
- **Priority Pickup**: Flags urgent donations based on expiry or manual settings.
- **Rewards System**: Incentivizes volunteers for completed deliveries.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Prediction**: Custom algorithm for expiry prediction
- **Geolocation**: Google Maps API
- **Authentication**: JWT-based token authentication
- **SMS Notifications**: Twilio API
- **Mapping/Directions**: Google Maps API

## Features

### 1. Food Donation System

- Donors can list food donations with details like name, quantity, expiry, and location.
- Edit, delete, or cancel donations before pickup.
- Receive notifications when donations are picked up.

### 2. Volunteer System

- Volunteers register and view nearby donations.
- Claim donations and track pickup status (Picked Up, In Transit, Delivered).
- Earn rewards based on completed deliveries.

### 3. Geolocation and Mapping

- Donations sorted by proximity to volunteers.
- Google Maps API provides donation locations and real-time directions.

### 4. Analytics

- Donors view donation history and status.
- Volunteers access pickup and delivery statistics.

### 5. Priority Pickup

- Prioritizes donations nearing expiry or marked urgent.
- Alerts volunteers for faster processing.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/food-donation-platform.git
   cd food-donation-platform
   ```

2. **Install Backend Dependencies**:

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:

   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**: Create a `.env` file in the `backend` directory with:

   ```bash
   MONGO_URI=your_mongo_connection_string
   GOOGLE_API_KEY=your_google_maps_api_key
   TWILIO_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   JWT_SECRET=your_jwt_secret
   ```

5. **Start the Backend Server**:

   ```bash
   cd backend
   npm start
   ```

6. **Start the Frontend Server**:

   ```bash
   cd ../frontend
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user (donor/volunteer).
- `POST /api/auth/login`: Log in and receive a JWT token.

### Food Donations

- `POST /api/food/list`: List a new food donation.
- `GET /api/food/available`: Retrieve available donations.
- `POST /api/food/edit/:id`: Edit a donation.
- `DELETE /api/food/delete/:id`: Delete a donation.

### Volunteer Management

- `POST /api/volunteer/register`: Register a volunteer.
- `POST /api/volunteer/claim/:foodId`: Claim a donation for pickup.
- `GET /api/volunteer/dashboard`: View pickup status and history.

### OTP Verification

- `POST /api/food/reserve/:foodId`: Reserve a donation with OTP.
- `POST /api/food/mark-as-delivered/:foodId`: Mark donation as delivered after OTP verification.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: React.js
- **APIs**: Google Maps (geolocation/routing), Twilio (SMS)
- **Authentication**: JWT

## Future Enhancements

- Real-time notifications for pickup and delivery status.
- AI-driven food waste pattern predictions.
- Expanded volunteer rewards system.
- Integration with additional food banks and organizations.

## Contributing

Contributions are welcome! Fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For inquiries or feedback, reach out at email@example.com.