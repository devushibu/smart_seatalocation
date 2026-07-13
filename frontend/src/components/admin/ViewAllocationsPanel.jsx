import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  School,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  ShieldAlert,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ViewAllocationsPanel = ({ onRefresh }) => {
  const [allocations, setAllocations] = useState([]);
  const [teacherAllocations, setTeacherAllocations] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [activeRoom, setActiveRoom] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [assignTeacher, setAssignTeacher] = useState("");

  useEffect(() => {
    fetchAllocations();
    fetchTeacherAssignments();
    fetchMetadata();
  }, [searchQuery]);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/allocations", {
        params: { search: searchQuery },
      });
      setAllocations(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch seat allocations");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherAssignments = async () => {
    try {
      const res = await axios.get("/allocations/teachers");
      setTeacherAllocations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMetadata = async () => {
    try {
      const teachersRes = await axios.get("/teachers");
      setTeachers(teachersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    if (!activeRoom || !assignTeacher) {
      setError("Select a teacher");
      return;
    }
    try {
      setError(null);
      await axios.post("/allocations/teacher", {
        roomNumber: activeRoom,
        teacherId: assignTeacher,
      });
      setAssignTeacher("");
      setSuccess(`Teacher assigned to room ${activeRoom} successfully!`);
      fetchTeacherAssignments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign teacher");
    }
  };

  const handleRemoveTeacherAssignment = async (id) => {
    if (!window.confirm("Remove this invigilator assignment?")) return;
    try {
      await axios.delete(`/allocations/teacher/${id}`);
      setSuccess("Invigilator duty assignment removed.");
      fetchTeacherAssignments();
    } catch (err) {
      console.error(err);
      setError("Failed to remove assignment");
    }
  };

  const handleClearAllAllocations = async () => {
    if (
      !window.confirm(
        "Delete ALL seat allocations and teacher assignments? This cannot be undone.",
      )
    )
      return;
    try {
      setLoading(true);
      setError(null);
      await axios.delete("/allocations");
      setSuccess("All seat and teacher allocations cleared successfully!");
      setActiveRoom("");
      fetchAllocations();
      fetchTeacherAssignments();
      onRefresh();
    } catch (err) {
      console.error(err);
      setError("Failed to clear allocations");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoomAllocation = async (roomNum) => {
    if (
      !window.confirm(
        `Delete all allocations and invigilators for room ${roomNum}?`,
      )
    )
      return;
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/allocations/room/${roomNum}`);
      setSuccess(`Allocations for room ${roomNum} deleted successfully!`);
      if (activeRoom === roomNum) setActiveRoom("");
      fetchAllocations();
      fetchTeacherAssignments();
      onRefresh();
    } catch (err) {
      console.error(err);
      setError(`Failed to delete room allocations`);
    } finally {
      setLoading(false);
    }
  };

  const uniqueRooms = Array.from(
    new Set(allocations.map((a) => a.roomNumber)),
  ).sort();
  const roomStudentsCount = (room) =>
    allocations.filter((a) => a.roomNumber === room).length;
  const roomTeacherName = (room) => {
    const match = teacherAllocations.find((ta) => ta.roomNumber === room);
    return match ? match.teacher?.name : "No invigilator assigned";
  };
  const roomTeacherObj = (room) =>
    teacherAllocations.find((ta) => ta.roomNumber === room);

  const activeRoomStudents = allocations
    .filter((a) => a.roomNumber === activeRoom)
    .sort((a, b) => a.seatNumber - b.seatNumber);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            View Seat Allocations
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Select a classroom card below to inspect student seating layout and
            manage invigilators.
          </p>
        </div>
        {uniqueRooms.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleClearAllAllocations}
            className="flex items-center gap-2 self-start md:self-auto"
          >
            <Trash2 size={14} />
            <span>Clear Seating Plan</span>
          </Button>
        )}
      </div>

      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-destructive/10 border border-destructive/20 text-destructive-foreground px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)}>
                <X size={14} />
              </button>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess(null)}>
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {loading && allocations.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-3 border-indigo-600/35 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-500 text-xs font-semibold">
            Querying allocations...
          </span>
        </div>
      ) : uniqueRooms.length === 0 ? (
        <Card className="glass rounded-3xl py-16 flex flex-col items-center justify-center gap-3 text-slate-500 border-slate-800/60 shadow-lg">
          <ShieldAlert size={36} className="text-indigo-500/40" />
          <div className="text-center">
            <h3 className="text-sm font-bold text-white mb-1">
              No Seating Plans Generated
            </h3>
            <p className="text-xs text-slate-500">
              Go to the Seat Allocation Wizard to generate allocations first.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="glass p-4 rounded-xl border-slate-800/60 flex flex-row items-center gap-3 shadow-none">
              <div className="bg-indigo-650/20 p-2 rounded-lg text-indigo-400">
                <School size={16} />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">
                  Halls Seated
                </span>
                <p className="text-base font-bold text-white">
                  {uniqueRooms.length}
                </p>
              </div>
            </Card>
            <Card className="glass p-4 rounded-xl border-slate-800/60 flex flex-row items-center gap-3 shadow-none">
              <div className="bg-purple-650/20 p-2 rounded-lg text-purple-400">
                <Users size={16} />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">
                  Total Seated
                </span>
                <p className="text-base font-bold text-white">
                  {allocations.length} students
                </p>
              </div>
            </Card>
            <Card className="glass p-4 rounded-xl border-slate-800/60 flex flex-row items-center gap-3 shadow-none">
              <div className="bg-emerald-650/20 p-2 rounded-lg text-emerald-400">
                <UserCheck size={16} />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">
                  Invigilators Duty
                </span>
                <p className="text-base font-bold text-white">
                  {teacherAllocations.length} active
                </p>
              </div>
            </Card>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, register number, department..."
              className="pl-9 bg-slate-950/80 border-slate-800"
            />
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-slate-505 uppercase tracking-widest mb-3.5">
              Select Room to Inspect Seating layout
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueRooms.map((room) => {
                const isActive = activeRoom === room;
                const studentCount = roomStudentsCount(room);
                const teacherName = roomTeacherName(room);
                const teacherObj = roomTeacherObj(room);

                return (
                  <Card
                    key={room}
                    onClick={() => setActiveRoom(isActive ? "" : room)}
                    className={`relative p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-indigo-950/30 border-indigo-500 shadow-md"
                        : "glass border-slate-800 hover:border-slate-705"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] text-indigo-400 font-extrabold uppercase">
                            Classroom
                          </span>
                          <h4 className="text-xl font-extrabold text-white mt-0.5">
                            {room}
                          </h4>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-slate-950 text-indigo-400 border-indigo-900/40 text-[10px] font-bold"
                        >
                          {studentCount} Students
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-0.5">
                        <span className="text-[9px] text-slate-505 uppercase font-bold block">
                          Invigilator
                        </span>
                        <div className="flex items-center gap-1.5">
                          <UserCheck
                            size={12}
                            className={
                              teacherObj ? "text-emerald-400" : "text-slate-600"
                            }
                          />
                          <span
                            className={`text-xs font-semibold ${teacherObj ? "text-slate-200" : "text-slate-500"}`}
                          >
                            {teacherName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px]">
                      <span className="text-indigo-400 font-semibold">
                        {isActive ? "Hide Details" : "View Seating Details →"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoomAllocation(room);
                        }}
                        className="h-6 w-6 text-slate-500 hover:text-red-400 hover:bg-slate-905"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {activeRoom && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
              <div className="xl:col-span-2 space-y-4">
                <Card className="glass rounded-2xl border-slate-800/60 overflow-hidden shadow-lg">
                  <CardHeader className="px-6 py-4.5 border-b border-slate-800/60 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                      <School className="text-indigo-400" size={16} />
                      <CardTitle className="font-extrabold text-slate-100 text-sm">
                        Seating Map: Room {activeRoom}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveRoom("")}
                      className="h-6 w-6 text-slate-505 hover:text-slate-300 bg-slate-905"
                    >
                      <X size={12} />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto max-h-350px overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-950/60 border-b border-slate-800/80 hover:bg-slate-950/60">
                            <TableHead className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                              Seat
                            </TableHead>
                            <TableHead className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                              Register No
                            </TableHead>
                            <TableHead className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                              Name
                            </TableHead>
                            <TableHead className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                              Dept
                            </TableHead>
                            <TableHead className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                              Sem
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-850/60 text-xs text-slate-350">
                          {activeRoomStudents.map((alloc) => (
                            <TableRow
                              key={alloc._id}
                              className="hover:bg-slate-900/20 border-b-0"
                            >
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-indigo-900/40 text-indigo-300 border-indigo-500/20 font-mono font-bold text-[10px]"
                                >
                                  Seat {alloc.seatNumber}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-indigo-400">
                                {alloc.registerNumber}
                              </TableCell>
                              <TableCell className="font-medium text-slate-200">
                                {alloc.student?.name || "N/A"}
                              </TableCell>
                              <TableCell>{alloc.department}</TableCell>
                              <TableCell>{alloc.semester}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="glass rounded-2xl p-5 border-slate-800/60 shadow-none">
                  <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5 mb-3">
                    <UserCheck className="text-indigo-400" size={16} />
                    <h3 className="font-bold text-slate-100 text-xs">
                      Assign / Override Teacher
                    </h3>
                  </div>
                  <form onSubmit={handleAssignTeacher} className="space-y-4">
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        Modify assigned teacher for{" "}
                        <strong>Room {activeRoom}</strong>. Only free
                        invigilators are listed.
                      </p>

                      <Select
                        value={assignTeacher}
                        onValueChange={setAssignTeacher}
                      >
                        <SelectTrigger className="w-full bg-slate-950 border-slate-800">
                          <SelectValue placeholder="Select Teacher" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
                          {teachers
                            .filter((teacher) => {
                              const assignedToOther = teacherAllocations.some(
                                (alloc) =>
                                  alloc.roomNumber !== activeRoom &&
                                  (alloc.teacher?._id === teacher._id ||
                                    alloc.teacher === teacher._id),
                              );
                              return !assignedToOther;
                            })
                            .map((teacher) => (
                              <SelectItem
                                key={teacher._id}
                                value={teacher._id}
                                className="focus:bg-slate-800"
                              >
                                {teacher.name} ({teacher.employeeId})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      Assign Selected
                    </Button>
                  </form>
                </Card>

                {roomTeacherObj(activeRoom) && (
                  <Card className="glass p-4 rounded-xl border-slate-800/60 space-y-2 shadow-none">
                    <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      Active duty Invigilator
                    </h4>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">
                          {roomTeacherObj(activeRoom).teacher?.name}
                        </p>
                        <p className="text-[9px] text-slate-550 font-mono mt-0.5">
                          ID: {roomTeacherObj(activeRoom).teacher?.employeeId}
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-indigo-900/30 text-indigo-400 border-indigo-900/30 mt-2"
                        >
                          Dept: {roomTeacherObj(activeRoom).teacher?.department}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveTeacherAssignment(
                            roomTeacherObj(activeRoom)._id,
                          )
                        }
                        className="h-6 w-6 text-slate-500 hover:text-red-400 hover:bg-slate-900"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAllocationsPanel;
