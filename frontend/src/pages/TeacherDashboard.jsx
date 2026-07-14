import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { School, Users, AlertCircle, ListOrdered, Calendar } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClassroomInfo();
  }, []);

  const fetchClassroomInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/allocations/my-classroom');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching teacher classroom details:', err);
      setError('Unable to fetch classroom details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-650/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium tracking-wide">Retrieving invigilation schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pt-4">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Teacher Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.name}. Check your exam invigilation room and student list below.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/60 px-4 py-2 rounded-xl border border-border self-start md:self-auto text-foreground">
          <Calendar size={16} className="text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider">Exam Duty</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive-foreground p-4 rounded-xl text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {data && data.assigned ? (
        <div className="space-y-6">
          {/* Duty Info Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Room Card */}
            <Card className="bg-card border-border flex items-center justify-between p-6 rounded-2xl shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">ASSIGNED ROOM</span>
                <span className="text-3xl font-black text-foreground mt-1 block">{data.roomNumber}</span>
                <span className="text-xs text-muted-foreground font-medium block mt-1.5">
                  Reporting location: {data.building ? `${data.building} Building` : 'Assigned room'}
                </span>
              </div>
              <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-indigo-400 shadow-inner">
                <School size={30} />
              </div>
            </Card>

            {/* Students Count Card */}
            <Card className="bg-card border-border flex items-center justify-between p-6 rounded-2xl shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">STUDENTS ON DUTY</span>
                <span className="text-3xl font-black text-foreground mt-1 block">{data.studentsCount} Students</span>
                <span className="text-xs text-muted-foreground font-medium block mt-1.5">Capacity allocated</span>
              </div>
              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-emerald-450 shadow-inner">
                <Users size={30} />
              </div>
            </Card>
          </div>

          {/* Students list for this classroom */}
          <Card className="bg-card border-border overflow-hidden rounded-3xl shadow-md relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]" />
            <CardHeader className="p-8 border-b border-border flex flex-row items-center justify-between bg-muted/40 space-y-0">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/30">
                  <ListOrdered size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-foreground tracking-wide">
                    Room Student Seating Chart
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {data.students.length === 0 ? (
                <p className="text-xs text-muted-foreground py-12 text-center font-medium">No students allocated to this classroom yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 border-b border-border hover:bg-muted/40">
                      <TableHead className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Seat No</TableHead>
                      <TableHead className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Register No</TableHead>
                      <TableHead className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Name</TableHead>
                      <TableHead className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Department</TableHead>
                      <TableHead className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Semester</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-sm">
                    {data.students.map((alloc) => (
                      <TableRow key={alloc._id} className="hover:bg-muted/50 transition-colors border-b border-border">
                        <TableCell className="font-mono font-bold text-indigo-400">Seat {alloc.seatNumber}</TableCell>
                        <TableCell className="font-mono text-muted-foreground font-semibold">{alloc.registerNumber}</TableCell>
                        <TableCell className="font-medium text-foreground">{alloc.student?.name || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground">{alloc.department}</TableCell>
                        <TableCell className="text-muted-foreground">{alloc.semester}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-card border-border rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto shadow-xl">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-full text-indigo-400">
            <School size={36} />
          </div>
          <h3 className="text-lg font-bold text-foreground">No Invigilation Duty</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You are not currently assigned to any classroom for invigilation. Please wait for the exam administrator to generate the seating chart and allocate your classroom duty.
          </p>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;
