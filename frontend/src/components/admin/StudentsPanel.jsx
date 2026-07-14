import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Search,
  Trash2,
  Edit3,
  FileSpreadsheet,
  Upload,
  Plus,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// =========================================================================
// SUB-COMPONENT: STUDENT MANAGEMENT
// =========================================================================
const StudentsPanel = ({ onRefresh }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [selectedDept, setSelectedDept] = useState("CSE");
  const [selectedSem, setSelectedSem] = useState("S5");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [name, setName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  const departments = ["CSE", "ECE", "EEE", "Civil", "Mechanical"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/students", {
        params: {
          department: selectedDept,
          semester: selectedSem,
          search: searchQuery,
        },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch student list");
    } finally {
      setLoading(false);
    }
  }, [selectedDept, selectedSem, searchQuery]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!name || !registerNumber) {
      setError("All fields are required");
      return;
    }
    try {
      setError(null);
      await axios.post("/students", {
        name,
        registerNumber,
        department: selectedDept,
        semester: selectedSem,
      });
      setName("");
      setRegisterNumber("");
      setIsAddModalOpen(false);
      setSuccessMsg("Student added successfully!");
      fetchStudents();
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    if (!currentStudent?.name || !currentStudent?.registerNumber) {
      setError("All fields are required");
      return;
    }
    try {
      setError(null);
      await axios.put(`/students/${currentStudent._id}`, currentStudent);
      setIsEditModalOpen(false);
      setCurrentStudent(null);
      setSuccessMsg("Student details updated successfully!");
      fetchStudents();
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update student");
    }
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      await axios.delete(`/students/${studentToDelete}`);
      setSuccessMsg("Student deleted successfully");
      fetchStudents();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      setError("Failed to delete student");
    } finally {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleDeleteClick = (id) => {
    setStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError("Select a CSV file");
      return;
    }
    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("department", selectedDept);
    formData.append("semester", selectedSem);
    try {
      setUploadingCsv(true);
      setError(null);
      const res = await axios.post("/students/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg(
        `Imported: ${res.data.successCount}, Skipped duplicates: ${res.data.duplicateCount}`,
      );
      setCsvFile(null);
      const fileInput = document.getElementById("student-csv-file-input");
      if (fileInput) fileInput.value = "";
      fetchStudents();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      setError("Error uploading CSV");
    } finally {
      setUploadingCsv(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Student Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage database records and import spreadsheets of student groups.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus size={16} />
          <span>Add Student</span>
        </Button>
      </div>

      {(error || successMsg) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)}>
                <X size={14} />
              </button>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg(null)}>
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass lg:col-span-2">
          <CardContent className="p-5 flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Department
              </Label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Semester
              </Label>
              <Select value={selectedSem} onValueChange={setSelectedSem}>
                <SelectTrigger>
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-2 space-y-1.5">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Search Students
              </Label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-2.5 text-muted-foreground"
                />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name or register number..."
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-5">
            <form onSubmit={handleCsvUpload} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  CSV List Upload
                </Label>
                <Badge variant="outline" className="text-[10px]">
                  {selectedDept} {selectedSem}
                </Badge>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="file"
                    id="student-csv-file-input"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="student-csv-file-input"
                    className="flex items-center gap-2 justify-center w-full bg-background hover:bg-muted border border-border border-dashed rounded-xl py-2 px-4 text-xs text-muted-foreground cursor-pointer h-10"
                  >
                    <FileSpreadsheet size={14} className="text-primary" />
                    <span className="truncate max-w-120px">
                      {csvFile ? csvFile.name : "Select CSV"}
                    </span>
                  </label>
                </div>
                <Button
                  type="submit"
                  disabled={uploadingCsv || !csvFile}
                  className="gap-1 h-10"
                >
                  <Upload size={14} />
                  <span>{uploadingCsv ? "Saving..." : "Upload"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="glass overflow-hidden">
        {loading && students.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-muted-foreground text-xs">
              Querying students...
            </span>
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <FileSpreadsheet size={32} />
            <p className="text-xs">No student records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-150px">Register No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-mono font-bold text-primary">
                      {student.registerNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.department}</Badge>
                    </TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          setCurrentStudent(student);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(student._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label>Student Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Register Number</Label>
              <Input
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                required
                className="font-mono"
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Create Student
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {currentStudent && (
            <form onSubmit={handleEditStudent} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={currentStudent.name}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Register Number</Label>
                <Input
                  value={currentStudent.registerNumber}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      registerNumber: e.target.value,
                    })
                  }
                  required
                  className="font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Dept</Label>
                  <Select
                    value={currentStudent.department}
                    onValueChange={(val) =>
                      setCurrentStudent({ ...currentStudent, department: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Sem</Label>
                  <Select
                    value={currentStudent.semester}
                    onValueChange={(val) =>
                      setCurrentStudent({ ...currentStudent, semester: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full mt-4">
                Save Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle size={20} />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this student? This action cannot be undone and will remove any active seat allocation.
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteStudent}>
              Delete Student
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPanel;
