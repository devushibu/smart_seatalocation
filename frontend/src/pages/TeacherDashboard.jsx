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
          <p className="text-slate-500 text-sm">Retrieving invigilation schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pt-4">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Teacher Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {user?.name}. Check your exam invigilation room and student list below.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800 self-start md:self-auto text-slate-300">
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
            <Card className="glass flex items-center justify-between p-6 rounded-2xl shadow-none">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">ASSIGNED ROOM</span>
                <span className="text-3xl font-black text-white mt-1 block">{data.roomNumber}</span>
                <span className="text-xs text-slate-400 font-medium block mt-1.5">
                  Reporting location: {data.building ? `${data.building} Building` : 'Assigned room'}
                </span>
              </div>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-indigo-400">
                <School size={30} />
              </div>
            </Card>

            {/* Students Count Card */}
            <Card className="glass flex items-center justify-between p-6 rounded-2xl shadow-none">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">STUDENTS ON DUTY</span>
                <span className="text-3xl font-black text-white mt-1 block">{data.studentsCount} Students</span>
                <span className="text-xs text-slate-400 font-medium block mt-1.5">Capacity allocated</span>
              </div>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-emerald-450">
                <Users size={30} />
              </div>
            </Card>
          </div>

          {/* Students list for this classroom */}
          <Card className="glass rounded-2xl overflow-hidden shadow-lg border-slate-800/60">
            <CardHeader className="px-6 py-5 border-b border-slate-800/60 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-bold text-slate-100 tracking-wide text-base flex items-center gap-2">
                <ListOrdered size={18} className="text-indigo-400" />
                <span>Room Student Seating Chart</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {data.students.length === 0 ? (
                <p className="text-xs text-slate-600 py-12 text-center">No students allocated to this classroom yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-950/60 border-b border-slate-800/80 hover:bg-slate-950/60">
                      <TableHead className="font-semibold text-slate-450 uppercase tracking-wider">Seat No</TableHead>
                      <TableHead className="font-semibold text-slate-450 uppercase tracking-wider">Register No</TableHead>
                      <TableHead className="font-semibold text-slate-450 uppercase tracking-wider">Name</TableHead>
                      <TableHead className="font-semibold text-slate-450 uppercase tracking-wider">Department</TableHead>
                      <TableHead className="font-semibold text-slate-450 uppercase tracking-wider">Semester</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-sm text-slate-350">
                    {data.students.map((alloc) => (
                      <TableRow key={alloc._id} className="hover:bg-slate-900/40 transition-colors border-b border-slate-850/60">
                        <TableCell className="font-mono font-bold text-indigo-400">Seat {alloc.seatNumber}</TableCell>
                        <TableCell className="font-mono text-slate-300 font-semibold">{alloc.registerNumber}</TableCell>
                        <TableCell className="font-medium text-slate-200">{alloc.student?.name || 'N/A'}</TableCell>
                        <TableCell>{alloc.department}</TableCell>
                        <TableCell>{alloc.semester}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-slate-900 border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto shadow-xl">
          <div className="bg-indigo-900/40 border border-indigo-500/20 p-4 rounded-full text-indigo-400">
            <School size={36} />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No Invigilation Duty</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            You are not currently assigned to any classroom for invigilation. Please wait for the exam administrator to generate the seating chart and allocate your classroom duty.
          </p>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;
