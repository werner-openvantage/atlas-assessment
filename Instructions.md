# Atlas Assessment - Complete Setup Guide

## Overview

Atlas is a modern blog application with user authentication, featuring a responsive React frontend and a Node.js/Express backend. The application includes user profile management, blog post creation, editing, and deletion capabilities.

## Project Structure

```
atlas-assessment/
├── FE/                 # React + Vite frontend
├── BE/                 # Node.js + Express backend
├── docker-compose.yml  # PostgreSQL database container
└── Instructions.md     # This file
```

## System Requirements

- Node.js (v16 or higher)
- npm or yarn
- Docker & Docker Compose (for database)
- PostgreSQL (or use Docker)
- Git

## Quick Start (Complete Setup)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd atlas-assessment
```

### 2. Database Setup

Start the PostgreSQL database using Docker:

```bash
docker compose up -d
```

This will start PostgreSQL on port 5436 with credentials:

- User: `postgres`
- Password: `postgres`
- Database: `atlas`

### 3. Backend Setup

```bash
cd BE

# Install dependencies
yarn install
# or
npm install

# Run database migrations
yarn migrate

# Seed the database with sample data
yarn seed

# Start the backend server
yarn start
```

The backend will run on `http://localhost:4000`

**Default Test Credentials:**

- Email: `admin@atlas.co.za`
- Password: `Admin1234@`

### 4. Frontend Setup

```bash
cd FE

# Install dependencies
yarn install
# or
npm install

# Start the development server
yarn dev
```

The frontend will run on `http://localhost:5173`

## Environment Configuration

### Backend (.env)

The `.env` file is already configured in the BE directory with the following settings:

```properties
NODE_ENV=development
PORT=4000
HOST=localhost
JWT_PRIVKEY=QWE&@8123
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://postgres:postgres@localhost:5436/atlas
SMTP_EMAIL=dillon95@ethereal.email
SMTP_PASSWORD=g8FQRMFtruHsDn9zNq
```

**Note:** These are development credentials. Change them for production use.

### Frontend (.env)

Create or update `FE/.env` if needed:

```properties
VITE_API_URL=http://localhost:4000
```

If the backend runs on a different URL, update `VITE_API_URL` accordingly.

## Available Scripts

### Backend

```bash
yarn start          # Start development server with hot reload
yarn build          # Build for production
yarn type-check     # Run TypeScript type checking
yarn format         # Format code with Biome
yarn lint           # Lint code with Biome
yarn migrate        # Run database migrations
yarn rollback       # Rollback last migration
yarn seed           # Seed database with sample data
```

### Frontend

```bash
yarn dev            # Start development server
yarn build          # Build for production
yarn preview        # Preview production build
yarn format         # Format code with Biome
yarn lint           # Lint code with Biome
yarn stylelint      # Lint and fix CSS/SCSS
```

## API Documentation

After the backend is running, access the Swagger API documentation at:

```
http://localhost:4000/api-docs
```

This provides interactive documentation for all API endpoints.

## Key Features

✅ **User Authentication**

- Register with email validation
- Login with JWT tokens
- Password reset functionality
- Profile management (first name, last name, email)

✅ **Blog Management**

- Create blog posts with featured images
- Edit existing posts
- Delete posts with confirmation
- View all posts with pagination
- View individual post details

✅ **Modern UI/UX**

- Responsive design inspired by Stripe, Revolut, Linear
- Smooth gradient-based design system
- Loading overlays with Lottie animations
- Confirmation modals for destructive actions
- Form validation with React Hook Form
- Rich text editing with React Quill

✅ **Database**

- PostgreSQL with Knex migrations
- User and post management
- Authentication tokens
- Password reset tokens

## Troubleshooting

### Database Connection Issues

If you get a database connection error:

1. Ensure Docker is running: `docker ps`
2. Check if PostgreSQL container is running: `docker compose ps`
3. Restart Docker: `docker compose down && docker compose up -d`
4. Verify connection string in `.env`

### Port Already in Use

If port 4000 (backend) or 5173 (frontend) is already in use:

**Backend:** Update `PORT` in `BE/.env`
**Frontend:** Vite will prompt to use another port or update `vite.config.js`

### Node Modules Issues

If you encounter module errors:

```bash
# Backend
cd BE
rm -rf node_modules package-lock.json
yarn install

# Frontend
cd FE
rm -rf node_modules package-lock.json
yarn install
```

### Migration Issues

If migrations fail:

```bash
# Rollback all migrations
yarn rollback --all

# Re-run migrations
yarn migrate

# Re-seed database
yarn seed
```

## Development Workflow

1. **Start the database:**

   ```bash
   docker compose up -d
   ```

2. **Start the backend in one terminal:**

   ```bash
   cd BE
   yarn start
   ```

3. **Start the frontend in another terminal:**

   ```bash
   cd FE
   yarn dev
   ```

4. **Access the application:**
   - Frontend: `http://localhost:5173`
   - API Docs: `http://localhost:4000/api-docs`

## Project Technologies

### Frontend

- **React 19.0.0** - UI framework
- **Vite 5.0.0** - Build tool & dev server
- **React Router 7.0.0** - Client-side routing
- **React Hook Form 7.54.2** - Form state management
- **Tailwind CSS & SCSS** - Styling
- **Axios** - HTTP client
- **Lottie Web** - Animations
- **React Quill** - Rich text editor

### Backend

- **Node.js** - Runtime
- **Express 5.1.0** - Web framework
- **TypeScript** - Type safety
- **Knex** - Query builder & migrations
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Swagger/OpenAPI** - API documentation
- **Nodemailer** - Email service

## Code Style & Quality

The project uses automated tools for code quality:

- **Biome** - Code formatting and linting (both BE and FE)
- **TypeScript** - Type checking
- **Stylelint** - CSS/SCSS linting
- **ESLint** - JavaScript linting

Run these before committing:

```bash
# Format code
yarn format

# Check for linting issues
yarn lint

# Fix styling issues (FE)
yarn stylelint
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat: description of changes"

# Push to branch
git push origin feature/feature-name

# Create pull request on GitHub
```

## Need Help?

- Check the **FE/ReadMe.md** and **BE/ReadMe.md** for specific frontend/backend details
- Review **API Documentation** at `http://localhost:4000/api-docs`
- Check browser console for frontend errors
- Check backend terminal for server errors
- Review **Git history** for recent changes: `git log --oneline`

## Production Deployment

### Before deploying

1. Update all environment variables for production
2. Build frontend: `cd FE && yarn build`
3. Run type checking: `yarn type-check`
4. Run linting: `yarn lint`
5. Ensure all tests pass
6. Set secure JWT key
7. Configure production database
8. Set up email service with real credentials

### Build commands

```bash
# Frontend
cd FE
yarn build

# Backend (if applicable)
cd BE
yarn build
```

---

**Happy coding!** 🚀
