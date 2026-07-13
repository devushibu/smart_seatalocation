import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ChevronDown,
  Cpu,
  Info,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// =========================================================================
// SUB-COMPONENT: SEAT ALLOCATION WIZARD
// =========================================================================
const AllocatePanel = ({ setActiveTab, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [dbGroups, setDbGroups] = useState([]);
  const [dbClassrooms, setDbClassrooms] = useState([]);

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [selectedGroupKey, setSelectedGroupKey] = useState("");

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const groupsRes = await axios.get("/allocations/metadata/groups");
      setDbGroups(groupsRes.data);

      const roomsRes = await axios.get("/classrooms?available=true");
      setDbClassrooms(roomsRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch allocation records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (dbGroups.length > 0) {
      setSelectedGroupKey(`${dbGroups[0].department}-${dbGroups[0].semester}`);
    } else {
      setSelectedGroupKey("");
    }
  }, [dbGroups]);

  const handleAddGroup = () => {
    if (!selectedGroupKey) {
      setError("No student groups available to allocate.");
      return;
    }
    const [dept, sem] = selectedGroupKey.split("-");
    const exists = selectedGroups.some(
      (g) => g.department === dept && g.semester === sem,
    );
    if (exists) {
      setError(`Group ${dept} ${sem} is already added`);
      return;
    }
    setError(null);
    setSelectedGroups([...selectedGroups, { department: dept, semester: sem }]);
  };

  const handleRemoveGroup = (idx) => {
    setSelectedGroups(selectedGroups.filter((_, i) => i !== idx));
  };

  const handleToggleRoom = (roomNum) => {
    if (selectedRooms.includes(roomNum)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== roomNum));
    } else {
      setSelectedRooms([...selectedRooms, roomNum]);
    }
  };

  const getGroupStudentCount = (dept, sem) => {
    const match = dbGroups.find(
      (g) => g.department === dept && g.semester === sem,
    );
    return match ? match.count : 0;
  };

  const totalStudents = selectedGroups.reduce(
    (sum, g) => sum + getGroupStudentCount(g.department, g.semester),
    0,
  );
  const getRoomCapacity = (roomNum) => {
    const match = dbClassrooms.find((r) => r.roomNumber === roomNum);
    return match ? match.capacity : 0;
  };
  const totalCapacity = selectedRooms.reduce(
    (sum, r) => sum + getRoomCapacity(r),
    0,
  );

  const isCapacityInsufficient =
    totalCapacity < totalStudents && totalStudents > 0;
  const availableAfterAllocation = Math.max(0, totalCapacity - totalStudents);

  const handleGenerateAllocation = async () => {
    if (selectedGroups.length === 0 || selectedRooms.length === 0) {
      setError("Select student groups and classrooms");
      return;
    }
    if (isCapacityInsufficient) {
      setError("Insufficient seat capacity");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await axios.post("/allocations/generate", {
        groups: selectedGroups,
        classrooms: selectedRooms,
      });
      setSuccess(true);
      onRefresh(); // Refresh parent metrics state
      setTimeout(() => {
        setActiveTab("view-allocations");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error occurred generating allocations",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-6">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          Seat Allocation Wizard
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Configure student groups, select exam halls, check capacity limits,
          and generate seat assignments.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-xs">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-xl text-xs animate-pulse">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>
            Seats successfully allocated! Redirecting to allocation grid...
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="glass flex flex-col h-full">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-[10px]">
                STEP 1
              </Badge>
              <CardTitle className="text-sm">Select Student Groups</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-5 flex-1">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Available Groups
                </label>
                <Select
                  value={selectedGroupKey}
                  onValueChange={setSelectedGroupKey}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select group..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dbGroups.length === 0 ? (
                      <SelectItem value="" disabled>
                        No unallocated groups
                      </SelectItem>
                    ) : (
                      dbGroups.map((g) => (
                        <SelectItem
                          key={`${g.department}-${g.semester}`}
                          value={`${g.department}-${g.semester}`}
                        >
                          {g.department} {g.semester} ({g.count} students)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddGroup}
                disabled={dbGroups.length === 0}
                variant="outline"
                className="w-full gap-2"
              >
                <Plus size={14} />
                <span>Add Group</span>
              </Button>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Active Group List
              </h4>
              {selectedGroups.length === 0 ? (
                <p className="text-[10px] text-muted-foreground bg-muted p-4 rounded-xl border border-border border-dashed text-center">
                  No student groups selected.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-160px overflow-y-auto pr-1">
                  {selectedGroups.map((g, i) => {
                    const count = getGroupStudentCount(
                      g.department,
                      g.semester,
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border"
                      >
                        <span className="text-xs font-bold text-foreground uppercase">
                          {g.department} • {g.semester}{" "}
                          <span className="font-normal text-muted-foreground">
                            ({count} students)
                          </span>
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveGroup(i)}
                          className="text-muted-foreground hover:text-destructive h-6 w-6"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass flex flex-col h-full">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-[10px]">
                STEP 2
              </Badge>
              <CardTitle className="text-sm">Select Classrooms</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-5 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Available Classrooms
              </label>
              {dbClassrooms.length === 0 ? (
                <p className="text-[10px] text-muted-foreground text-center py-6">
                  No classrooms available.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 max-h-250px overflow-y-auto pr-1">
                  {dbClassrooms.map((room) => {
                    const isChecked = selectedRooms.includes(room.roomNumber);
                    return (
                      <label
                        key={room._id}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                          isChecked
                            ? "bg-primary/10 border-primary text-foreground"
                            : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRoom(room.roomNumber)}
                          className="rounded border-input bg-background text-primary focus:ring-primary/20"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">
                            {room.roomNumber}
                          </span>
                          <span className="text-[9px] font-bold">
                            {room.capacity} seats
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass flex flex-col h-full">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-[10px]">
                STEP 3
              </Badge>
              <CardTitle className="text-sm">Allocation Metrics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Total Students
                </span>
                <span className="text-sm font-bold text-foreground">
                  {totalStudents}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Allocated Capacity
                </span>
                <span className="text-sm font-bold text-foreground">
                  {totalCapacity}
                </span>
              </div>

              {isCapacityInsufficient ? (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-xl text-destructive flex items-start gap-2">
                  <AlertCircle className="shrink-0 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-xs">Insufficient Capacity</h5>
                    <p className="text-[10px] mt-0.5">
                      Please check more classrooms. You need {totalStudents}{" "}
                      seats but only have {totalCapacity}.
                    </p>
                  </div>
                </div>
              ) : totalStudents > 0 && selectedRooms.length > 0 ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-500 flex items-start gap-2">
                  <CheckCircle2 className="shrink-0 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-xs">Capacity Validated</h5>
                    <p className="text-[10px] mt-0.5">
                      Seats are sufficient! {availableAfterAllocation} seats
                      will remain vacant.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-muted border border-border p-3 rounded-xl text-muted-foreground flex items-start gap-2">
                  <Info className="shrink-0 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-xs">Prerequisites</h5>
                    <p className="text-[10px] mt-0.5">
                      Select student groups and check rooms to begin
                      calculations.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerateAllocation}
              disabled={
                loading ||
                selectedGroups.length === 0 ||
                selectedRooms.length === 0 ||
                isCapacityInsufficient
              }
              className="w-full gap-2 mt-4"
              size="lg"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <>
                  <Cpu size={14} />
                  <span>Generate Seat Allocation</span>
                  <ChevronRight size={12} />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllocatePanel;
