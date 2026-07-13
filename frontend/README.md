# Smart Seat Allocation - Frontend

This is the frontend application for the Smart Seat Allocation system, built using React, Vite, and Tailwind CSS.

## Features
- **Admin Dashboard**: Manage classrooms, students, teachers, and initiate seat allocations.
- **Teacher Dashboard**: View assigned invigilation duties and schedules.
- **Student Dashboard**: View allocated seat details for exams.
- **Role-Based Authentication**: Secure login and access control for Admins, Teachers, and Students.
- **Responsive Design**: Styled with Tailwind CSS for optimal viewing on multiple devices.

## Tech Stack
- **React**: UI library for building the user interface.
- **Vite**: Fast frontend build tool.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Building for Production

To build the application for production deployment:
```bash
npm run build
```
This will create a `dist` directory with optimized assets.

## Folder Structure
- `/src/components`: Reusable UI components (e.g., Layout).
- `/src/context`: React Context providers (e.g., AuthContext).
- `/src/pages`: Main page components for different routes and roles.
- `/src/assets`: Static assets like images.
