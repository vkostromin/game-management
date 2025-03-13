markdown:README.md
# Game Management System

A web application for managing game events, user registrations, and payments.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Configure PostgreSQL:
- Create a new PostgreSQL database
- Update the DATABASE_URL in `.env` with your database credentials

5. Initialize the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database with initial data (creates admin user)
npx prisma db seed
```

6. Create an admin user (optional - if not using seed):
```bash
# Run the create-admin script
npm run create-admin
# or
yarn create-admin
```

## Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Admin Credentials
After seeding the database:
- Login: admin@example.com
- Password: admin123

## Database Management

### Reset Database
To reset the database and apply all migrations:
```bash
npx prisma migrate reset
```

### View Database
To view and manage your database with Prisma Studio:
```bash
npx prisma studio
```

### Update Database Schema
After modifying `schema.prisma`:
```bash
# Generate migration
npx prisma migrate dev --name <migration-name>

# Apply migration
npx prisma migrate deploy
```

## Project Structure

- `/src` - Application source code
  - `/app` - Next.js app router pages and API routes
  - `/components` - React components
  - `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/public` - Static files

## Features

- User authentication and authorization
- Game event management
- User registration for games
- Payment tracking
- Admin dashboard
- User balance management
- Game participation history

## Demo

Check out our demo video to see the Game Management System in action:

[![Game Management System Demo](https://img.youtube.com/vi/N882_MfjlzI/0.jpg)](https://youtu.be/N882_MfjlzI)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Tailwind CSS

## Development Notes

- The application uses Next.js App Router for routing
- Authentication is handled by NextAuth.js
- Database operations are managed through Prisma ORM
- Styling is done with Tailwind CSS
- The project follows a modular component structure
