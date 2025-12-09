# Wyo Server

This folder contains a simple Express backend for authentication and image upload (Cloudinary), using MongoDB for persistence.

Environment

- Copy `.env.template` to `.env` and fill values:
  - `PORT` - port to run the server (default 4000)
  - `MONGO_URI` - MongoDB connection string
  - `JWT_SECRET` - secret used to sign JWT tokens
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary credentials

Install

- From `server` folder run:
  - `npm install`

Run

- Development (with nodemon):
  - `npm run dev`
- Production:
  - `npm start`

API Endpoints

- POST `/api/auth/register` { name, email, password } -> { token, user }
- POST `/api/auth/login` { email, password } -> { token, user }
- GET `/api/user/me` (Auth: `Authorization: Bearer <token>`) -> { user }
- POST `/api/user/me/upload` (Auth + multipart form-data `image`) -> { user }

Notes

- Multer uses memory storage; uploaded files are streamed to Cloudinary.
- Passwords are hashed with `bcryptjs`.
- JWT tokens are signed with `JWT_SECRET`.
