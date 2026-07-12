import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  School, 
  UserCheck, 
  CheckCircle, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  LayoutGrid, 
  Plus, 
  Upload, 
  Search, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  X, 
  ChevronDown, 
  ShieldAlert, 
  RefreshCw, 
  Cpu, 
  Info
} from 'lucide-react';

// =========================================================================
// 📊 SUB-COMPONENT: OVERVIEW PANEL
// =========================================================================
const OverviewPanel = ({ stats, loading, error, onRefresh, setActiveTab }) => {
  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      description: 'Registered student database',
      icon: Users,
      textColor: 'text-blue-400',
      tab: 'students'
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      description: 'Available exam invigilators',
      icon: ShieldCheck,
      textColor: 'text-emerald-400',
      tab: 'teachers'
    },
    {
      title: 'Total Classrooms',
      value: stats.totalClassrooms,
      description: 'Configured examination halls',
      icon: School,
      textColor: 'text-purple-400',
      tab: 'classrooms'
    },
    {
      title: 'Total Seat Capacity',
      value: stats.totalCapacity,
      description: 'Total available seat pool',
      icon: LayoutGrid,
      textColor: 'text-amber-400',
      tab: 'classrooms'
    },
    {
      title: 'Allocated Seats',
      value: stats.allocatedSeats,
      description: 'Seats assigned for current exam',
      icon: UserCheck,
      textColor: 'text-indigo-400',
      tab: 'view-allocations'
    },
    {
      title: 'Available Seats',
      value: stats.availableSeats,
      description: 'Unused seat capacity',
      icon: CheckCircle,
      textColor: 'text-cyan-400',
      tab: 'classrooms'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-650/35 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-6 rounded-2xl flex items-center gap-3">
        <AlertCircle className="text-red-400 shrink-0" size={24} />
        <div>
          <h4 className="font-bold">Error Loading Dashboard</h4>
          <p className="text-sm text-red-400/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quick metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div 
              key={i} 
              onClick={() => setActiveTab(card.tab)}
              className="glass glow-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 cursor-pointer shadow-md shadow-slate-950/20 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</span>
                <div className={`p-2.5 rounded-xl bg-slate-950/80 border border-slate-850/80 ${card.textColor}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-white tracking-tight">{card.value}</span>
                <span className="text-xs text-slate-400 mt-2 font-medium">{card.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity Progress */}
        <div className="glass rounded-2xl p-6 border border-slate-800/60 lg:col-span-2 space-y-6 shadow-md">
          <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest border-b border-slate-850 pb-3">Seating Capacity Utilization</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                <span>SEATING RATIO</span>
                <span>{stats.totalCapacity > 0 ? Math.round((stats.allocatedSeats / stats.totalCapacity) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-850 overflow-hidden">
                <div 
                  className="bg-indigo-650 h-full rounded-full shadow-lg shadow-indigo-650/40 transition-all duration-1000"
                  style={{ width: `${stats.totalCapacity > 0 ? (stats.allocatedSeats / stats.totalCapacity) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-2">
              <div className="p-3.5 bg-slate-950/30 border border-slate-850/80 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Allocated</span>
                <span className="text-base font-bold text-indigo-400">{stats.allocatedSeats}</span>
              </div>
              <div className="p-3.5 bg-slate-950/30 border border-slate-850/80 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Available</span>
                <span className="text-base font-bold text-emerald-400">{stats.availableSeats}</span>
              </div>
              <div className="p-3.5 bg-slate-950/30 border border-slate-850/80 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Capacity</span>
                <span className="text-base font-bold text-slate-300">{stats.totalCapacity}</span>
              </div>
              <div className="p-3.5 bg-slate-950/30 border border-slate-850/80 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Halls</span>
                <span className="text-base font-bold text-purple-400">{stats.totalClassrooms}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="glass rounded-2xl p-6 border border-slate-800/60 space-y-4 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest border-b border-slate-850 pb-3 mb-3">Quick Actions</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">Initialize seat placements using our interleaving generator system, or view schedules.</p>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('allocate')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors text-xs font-semibold"
              >
                <span>Seat Allocation Wizard</span>
                <ChevronRight size={14} className="text-indigo-400" />
              </button>
              <button 
                onClick={() => setActiveTab('view-allocations')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors text-xs font-semibold"
              >
                <span>Invigilator Schedules</span>
                <ChevronRight size={14} className="text-indigo-400" />
              </button>
            </div>
          </div>
          <button 
            onClick={onRefresh} 
            className="w-full mt-4 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-705 border border-slate-705 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw size={12} />
            <span>Reload Statistics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 👥 SUB-COMPONENT: STUDENT MANAGEMENT
// =========================================================================
const StudentsPanel = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedSem, setSelectedSem] = useState('S5');
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  const [name, setName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  const departments = ['CSE', 'ECE', 'EEE', 'Civil', 'Mechanical'];
  const semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

  useEffect(() => {
    fetchStudents();
  }, [selectedDept, selectedSem, searchQuery]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/students', {
        params: {
          department: selectedDept,
          semester: selectedSem,
          search: searchQuery
        }
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch student list');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!name || !registerNumber) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.post('/students', {
        name,
        registerNumber,
        department: selectedDept,
        semester: selectedSem
      });
      setName('');
      setRegisterNumber('');
      setIsAddModalOpen(false);
      setSuccessMsg('Student added successfully!');
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    if (!currentStudent.name || !currentStudent.registerNumber) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.put(`/students/${currentStudent._id}`, currentStudent);
      setIsEditModalOpen(false);
      setCurrentStudent(null);
      setSuccessMsg('Student details updated successfully!');
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this student? This removes any active seat allocation.')) return;
    try {
      await axios.delete(`/students/${id}`);
      setSuccessMsg('Student deleted successfully');
      fetchStudents();
    } catch (err) {
      console.error(err);
      setError('Failed to delete student');
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError('Select a CSV file');
      return;
    }
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('department', selectedDept);
    formData.append('semester', selectedSem);
    try {
      setUploadingCsv(true);
      setError(null);
      const res = await axios.post('/students/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg(`Imported: ${res.data.successCount}, Skipped duplicates: ${res.data.duplicateCount}`);
      setCsvFile(null);
      const fileInput = document.getElementById('student-csv-file-input');
      if (fileInput) fileInput.value = '';
      fetchStudents();
    } catch (err) {
      console.error(err);
      setError('Error uploading CSV');
    } finally {
      setUploadingCsv(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Student Management</h2>
          <p className="text-slate-400 text-sm mt-1">Manage database records and import spreadsheets of student groups.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-650/20 transition-all self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Add Student</span>
        </button>
      </div>

      {(error || successMsg) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2"><AlertCircle size={14} /><span>{error}</span></div>
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} /><span>{successMsg}</span></div>
              <button onClick={() => setSuccessMsg(null)}><X size={14} /></button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-5 border border-slate-800/60 flex flex-col md:flex-row gap-4 lg:col-span-2">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Department</label>
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-xs appearance-none outline-none focus:border-indigo-500 text-slate-200"
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 text-slate-500 pointer-events-none" size={14} />
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Semester</label>
            <div className="relative">
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-xs appearance-none outline-none focus:border-indigo-500 text-slate-200"
              >
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 text-slate-500 pointer-events-none" size={14} />
            </div>
          </div>
          <div className="flex-[2] space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Search Students</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Search size={16} /></span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or register number..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800/60">
          <form onSubmit={handleCsvUpload} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">CSV List Upload</label>
              <span className="text-[10px] bg-slate-950 text-indigo-400 font-semibold px-2 py-0.5 rounded border border-slate-850">
                {selectedDept} {selectedSem}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="file"
                  id="student-csv-file-input"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="student-csv-file-input"
                  className="flex items-center gap-2 justify-center w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 border-dashed rounded-xl py-2.5 px-4 text-xs text-slate-400 cursor-pointer"
                >
                  <FileSpreadsheet size={14} className="text-indigo-400" />
                  <span className="truncate max-w-[120px]">{csvFile ? csvFile.name : 'Select CSV'}</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={uploadingCsv || !csvFile}
                className="bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              >
                <Upload size={14} />
                <span>{uploadingCsv ? 'Saving...' : 'Upload'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
        {loading && students.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-indigo-600/35 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-slate-500 text-xs">Querying students...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
            <FileSpreadsheet size={32} className="text-slate-800" />
            <p className="text-xs">No student records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800/80 text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Register No</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Semester</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-xs text-slate-300">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-indigo-400">{student.registerNumber}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-200">{student.name}</td>
                    <td className="px-6 py-3.5">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">{student.department}</span>
                    </td>
                    <td className="px-6 py-3.5">{student.semester}</td>
                    <td className="px-6 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => {
                          setCurrentStudent(student);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-500/10 hover:text-indigo-300 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/10 hover:text-red-400 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Add Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Student Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Register Number</label>
                <input
                  type="text"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 text-white font-mono"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Create Student
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && currentStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Edit Student</h3>
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Name</label>
                <input
                  type="text"
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Register Number</label>
                <input
                  type="text"
                  value={currentStudent.registerNumber}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, registerNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Dept</label>
                  <select
                    value={currentStudent.department}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200"
                  >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Sem</label>
                  <select
                    value={currentStudent.semester}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, semester: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200"
                  >
                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 👩‍🏫 SUB-COMPONENT: TEACHER MANAGEMENT
// =========================================================================
const TeachersPanel = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [csvFile, setCsvFile] = useState(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  const departments = ['CSE', 'ECE', 'EEE', 'Civil', 'Mechanical'];

  useEffect(() => {
    fetchTeachers();
  }, [searchQuery]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/teachers', {
        params: { search: searchQuery }
      });
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch teacher database');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!name || !employeeId || !department) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.post('/teachers', { name, employeeId, department });
      setName('');
      setEmployeeId('');
      setIsAddModalOpen(false);
      setSuccessMsg('Teacher added successfully!');
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add teacher');
    }
  };

  const handleEditTeacher = async (e) => {
    e.preventDefault();
    if (!currentTeacher.name || !currentTeacher.employeeId || !currentTeacher.department) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.put(`/teachers/${currentTeacher._id}`, currentTeacher);
      setIsEditModalOpen(false);
      setCurrentTeacher(null);
      setSuccessMsg('Teacher details updated successfully!');
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update teacher');
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Delete this teacher? This clears any invigilation assignment.')) return;
    try {
      await axios.delete(`/teachers/${id}`);
      setSuccessMsg('Teacher deleted successfully');
      fetchTeachers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete teacher');
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError('Select a CSV file');
      return;
    }
    const formData = new FormData();
    formData.append('file', csvFile);
    try {
      setUploadingCsv(true);
      setError(null);
      const res = await axios.post('/teachers/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg(`Import Complete! Imported: ${res.data.successCount}, Skipped: ${res.data.duplicateCount}`);
      setCsvFile(null);
      const fileInput = document.getElementById('teacher-csv-input');
      if (fileInput) fileInput.value = '';
      fetchTeachers();
    } catch (err) {
      console.error(err);
      setError('Error uploading CSV');
    } finally {
      setUploadingCsv(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Teacher Management</h2>
          <p className="text-slate-400 text-sm mt-1">Manage database records and register invigilators.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Add Teacher</span>
        </button>
      </div>

      {(error || successMsg) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs animate-fade-in">
              <div className="flex items-center gap-2"><AlertCircle size={14} /><span>{error}</span></div>
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs animate-fade-in">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} /><span>{successMsg}</span></div>
              <button onClick={() => setSuccessMsg(null)}><X size={14} /></button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-5 border border-slate-800/60 flex flex-col justify-center lg:col-span-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Search Teachers</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Search size={16} /></span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, employee ID, or department..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800/60">
          <form onSubmit={handleCsvUpload} className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Import Teachers CSV</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="file"
                  id="teacher-csv-input"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="teacher-csv-input"
                  className="flex items-center gap-2 justify-center w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 border-dashed rounded-xl py-2.5 px-4 text-xs text-slate-400 cursor-pointer"
                >
                  <FileSpreadsheet size={14} className="text-indigo-400" />
                  <span className="truncate max-w-[120px]">{csvFile ? csvFile.name : 'Select CSV'}</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={uploadingCsv || !csvFile}
                className="bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              >
                <Upload size={14} />
                <span>{uploadingCsv ? 'Saving...' : 'Upload'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
        {loading && teachers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-indigo-600/35 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-slate-500 text-xs">Querying teachers...</span>
          </div>
        ) : teachers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
            <FileSpreadsheet size={32} className="text-slate-800" />
            <p className="text-xs">No teacher records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800/80 text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Employee ID</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-xs text-slate-300">
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-indigo-400">{teacher.employeeId}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-200">{teacher.name}</td>
                    <td className="px-6 py-3.5">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">{teacher.department}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => {
                          setCurrentTeacher(teacher);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-500/10 hover:text-indigo-300 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/10 hover:text-red-400 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Add Teacher</h3>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Teacher Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500 text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Department</label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs appearance-none outline-none focus:border-indigo-500 text-slate-200"
                  >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-3 text-slate-505 pointer-events-none" size={14} />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Register Teacher
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && currentTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Edit Teacher</h3>
            <form onSubmit={handleEditTeacher} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Name</label>
                <input
                  type="text"
                  value={currentTeacher.name}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Employee ID</label>
                <input
                  type="text"
                  value={currentTeacher.employeeId}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, employeeId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Department</label>
                <select
                  value={currentTeacher.department}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-250 rounded-xl py-2 px-3 text-xs"
                >
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 🏫 SUB-COMPONENT: CLASSROOM MANAGEMENT
// =========================================================================
const ClassroomsPanel = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [roomNumber, setRoomNumber] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [benches, setBenches] = useState(15);
  const [seatsPerBench, setSeatsPerBench] = useState(2);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/classrooms');
      setClassrooms(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch classroom listings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomNumber || !building || !floor) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.post('/classrooms', {
        roomNumber, building, floor,
        benches: Number(benches),
        seatsPerBench: Number(seatsPerBench)
      });
      setRoomNumber('');
      setBuilding('');
      setFloor('');
      setBenches(15);
      setSeatsPerBench(2);
      setIsAddModalOpen(false);
      setSuccessMsg('Classroom added successfully!');
      fetchClassrooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add classroom');
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    if (!currentRoom.roomNumber || !currentRoom.building || !currentRoom.floor) {
      setError('All fields are required');
      return;
    }
    try {
      setError(null);
      await axios.put(`/classrooms/${currentRoom._id}`, {
        roomNumber: currentRoom.roomNumber,
        building: currentRoom.building,
        floor: currentRoom.floor,
        benches: Number(currentRoom.benches),
        seatsPerBench: Number(currentRoom.seatsPerBench)
      });
      setIsEditModalOpen(false);
      setCurrentRoom(null);
      setSuccessMsg('Classroom details updated successfully!');
      fetchClassrooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update classroom');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete classroom? This clears seat and teacher assignments for this room.')) return;
    try {
      await axios.delete(`/classrooms/${id}`);
      setSuccessMsg('Classroom deleted successfully');
      fetchClassrooms();
    } catch (err) {
      console.error(err);
      setError('Failed to delete classroom');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Classroom Management</h2>
          <p className="text-slate-400 text-sm mt-1">Configure exam halls, building locations, and seat capacities.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Add Classroom</span>
        </button>
      </div>

      {(error || successMsg) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs animate-fade-in">
              <div className="flex items-center gap-2"><AlertCircle size={14} /><span>{error}</span></div>
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs animate-fade-in">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} /><span>{successMsg}</span></div>
              <button onClick={() => setSuccessMsg(null)}><X size={14} /></button>
            </div>
          )}
        </div>
      )}

      <div className="glass rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
        {loading && classrooms.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-indigo-600/35 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-slate-500 text-xs">Querying classrooms...</span>
          </div>
        ) : classrooms.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
            <School size={32} className="text-slate-850" />
            <p className="text-xs">No examination classrooms configured.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800/80 text-[10px] font-semibold text-slate-450 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Room</th>
                  <th className="px-6 py-3.5">Building</th>
                  <th className="px-6 py-3.5">Floor</th>
                  <th className="px-6 py-3.5">Benches</th>
                  <th className="px-6 py-3.5">Seats/Bench</th>
                  <th className="px-6 py-3.5">Capacity</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-xs text-slate-300">
                {classrooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-indigo-400">{room.roomNumber}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-200">{room.building}</td>
                    <td className="px-6 py-3.5">{room.floor}</td>
                    <td className="px-6 py-3.5">{room.benches}</td>
                    <td className="px-6 py-3.5">{room.seatsPerBench}</td>
                    <td className="px-6 py-3.5 font-bold text-emerald-400">{room.capacity} seats</td>
                    <td className="px-6 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => {
                          setCurrentRoom(room);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-500/10 hover:text-indigo-300 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/10 hover:text-red-400 border border-slate-705 text-slate-450 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Add Classroom</h3>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Room Number</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Building</label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Floor</label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Benches Count</label>
                  <input
                    type="number"
                    min="1"
                    value={benches}
                    onChange={(e) => setBenches(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Seats / Bench</label>
                  <input
                    type="number"
                    min="1"
                    value={seatsPerBench}
                    onChange={(e) => setSeatsPerBench(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Total Capacity:</span>
                <span className="font-bold text-emerald-400">{benches * seatsPerBench || 0} Seats</span>
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Create Classroom
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && currentRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 mb-4">Edit Classroom</h3>
            <form onSubmit={handleEditRoom} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Room Number</label>
                <input
                  type="text"
                  value={currentRoom.roomNumber}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, roomNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Building</label>
                  <input
                    type="text"
                    value={currentRoom.building}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, building: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Floor</label>
                  <input
                    type="text"
                    value={currentRoom.floor}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, floor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Benches</label>
                  <input
                    type="number"
                    min="1"
                    value={currentRoom.benches}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, benches: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Seats Per Bench</label>
                  <input
                    type="number"
                    min="1"
                    value={currentRoom.seatsPerBench}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, seatsPerBench: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-505 font-medium">Calculated Capacity:</span>
                <span className="font-bold text-emerald-450">{currentRoom.benches * currentRoom.seatsPerBench || 0} Seats</span>
              </div>
              <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 🔮 SUB-COMPONENT: SEAT ALLOCATION WIZARD
// =========================================================================
const AllocatePanel = ({ setActiveTab, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [dbGroups, setDbGroups] = useState([]);
  const [dbClassrooms, setDbClassrooms] = useState([]);

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [selectedGroupKey, setSelectedGroupKey] = useState('');

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (dbGroups.length > 0) {
      setSelectedGroupKey(`${dbGroups[0].department}-${dbGroups[0].semester}`);
    } else {
      setSelectedGroupKey('');
    }
  }, [dbGroups]);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const groupsRes = await axios.get('/allocations/metadata/groups');
      setDbGroups(groupsRes.data);

      const roomsRes = await axios.get('/classrooms?available=true');
      setDbClassrooms(roomsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch allocation records');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    if (!selectedGroupKey) {
      setError('No student groups available to allocate.');
      return;
    }
    const [dept, sem] = selectedGroupKey.split('-');
    const exists = selectedGroups.some(g => g.department === dept && g.semester === sem);
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
      setSelectedRooms(selectedRooms.filter(r => r !== roomNum));
    } else {
      setSelectedRooms([...selectedRooms, roomNum]);
    }
  };

  const getGroupStudentCount = (dept, sem) => {
    const match = dbGroups.find(g => g.department === dept && g.semester === sem);
    return match ? match.count : 0;
  };

  const totalStudents = selectedGroups.reduce((sum, g) => sum + getGroupStudentCount(g.department, g.semester), 0);
  const getRoomCapacity = (roomNum) => {
    const match = dbClassrooms.find(r => r.roomNumber === roomNum);
    return match ? match.capacity : 0;
  };
  const totalCapacity = selectedRooms.reduce((sum, r) => sum + getRoomCapacity(r), 0);

  const isCapacityInsufficient = totalCapacity < totalStudents && totalStudents > 0;
  const availableAfterAllocation = Math.max(0, totalCapacity - totalStudents);

  const handleGenerateAllocation = async () => {
    if (selectedGroups.length === 0 || selectedRooms.length === 0) {
      setError('Select student groups and classrooms');
      return;
    }
    if (isCapacityInsufficient) {
      setError('Insufficient seat capacity');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await axios.post('/allocations/generate', {
        groups: selectedGroups,
        classrooms: selectedRooms
      });
      setSuccess(true);
      onRefresh(); // Refresh parent metrics state
      setTimeout(() => {
        setActiveTab('view-allocations');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred generating allocations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-800/60 pb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Seat Allocation Wizard</h2>
        <p className="text-slate-400 text-sm mt-1">Configure student groups, select exam halls, check capacity limits, and generate seat assignments.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs animate-pulse">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>Seats successfully allocated! Redirecting to allocation grid...</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-5 border border-slate-800/60 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
            <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">STEP 1</span>
            <h3 className="font-bold text-slate-200 text-sm">Select Student Groups</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Available Groups</label>
              <div className="relative">
                <select
                  value={selectedGroupKey}
                  onChange={(e) => setSelectedGroupKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs appearance-none outline-none focus:border-indigo-500 text-slate-200"
                >
                  {dbGroups.length === 0 ? (
                    <option value="">No unallocated student groups</option>
                  ) : (
                    dbGroups.map(g => (
                      <option key={`${g.department}-${g.semester}`} value={`${g.department}-${g.semester}`}>
                        {g.department} {g.semester} ({g.count} students)
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-4 top-3 text-slate-505 pointer-events-none" size={14} />
              </div>
            </div>
            <button
              onClick={handleAddGroup}
              disabled={dbGroups.length === 0}
              className="w-full flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-705 text-slate-200 py-2.5 rounded-xl text-xs font-bold border border-slate-705 disabled:opacity-40 transition-all"
            >
              <Plus size={14} />
              <span>Add Group</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Group List</h4>
            {selectedGroups.length === 0 ? (
              <p className="text-[10px] text-slate-650 bg-slate-950/40 p-4 rounded-xl border border-slate-900 border-dashed text-center">No student groups selected.</p>
            ) : (
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {selectedGroups.map((g, i) => {
                  const count = getGroupStudentCount(g.department, g.semester);
                  return (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-850">
                      <span className="text-xs font-bold text-slate-250 uppercase">{g.department} • {g.semester} <span className="font-normal text-slate-505">({count} students)</span></span>
                      <button onClick={() => handleRemoveGroup(i)} className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-850 rounded-lg"><Trash2 size={12} /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800/60 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
            <span className="bg-indigo-650 text-white font-bold text-[10px] px-2 py-0.5 rounded">STEP 2</span>
            <h3 className="font-bold text-slate-200 text-sm">Select Classrooms</h3>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Available Classrooms</label>
            {dbClassrooms.length === 0 ? (
              <p className="text-[10px] text-slate-600 text-center py-6">No classrooms available.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 max-h-[250px] overflow-y-auto pr-1">
                {dbClassrooms.map((room) => {
                  const isChecked = selectedRooms.includes(room.roomNumber);
                  return (
                    <label
                      key={room._id}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                        isChecked ? 'bg-indigo-650/10 border-indigo-500 text-slate-200' : 'bg-slate-950/40 border-slate-855 text-slate-450 hover:bg-slate-900/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRoom(room.roomNumber)}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{room.roomNumber}</span>
                        <span className="text-[9px] text-slate-505 font-bold">{room.capacity} seats</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800/60 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
              <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">STEP 3</span>
              <h3 className="font-bold text-slate-200 text-sm">Allocation Metrics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Total Students</span>
                <span className="text-sm font-bold text-white">{totalStudents}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Allocated Capacity</span>
                <span className="text-sm font-bold text-white">{totalCapacity}</span>
              </div>

              {isCapacityInsufficient ? (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-300 flex items-start gap-2">
                  <AlertCircle className="shrink-0 text-red-400 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-xs">Insufficient Capacity</h5>
                    <p className="text-[10px] text-red-400/90 mt-0.5">Please check more classrooms. You need {totalStudents} seats but only have {totalCapacity}.</p>
                  </div>
                </div>
              ) : totalStudents > 0 && selectedRooms.length > 0 ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="shrink-0 text-emerald-450 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-xs">Capacity Validated</h5>
                    <p className="text-[10px] text-emerald-400/90 mt-0.5">Seats are sufficient! {availableAfterAllocation} seats will remain vacant.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl text-slate-500 flex items-start gap-2">
                  <Info className="shrink-0 text-slate-500 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-xs text-slate-400">Prerequisites</h5>
                    <p className="text-[10px] text-slate-505 mt-0.5">Select student groups and check rooms to begin calculations.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerateAllocation}
            disabled={loading || selectedGroups.length === 0 || selectedRooms.length === 0 || isCapacityInsufficient}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-white py-3.5 rounded-xl text-xs font-semibold shadow-md disabled:pointer-events-none"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Cpu size={14} />
                <span>Generate Seat Allocation</span>
                <ChevronRight size={12} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 🔲 SUB-COMPONENT: SEAT VIEW ALLOCATIONS & INVIGILATORS GRID
// =========================================================================
const ViewAllocationsPanel = ({ onRefresh }) => {
  const [allocations, setAllocations] = useState([]);
  const [teacherAllocations, setTeacherAllocations] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [activeRoom, setActiveRoom] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignTeacher, setAssignTeacher] = useState('');

  useEffect(() => {
    fetchAllocations();
    fetchTeacherAssignments();
    fetchMetadata();
  }, [searchQuery]);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/allocations', {
        params: { search: searchQuery }
      });
      setAllocations(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch seat allocations');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherAssignments = async () => {
    try {
      const res = await axios.get('/allocations/teachers');
      setTeacherAllocations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMetadata = async () => {
    try {
      const teachersRes = await axios.get('/teachers');
      setTeachers(teachersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    if (!activeRoom || !assignTeacher) {
      setError('Select a teacher');
      return;
    }
    try {
      setError(null);
      await axios.post('/allocations/teacher', {
        roomNumber: activeRoom,
        teacherId: assignTeacher
      });
      setAssignTeacher('');
      setSuccess(`Teacher assigned to room ${activeRoom} successfully!`);
      fetchTeacherAssignments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign teacher');
    }
  };

  const handleRemoveTeacherAssignment = async (id) => {
    if (!window.confirm('Remove this invigilator assignment?')) return;
    try {
      await axios.delete(`/allocations/teacher/${id}`);
      setSuccess('Invigilator duty assignment removed.');
      fetchTeacherAssignments();
    } catch (err) {
      console.error(err);
      setError('Failed to remove assignment');
    }
  };

  const handleClearAllAllocations = async () => {
    if (!window.confirm('Delete ALL seat allocations and teacher assignments? This cannot be undone.')) return;
    try {
      setLoading(true);
      setError(null);
      await axios.delete('/allocations');
      setSuccess('All seat and teacher allocations cleared successfully!');
      setActiveRoom('');
      fetchAllocations();
      fetchTeacherAssignments();
      onRefresh(); // Refresh main dashboard numbers
    } catch (err) {
      console.error(err);
      setError('Failed to clear allocations');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoomAllocation = async (roomNum) => {
    if (!window.confirm(`Delete all allocations and invigilators for room ${roomNum}?`)) return;
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/allocations/room/${roomNum}`);
      setSuccess(`Allocations for room ${roomNum} deleted successfully!`);
      if (activeRoom === roomNum) setActiveRoom('');
      fetchAllocations();
      fetchTeacherAssignments();
      onRefresh(); // Refresh main metrics
    } catch (err) {
      console.error(err);
      setError(`Failed to delete room allocations`);
    } finally {
      setLoading(false);
    }
  };

  const uniqueRooms = Array.from(new Set(allocations.map(a => a.roomNumber))).sort();
  const roomStudentsCount = (room) => allocations.filter(a => a.roomNumber === room).length;
  const roomTeacherName = (room) => {
    const match = teacherAllocations.find(ta => ta.roomNumber === room);
    return match ? match.teacher?.name : 'No invigilator assigned';
  };
  const roomTeacherObj = (room) => teacherAllocations.find(ta => ta.roomNumber === room);

  const activeRoomStudents = allocations
    .filter(a => a.roomNumber === activeRoom)
    .sort((a, b) => a.seatNumber - b.seatNumber);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">View Seat Allocations</h2>
          <p className="text-slate-400 text-sm mt-1">Select a classroom card below to inspect student seating layout and manage invigilators.</p>
        </div>
        {uniqueRooms.length > 0 && (
          <button
            onClick={handleClearAllAllocations}
            className="flex items-center gap-2 bg-red-650/10 hover:bg-red-600/25 border border-red-500/20 text-red-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.98] self-start md:self-auto"
          >
            <Trash2 size={14} />
            <span>Clear Seating Plan</span>
          </button>
        )}
      </div>

      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2"><AlertCircle size={14} /><span>{error}</span></div>
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-xs">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} /><span>{success}</span></div>
              <button onClick={() => setSuccess(null)}><X size={14} /></button>
            </div>
          )}
        </div>
      )}

      {loading && allocations.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-3 border-indigo-600/35 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-slate-500 text-xs font-semibold">Querying allocations...</span>
        </div>
      ) : uniqueRooms.length === 0 ? (
        <div className="glass rounded-3xl py-16 flex flex-col items-center justify-center gap-3 text-slate-500 border border-slate-800/60 shadow-lg">
          <ShieldAlert size={36} className="text-indigo-500/40" />
          <div className="text-center">
            <h3 className="text-sm font-bold text-white mb-1">No Seating Plans Generated</h3>
            <p className="text-xs text-slate-500">Go to the Seat Allocation Wizard to generate allocations first.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
              <div className="bg-indigo-650/20 p-2 rounded-lg text-indigo-400"><School size={16} /></div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Halls Seated</span>
                <p className="text-base font-bold text-white">{uniqueRooms.length}</p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
              <div className="bg-purple-650/20 p-2 rounded-lg text-purple-400"><Users size={16} /></div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Total Seated</span>
                <p className="text-base font-bold text-white">{allocations.length} students</p>
              </div>
            </div>
            <div className="glass p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
              <div className="bg-emerald-650/20 p-2 rounded-lg text-emerald-400"><UserCheck size={16} /></div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Invigilators Duty</span>
                <p className="text-base font-bold text-white">{teacherAllocations.length} active</p>
              </div>
            </div>
          </div>

          <div className="relative max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Users size={16} /></span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, register number, department..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-indigo-500 text-slate-200"
            />
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-slate-505 uppercase tracking-widest mb-3.5">Select Room to Inspect Seating layout</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueRooms.map(room => {
                const isActive = activeRoom === room;
                const studentCount = roomStudentsCount(room);
                const teacherName = roomTeacherName(room);
                const teacherObj = roomTeacherObj(room);

                return (
                  <div
                    key={room}
                    onClick={() => setActiveRoom(isActive ? '' : room)}
                    className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive 
                        ? 'bg-indigo-950/30 border-indigo-500 shadow-md' 
                        : 'glass border-slate-800 hover:border-slate-705'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] text-indigo-400 font-extrabold uppercase">Classroom</span>
                          <h4 className="text-xl font-extrabold text-white mt-0.5">{room}</h4>
                        </div>
                        <span className="bg-slate-950 text-indigo-400 border border-indigo-900/40 text-[10px] font-bold px-2.5 py-0.5 rounded">
                          {studentCount} Students
                        </span>
                      </div>
                      <div className="mt-4 space-y-0.5">
                        <span className="text-[9px] text-slate-505 uppercase font-bold block">Invigilator</span>
                        <div className="flex items-center gap-1.5">
                          <UserCheck size={12} className={teacherObj ? 'text-emerald-400' : 'text-slate-600'} />
                          <span className={`text-xs font-semibold ${teacherObj ? 'text-slate-200' : 'text-slate-500'}`}>{teacherName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px]">
                      <span className="text-indigo-400 font-semibold">{isActive ? 'Hide Details' : 'View Seating Details →'}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoomAllocation(room);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-905 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {activeRoom && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
              <div className="xl:col-span-2 space-y-4">
                <div className="glass rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
                  <div className="px-6 py-4.5 border-b border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <School className="text-indigo-400" size={16} />
                      <h3 className="font-extrabold text-slate-100 text-sm">Seating Map: Room {activeRoom}</h3>
                    </div>
                    <button onClick={() => setActiveRoom('')} className="text-slate-505 hover:text-slate-300 bg-slate-905 p-1 rounded-lg"><X size={12} /></button>
                  </div>
                  <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-slate-800/80 text-[10px] font-semibold text-slate-450 uppercase tracking-wider sticky top-0 z-10">
                          <th className="px-6 py-3 bg-slate-950/80">Seat</th>
                          <th className="px-6 py-3 bg-slate-950/80">Register No</th>
                          <th className="px-6 py-3 bg-slate-950/80">Name</th>
                          <th className="px-6 py-3 bg-slate-950/80">Dept</th>
                          <th className="px-6 py-3 bg-slate-950/80">Sem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/60 text-xs text-slate-350">
                        {activeRoomStudents.map((alloc) => (
                          <tr key={alloc._id} className="hover:bg-slate-900/20">
                            <td className="px-6 py-3"><span className="bg-indigo-900/40 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold text-[10px]">Seat {alloc.seatNumber}</span></td>
                            <td className="px-6 py-3 font-mono text-indigo-400">{alloc.registerNumber}</td>
                            <td className="px-6 py-3 font-medium text-slate-200">{alloc.student?.name || 'N/A'}</td>
                            <td className="px-6 py-3">{alloc.department}</td>
                            <td className="px-6 py-3">{alloc.semester}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-2xl p-5 border border-slate-800/60">
                  <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5 mb-3">
                    <UserCheck className="text-indigo-400" size={16} />
                    <h3 className="font-bold text-slate-100 text-xs">Assign / Override Teacher</h3>
                  </div>
                  <form onSubmit={handleAssignTeacher} className="space-y-4">
                    <div>
                      <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Modify assigned teacher for <strong>Room {activeRoom}</strong>. Only free invigilators are listed.</p>
                      <div className="relative">
                        <select
                          value={assignTeacher}
                          onChange={(e) => setAssignTeacher(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs appearance-none outline-none focus:border-indigo-500 text-slate-200"
                          required
                        >
                          <option value="">Select Teacher</option>
                          {teachers
                            .filter(teacher => {
                              const assignedToOther = teacherAllocations.some(
                                alloc => alloc.roomNumber !== activeRoom && 
                                (alloc.teacher?._id === teacher._id || alloc.teacher === teacher._id)
                              );
                              return !assignedToOther;
                            })
                            .map(teacher => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.name} ({teacher.employeeId})
                              </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-2.5 text-slate-505 pointer-events-none" size={14} />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-2 px-3 rounded-xl text-xs font-semibold transition-all">
                      Assign Selected
                    </button>
                  </form>
                </div>

                {roomTeacherObj(activeRoom) && (
                  <div className="glass p-4 rounded-xl border border-slate-800/60 space-y-2">
                    <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Active duty Invigilator</h4>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{roomTeacherObj(activeRoom).teacher?.name}</p>
                        <p className="text-[9px] text-slate-550 font-mono mt-0.5">ID: {roomTeacherObj(activeRoom).teacher?.employeeId}</p>
                        <p className="text-[9px] bg-indigo-900/30 text-indigo-400 border border-indigo-900/30 px-2 py-0.5 rounded font-bold inline-block mt-2">
                          Dept: {roomTeacherObj(activeRoom).teacher?.department}
                        </p>
                      </div>
                      <button onClick={() => handleRemoveTeacherAssignment(roomTeacherObj(activeRoom)._id)} className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-900 rounded-lg"><Trash2 size={12} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 🏛️ CORE: ADMIN DASHBOARD VIEW WRAPPER
// =========================================================================
const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => setSearchParams({ tab });
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClassrooms: 0,
    totalCapacity: 0,
    allocatedSeats: 0,
    availableSeats: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/allocations/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch system stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-0">
      {activeTab === 'overview' && (
        <OverviewPanel 
          stats={stats} 
          loading={loading} 
          error={error} 
          onRefresh={fetchStats} 
          setActiveTab={setActiveTab} 
        />
      )}
      {activeTab === 'students' && <StudentsPanel />}
      {activeTab === 'teachers' && <TeachersPanel />}
      {activeTab === 'classrooms' && <ClassroomsPanel />}
      {activeTab === 'allocate' && <AllocatePanel setActiveTab={setActiveTab} onRefresh={fetchStats} />}
      {activeTab === 'view-allocations' && <ViewAllocationsPanel onRefresh={fetchStats} />}
    </div>
  );
};

export default AdminDashboard;
