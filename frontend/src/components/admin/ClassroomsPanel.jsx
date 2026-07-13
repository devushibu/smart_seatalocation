import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  School,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// =========================================================================
// SUB-COMPONENT: CLASSROOM MANAGEMENT
// =========================================================================
const ClassroomsPanel = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [roomNumber, setRoomNumber] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [benches, setBenches] = useState(15);
  const [seatsPerBench, setSeatsPerBench] = useState(2);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/classrooms");
      setClassrooms(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch classroom listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomNumber || !building || !floor) {
      setError("All fields are required");
      return;
    }
    try {
      setError(null);
      await axios.post("/classrooms", {
        roomNumber,
        building,
        floor,
        benches: Number(benches),
        seatsPerBench: Number(seatsPerBench),
      });
      setRoomNumber("");
      setBuilding("");
      setFloor("");
      setBenches(15);
      setSeatsPerBench(2);
      setIsAddModalOpen(false);
      setSuccessMsg("Classroom added successfully!");
      fetchClassrooms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add classroom");
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    if (
      !currentRoom?.roomNumber ||
      !currentRoom?.building ||
      !currentRoom?.floor
    ) {
      setError("All fields are required");
      return;
    }
    try {
      setError(null);
      await axios.put(`/classrooms/${currentRoom._id}`, {
        roomNumber: currentRoom.roomNumber,
        building: currentRoom.building,
        floor: currentRoom.floor,
        benches: Number(currentRoom.benches),
        seatsPerBench: Number(currentRoom.seatsPerBench),
      });
      setIsEditModalOpen(false);
      setCurrentRoom(null);
      setSuccessMsg("Classroom details updated successfully!");
      fetchClassrooms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update classroom");
    }
  };

  const handleDeleteRoom = async (id) => {
    if (
      !window.confirm(
        "Delete classroom? This clears seat and teacher assignments for this room.",
      )
    )
      return;
    try {
      await axios.delete(`/classrooms/${id}`);
      setSuccessMsg("Classroom deleted successfully");
      fetchClassrooms();
    } catch (err) {
      console.error(err);
      setError("Failed to delete classroom");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Classroom Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Configure exam halls, building locations, and seat capacities.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus size={16} />
          <span>Add Classroom</span>
        </Button>
      </div>

      {(error || successMsg) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-xs animate-fade-in">
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
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-xl text-xs animate-fade-in">
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

      <Card className="glass overflow-hidden">
        {loading && classrooms.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-muted-foreground text-xs">
              Querying classrooms...
            </span>
          </div>
        ) : classrooms.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <School size={32} />
            <p className="text-xs">No examination classrooms configured.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Benches</TableHead>
                  <TableHead>Seats/Bench</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classrooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell className="font-bold text-primary">
                      {room.roomNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {room.building}
                    </TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>{room.benches}</TableCell>
                    <TableCell>{room.seatsPerBench}</TableCell>
                    <TableCell className="font-bold text-emerald-500">
                      {room.capacity} seats
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          setCurrentRoom(room);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteRoom(room._id)}
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
            <DialogTitle>Add Classroom</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRoom} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label>Room Number</Label>
              <Input
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Building</Label>
                <Input
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Floor</Label>
                <Input
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Benches Count</Label>
                <Input
                  type="number"
                  min="1"
                  value={benches}
                  onChange={(e) => setBenches(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Seats / Bench</Label>
                <Input
                  type="number"
                  min="1"
                  value={seatsPerBench}
                  onChange={(e) => setSeatsPerBench(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="bg-muted border border-border p-3 rounded-xl flex items-center justify-between text-xs mt-2">
              <span className="font-semibold text-muted-foreground">
                Total Capacity:
              </span>
              <span className="font-bold text-emerald-500">
                {benches * seatsPerBench || 0} Seats
              </span>
            </div>
            <Button type="submit" className="w-full mt-4">
              Create Classroom
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Classroom</DialogTitle>
          </DialogHeader>
          {currentRoom && (
            <form onSubmit={handleEditRoom} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label>Room Number</Label>
                <Input
                  value={currentRoom.roomNumber}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      roomNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Building</Label>
                  <Input
                    value={currentRoom.building}
                    onChange={(e) =>
                      setCurrentRoom({
                        ...currentRoom,
                        building: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Floor</Label>
                  <Input
                    value={currentRoom.floor}
                    onChange={(e) =>
                      setCurrentRoom({ ...currentRoom, floor: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Benches</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentRoom.benches}
                    onChange={(e) =>
                      setCurrentRoom({
                        ...currentRoom,
                        benches: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Seats Per Bench</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentRoom.seatsPerBench}
                    onChange={(e) =>
                      setCurrentRoom({
                        ...currentRoom,
                        seatsPerBench: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="bg-muted border border-border p-3 rounded-xl flex items-center justify-between text-xs mt-2">
                <span className="font-semibold text-muted-foreground">
                  Calculated Capacity:
                </span>
                <span className="font-bold text-emerald-500">
                  {currentRoom.benches * currentRoom.seatsPerBench || 0} Seats
                </span>
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

export default ClassroomsPanel;
