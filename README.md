# Freelance Marketplace Backend

This is the Node.js and Express REST API for the Freelance Marketplace application. It powers authentication, user profiles, job listings, and job applications for the frontend app.

## What the backend does

- Handles user signup, login, session lookup, and password changes.
- Serves freelancer and client profile data.
- Provides job CRUD, browsing, and category endpoints.
- Manages freelancer applications and client review workflows.
- Connects the app to MongoDB through Mongoose.

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens for auth
- bcryptjs for password hashing
- express-validator for request validation
- cors, helmet, morgan, and express-rate-limit for API middleware and security

## Project Structure

- `server.js` bootstraps the application, loads middleware, mounts routes, and starts the server.
- `config/db.js` connects to MongoDB.
- `controllers/` contains the business logic for auth, users, jobs, and applications.
- `routes/` defines the API endpoints and validation chains.
- `middleware/` contains auth, validation, and error handling logic.
- `models/` defines the MongoDB schemas.
- `utils/` contains shared helpers such as token generation and pagination.
- `seed.js` can load sample data into the database.

## Main API Areas

- `/api/auth` for signup, login, current user lookup, and password changes.
- `/api/users` for public freelancer listings and protected profile management.
- `/api/jobs` for browsing, creating, updating, and deleting jobs.
- `/api/applications` for submitting, reviewing, updating, and withdrawing applications.
- `/health` for a basic server health check.

## Running Locally

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Fill in the required values in `.env`.

4. Start the development server:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Required Environment Variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret used to sign auth tokens
- `JWT_EXPIRES_IN` - token lifetime, such as `7d`
- `CLIENT_URL` - frontend origin allowed by CORS
- `PORT` - server port, usually `5000` locally or platform-specific in production

## Available Scripts

- `npm start` - start the API in production mode
- `npm run dev` - start the API with nodemon for development
- `npm run lint` - run ESLint
- `npm test` - run the test suite

## Security and Validation

- Passwords are required to be at least 6 characters long.
- CORS is configured to allow the frontend origin.
- Rate limiting is enabled for API routes and stricter limits are applied to auth endpoints.
- Helmet is used to set secure HTTP headers.
- Request validation is handled with express-validator before data reaches controllers.

## Sample Data

The `seedData/` folder contains example clients, freelancers, jobs, and applications that can be loaded with the seed script.

## Notes

- This backend is designed to work with the frontend in the parent folder.
- Do not commit `.env` files or other secrets to the repository.
