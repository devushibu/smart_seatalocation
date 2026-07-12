# Smart Exam Seat Allocation and Hall Management System - Walkthrough

We have successfully implemented both the backend and frontend components of the system. The seat allocation algorithm interleaves students dynamically to minimize consecutive student placement from the same department + semester.

---

## 🔑 Default Credentials

To log in for the first time, use these default credentials:

| Portal | Username / Identification | Password |
| :--- | :--- | :--- |
| **Admin Portal** | `admin` | `adminpassword` |
| **Teacher Portal** | *Assigned Employee ID* (e.g. `T001`) | *Same as Employee ID* (e.g. `T001`) |
| **Student Portal** | *Assigned Register Number* (e.g. `CSE22001`) | *Same as Register Number* (e.g. `CSE22001`) |

---

## 🚀 How to Run the Project

You will need two terminal windows to run both the backend server and the frontend client simultaneously.

### 1. Start the Backend Server
Navigate to the `backend/` directory and start the Express server:
```bash
cd backend
npm start
```
> [!NOTE]
> The server runs on `http://localhost:5000`. Upon starting, it will automatically connect to your MongoDB cluster and seed the `admin` user if it doesn't already exist.

### 2. Start the Frontend Client
Navigate to the `frontend/` directory and launch the Vite development server:
```bash
cd frontend
npm run dev
```
> [!NOTE]
> The React app will run on `http://localhost:5173`. Open this URL in your web browser.

---

## 📋 Walkthrough & Ingestion Guide

Follow these steps to test the system's full end-to-end capabilities:

### Step 1: Manage Classrooms
1. Log in to the **Admin Portal** (`admin` / `adminpassword`).
2. Go to **Classroom Management** from the sidebar.
3. Click **Add Classroom** and configure the benches and seats.
   - *Example*: Room: `A101`, Benches: `20`, Seats/Bench: `2`. The system auto-calculates capacity to `40`.

### Step 2: Import Student Lists
1. Go to **Student Management**.
2. Select a Department (e.g., `CSE`) and Semester (e.g., `S5`).
3. Click **Select CSV File** and select a file.
   - *Format Example*:
     ```csv
     RegisterNumber,StudentName
     CSE22001,Rahul
     CSE22002,Anu
     CSE22003,Arun
     ```
4. Click **Upload**. The system registers these students under CSE S5.
5. (Optional) Select `ECE` and `S5`, select another CSV, and upload to add ECE students.
6. Use the **Add Student** button to manually insert extra students.

### Step 3: Import Teachers
1. Go to **Teacher Management**.
2. Click **Select CSV File** and upload a teacher roster.
   - *Format Example*:
     ```csv
     EmployeeID,TeacherName,Department
     T001,Anitha,CSE
     T002,Rajesh,ECE
     T003,Suresh,Civil
     ```
3. Click **Upload**. Teachers can now log in using their Employee ID as both username and password.

### Step 4: Run Seat Allocation
1. Navigate to **Seat Allocation**.
2. **Step 1**: Choose a Department and Semester group (e.g., `CSE` and `S5`) and click **Add Group**. Do the same for `ECE` and `S5`.
3. **Step 2**: The wizard calculates and displays the total student count.
4. **Step 3**: Check the classrooms you wish to use (e.g. `A101`, `A102`).
   - If selected classrooms have insufficient capacity, a warning is shown.
5. **Step 4**: Click **Generate Seat Allocation**.
   - The greedy algorithm interleaves the CSE and ECE students sequentially (e.g. Seat 1: CSE, Seat 2: ECE, Seat 3: CSE, Seat 4: ECE...) to avoid adjacent department/semester matches.

### Step 5: Assign Teachers (Invigilators)
1. You are redirected to **View Seat Allocation**.
2. In the right panel, select a room (e.g., `A101`) and select a teacher (e.g., `Anitha`) from the dropdown.
3. Click **Assign Teacher**. One teacher is registered per room.

### Step 6: Access Student and Teacher Portals
- **Student**: Log out and log back in choosing the **Student** tab using `CSE22001` (with password `CSE22001`). You will see an official "Hall Ticket" card showing Room `A101` and Seat Number `1`.
- **Teacher**: Log in under the **Teacher** tab using `T001` (with password `T001`). You will see the assigned room `A101`, the student headcount, and the sorted desk-assignment roster of students.
