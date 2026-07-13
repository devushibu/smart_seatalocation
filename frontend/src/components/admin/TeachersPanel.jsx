import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Upload,
  Search,
  Trash2,
  Edit3,
  FileSpreadsheet,
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
// SUB-COMPONENT: TEACHER MANAGEMENT
// =========================================================================
const TeachersPanel = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [csvFile, setCsvFile] = useState(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  const departments = ["CSE", "ECE", "EEE", "Civil", "Mechanical"];

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/teachers", {
        params: { search: searchQuery },
      });
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch teacher database");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!name || !employeeId || !department) {
      setError("All fields are required");
      return;
    }
    try {
      setError(null);
      await axios.post("/teachers", { name, employeeId, department });
      setName("");
      setEmployeeId("");
      setIsAddModalOpen(false);
      setSuccessMsg("Teacher added successfully!");
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add teacher");
    }
  };

  const handleEditTeacher = async (e) => {
    e.preventDefault();
    if (
      !currentTeacher?.name ||
      !currentTeacher?.employeeId ||
      !currentTeacher?.department
    ) {
      setError("All fields are required");
      return;
    }
    try {
      setError(null);
      await axios.put(`/teachers/${currentTeacher._id}`, currentTeacher);
      setIsEditModalOpen(false);
      setCurrentTeacher(null);
      setSuccessMsg("Teacher details updated successfully!");
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update teacher");
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (
      !window.confirm(
        "Delete this teacher? This clears any invigilation assignment.",
      )
    )
      return;
    try {
      await axios.delete(`/teachers/${id}`);
      setSuccessMsg("Teacher deleted successfully");
      fetchTeachers();
    } catch (err) {
      console.error(err);
      setError("Failed to delete teacher");
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError("Select a CSV file");
      return;
    }
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      setUploadingCsv(true);
      setError(null);
      const res = await axios.post("/teachers/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg(
        `Import Complete! Imported: ${res.data.successCount}, Skipped: ${res.data.duplicateCount}`,
      );
      setCsvFile(null);
      const fileInput = document.getElementById("teacher-csv-input");
      if (fileInput) fileInput.value = "";
      fetchTeachers();
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
            Teacher Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage database records and register invigilators.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus size={16} />
          <span>Add Teacher</span>
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
          <CardContent className="p-5 flex flex-col justify-center">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Search Teachers
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
                  placeholder="Search by name, employee ID, or department..."
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-5">
            <form onSubmit={handleCsvUpload} className="space-y-4">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Import Teachers CSV
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="file"
                    id="teacher-csv-input"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="teacher-csv-input"
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
        {loading && teachers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-muted-foreground text-xs">
              Querying teachers...
            </span>
          </div>
        ) : teachers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <FileSpreadsheet size={32} />
            <p className="text-xs">No teacher records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-150px">Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell className="font-mono font-bold text-primary">
                      {teacher.employeeId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {teacher.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{teacher.department}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          setCurrentTeacher(teacher);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteTeacher(teacher._id)}
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
            <DialogTitle>Add Teacher</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTeacher} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label>Teacher Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Employee ID</Label>
              <Input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
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
            <Button type="submit" className="w-full mt-4">
              Register Teacher
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>
          {currentTeacher && (
            <form onSubmit={handleEditTeacher} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={currentTeacher.name}
                  onChange={(e) =>
                    setCurrentTeacher({
                      ...currentTeacher,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Employee ID</Label>
                <Input
                  value={currentTeacher.employeeId}
                  onChange={(e) =>
                    setCurrentTeacher({
                      ...currentTeacher,
                      employeeId: e.target.value,
                    })
                  }
                  required
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select
                  value={currentTeacher.department}
                  onValueChange={(val) =>
                    setCurrentTeacher({
                      ...currentTeacher,
                      department: val,
                    })
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
              <Button type="submit" className="w-full mt-4">
                Save Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersPanel;
