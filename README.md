# Smart Exam Seat Allocation & Hall Management System

A premium, full-stack MERN application designed to automate and streamline the process of exam seating arrangement and invigilator duty allocation. It features a modern, high-performance dashboard UI with an elegant deep-navy, electric-violet, and teal theme.

---

## Key Features

### Multi-Role Authentication & Authorization
- **Admin**: Complete system control — manage classrooms, import databases, configure algorithms, and allocate seats/duties.
- **Teacher**: Personalized dashboard showing assigned invigilation halls, schedules, and active duty sessions.
- **Student**: Simple dashboard displaying exam seat allocations, room location details, and schedule.

### Smart Allocation Algorithms
- **Room Seating**: Automatically distributes students across available classrooms based on capacities and branch/batch separation constraints to prevent malpractice.
- **Invigilator Duty**: Assigns available teachers to examination halls, balancing duty loads.

### Administrative Controls
- **Overview Analytics**: Live stats of allocated exams, active halls, total students, and invigilators.
- **CSV Data Imports**: Quick-import students, teachers, and classrooms from CSV files using bulk-upload forms.
- **Visual Classroom Grid**: Inspect seat allocations layout within classroom maps.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Shadcn UI components, Sonner |
| **Backend** | Node.js, Express.js, Mongoose ODM |
| **Database** | MongoDB |
| **Auth** | JSON Web Tokens (JWT), BcryptJS |
| **Utilities** | Multer (for CSV file uploads), Axios |

---

## Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB** instance (Local or Atlas cloud database)

### Project Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devushibu/smart_seatalocation.git
   cd smart_seatalocation
   ```

2. **Configure Backend Environment:**
   Navigate to the `backend` folder and create a `.env` file based on `.env.example`:
   ```bash
   cd backend
   # Create a .env file and specify your MongoDB URI and JWT Secret:
   # PORT=5000
   # MONGO_URI=mongodb://localhost:27017/seatallocation
   # JWT_SECRET=your_super_secret_jwt_key
   ```

3. **Install Dependencies:**
   Install for both Backend and Frontend.
   ```bash
   # In the root folder:
   cd backend && npm install
   cd ../frontend && npm install
   ```

---

## Running the Application

To run the application locally, you need to spin up both servers:

### 1. Start the Backend API Server
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:5000` (or the port defined in your `.env`).

### 2. Start the Frontend Dev Server
```bash
cd frontend
npm run dev
```
The React frontend application will launch on `http://localhost:5173`.

---

## Repository Structure

```
smart_seatalocation/
├── backend/                  # Node/Express API Server
│   ├── config/               # Database and configuration files
│   ├── middleware/           # Auth and validation middlewares
│   ├── models/               # Mongoose DB Schemas (User, Student, Teacher, Classroom, Allocation)
│   ├── routes/               # API endpoints (auth, admin, allocation, classroom, etc.)
│   ├── utils/                # Helper files and seat allocation algorithm logic
│   └── server.js             # Main server entrypoint
│
├── frontend/                 # React/Vite Client
│   ├── src/
│   │   ├── components/       # Custom reusable layouts and panels
│   │   │   └── admin/        # Specific admin dashboard modules (Overview, Allocate, Classrooms, etc.)
│   │   ├── context/          # React Auth Context state management
│   │   ├── pages/            # Main role-based Dashboards (Student, Teacher, Auth screens)
│   │   ├── global.css        # Premium custom-themed stylesheet (Tailwind v4 / Shadcn variables)
│   │   └── main.jsx          # App entrypoint
│   └── vite.config.js        # Vite bundler configuration
```

---

## License
This project is licensed under the MIT License.
