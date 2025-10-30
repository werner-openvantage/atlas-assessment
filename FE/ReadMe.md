# Frontend (FE) - Atlas Assessment

This is a Vite + React frontend skeleton using React Router and React Hook Form.

How to run

1. cd FE
2. yarn install
3. yarn dev

Notes and assumptions
- The frontend assumes the backend API runs at `http://localhost:3000`. You can change this by setting `VITE_API_URL` in a `.env` file in `FE/`.
- The frontend calls these backend endpoints (they should exist in `BE`):
  - `POST /auth/login` to login
  - `POST /auth/register` to register (BE should send verification email via Ethereal)
  - `GET /auth/me` to get current user
  - `POST /auth/logout` to logout
  - `GET /users/check-email?email=...` to validate email uniqueness (returns `{ exists: boolean }`)
  - `GET /posts?page=&limit=` and `GET /posts/:id`, `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id`

If any of these endpoints differ, update `FE/src/utils/api.js` accordingly.
# Open Vantage Atlas Assessment - FE

This is the frontend for the Open Vantage Atlas assessment.

## Overview

Please add the setup instructions for the FE here.
