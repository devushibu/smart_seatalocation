# Smart Exam Seat Allocation and Hall Management System - Walkthrough

The backend and frontend components of the system have been successfully implemented. The seat allocation algorithm interleaves students dynamically to minimize consecutive student placement from the same department and semester.

---

## Default Credentials

To log in for the first time, use the following default credentials:

| Portal | Username / Identification | Password |
| :--- | :--- | :--- |
| **Admin Portal** | `admin` | `adminpassword` |
| **Teacher Portal** | *Assigned Employee ID* (e.g. `T001`) | *Same as Employee ID* (e.g. `T001`) |
| **Student Portal** | *Assigned Register Number* (e.g. `CSE22001`) | *Same as Register Number* (e.g. `CSE22001`) |

---

## How to Run the Project

You will require two terminal windows to run both the backend server and the frontend client simultaneously.

### 1. Start the Backend Server
Navigate to the `backend/` directory and start the Express server:
```bash
cd backend
npm run dev
```
> [!NOTE]
> The server runs on `http://localhost:3000`. Upon starting, it will automatically connect to your MongoDB cluster and seed the `admin` user if it does not already exist.

### 2. Start the Frontend Client
Navigate to the `frontend/` directory and launch the Vite development server:
```bash
cd frontend
npm run dev
```
> [!NOTE]
> The React application will run on `http://localhost:5173`. Open this URL in your web browser.

---

## Walkthrough and Ingestion Guide

Follow these steps to evaluate the system's full end-to-end capabilities:

### Step 1: Manage Classrooms
1. Log in to the **Admin Portal** (`admin` / `adminpassword`).
2. Navigate to **Classroom Management** from the sidebar.
3. Click **Add Classroom** and configure the benches and seats.
   - *Example*: Room: `A101`, Benches: `20`, Seats/Bench: `2`. The system automatically calculates capacity to `40`.

### Step 2: Import Student Lists
1. Navigate to **Student Management**.
2. Select a Department (e.g., `CSE`) and Semester (e.g., `S5`).
3. Click **Select CSV File** and choose a file.
   - *Format Example*:
     ```csv
     RegisterNumber,StudentName
     CSE22001,Rahul
     CSE22002,Anu
     CSE22003,Arun
     ```
4. Click **Upload**. The system registers these students under the specified department and semester.
5. (Optional) Select an additional department (e.g., `ECE`) and semester, choose another CSV file, and upload to append more students.
6. Use the **Add Student** button to insert additional students manually.

### Step 3: Import Teachers
1. Navigate to **Teacher Management**.
2. Click **Select CSV File** and upload a teacher roster.
   - *Format Example*:
     ```csv
     EmployeeID,TeacherName,Department
     T001,Anitha,CSE
     T002,Rajesh,ECE
     T003,Suresh,Civil
     ```
3. Click **Upload**. Teachers are now authorized to log in using their Employee ID as both the username and password.

### Step 4: Execute Seat Allocation
1. Navigate to **Seat Allocation**.
2. **Step 1**: Select a Department and Semester group (e.g., `CSE` and `S5`) and click **Add Group**. Repeat this process for additional groups (e.g., `ECE` and `S5`).
3. **Step 2**: The wizard calculates and displays the total student count.
4. **Step 3**: Select the classrooms intended for use (e.g. `A101`, `A102`).
   - If the selected classrooms have insufficient capacity, a warning will be displayed.
5. **Step 4**: Click **Generate Seat Allocation**.
   - The greedy algorithm interleaves the selected student groups sequentially (e.g. Seat 1: CSE, Seat 2: ECE, Seat 3: CSE, Seat 4: ECE...) to avoid adjacent department and semester matches.

### Step 5: Assign Teachers (Invigilators)
1. You will be redirected to the **View Seat Allocation** page.
2. In the right panel, select a room (e.g., `A101`) and choose a teacher (e.g., `Anitha`) from the dropdown menu.
3. Click **Assign Teacher**. Only one teacher can be registered per room.

### Step 6: Access Student and Teacher Portals
- **Student**: Log out and authenticate via the **Student** tab using a register number (e.g., `CSE22001` with password `CSE22001`). This view presents an official "Hall Ticket" card displaying the assigned room and seat number.
- **Teacher**: Authenticate via the **Teacher** tab using an employee ID (e.g., `T001` with password `T001`). This view presents the assigned room, the student headcount, and a detailed desk-assignment roster of students.
