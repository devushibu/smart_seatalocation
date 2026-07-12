import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, MapPin, Grid, AlertCircle, RefreshCw } from 'lucide-react';

const StudentDashboard = () => {
  // Grab the logged-in user profile from our AuthContext
  const { user } = useContext(AuthContext);
  
  // State variables for seating details, loading spinner, and errors
  const [allocation, setAllocation] = useState(null); // stores { allocated: boolean, roomNumber, seatNumber }
  const [loading, setLoading] = useState(true);       // manages the fetching state
  const [error, setError] = useState(null);           // holds error text if connection fails

  // Runs once immediately after the page is mounted on screen
  useEffect(() => {
    fetchSeatInfo();
  }, []);

  // Sends an HTTP GET request to retrieve the seat layout assigned to the active student ID
  const fetchSeatInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Axios GET request to our backend API router
      const res = await axios.get('/allocations/my-seat');
      
      // Save backend response details to our local component state
      setAllocation(res.data);
    } catch (err) {
      console.error('Error fetching seat info:', err);
      setError('Unable to fetch seat allocation data');
    } finally {
      // Turn off the loading screen spinner
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-650/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Retrieving seat details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pt-4">
      {/* Welcome Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Exam Portal</h1>
        <p className="text-slate-400 text-sm mt-1">Verify your seating arrangement and room instructions below.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl text-sm">
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchSeatInfo} className="ml-auto text-xs underline font-semibold flex items-center gap-1 hover:text-white">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Seating Arrangement Card ("Hall Ticket" Design) */}
      <div className="glass glow-card rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
        {/* Glow corner decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-550/10 rounded-full blur-2xl" />

        {/* Card Header */}
        <div className="bg-gradient-to-r from-indigo-900/60 to-indigo-950/80 px-8 py-6 border-b border-indigo-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/25">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white uppercase tracking-wide">Seating Arrangement</h2>
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-extrabold">Exam Seating Details</span>
            </div>
          </div>
          <span className="text-xs bg-indigo-500/20 text-indigo-350 border border-indigo-550/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Active Session
          </span>
        </div>

        {/* Student Details Grid */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</span>
              <p className="text-base font-bold text-slate-100">{user?.name}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Register Number</span>
              <p className="text-base font-mono font-bold text-white">{user?.registerNumber || user?.identifier}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</span>
              <p className="text-base font-bold text-slate-200">{user?.department}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Semester</span>
              <p className="text-base font-bold text-slate-200">{user?.semester}</p>
            </div>
          </div>

          <hr className="border-slate-800/60" />

          {/* Seating Assignment Outcome */}
          {allocation && allocation.allocated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Room Location Card */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-850 flex items-center gap-4">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-indigo-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">EXAM HALL</span>
                  <span className="text-xl font-black text-white">{allocation.roomNumber}</span>
                  {allocation.building && (
                    <span className="text-xs text-slate-400 block mt-0.5">{allocation.building} Building</span>
                  )}
                </div>
              </div>

              {/* Seat Number Card */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-850 flex items-center gap-4">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-emerald-450">
                  <Grid size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest block uppercase">SEAT NUMBER</span>
                  <span className="text-xl font-black text-emerald-450">{allocation.seatNumber}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/25 p-5 rounded-2xl flex items-start gap-3.5 text-amber-300">
              <AlertCircle size={22} className="shrink-0 text-amber-450" />
              <div>
                <h4 className="font-bold text-sm text-amber-200">Allocation Pending</h4>
                <p className="text-xs text-amber-400/90 leading-relaxed mt-1">
                  Seating arrangements for your group have not been generated yet. Please contact the exam administrator or check back later.
                </p>
              </div>
            </div>
          )}

          {/* Footer details */}
          <div className="bg-slate-950/20 p-4 rounded-xl border border-slate-900 text-center text-xs text-slate-500 mt-4">
            Instructions: Please report to your exam hall at least 15 minutes prior to the scheduled exam. Carry your valid student identification.
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
