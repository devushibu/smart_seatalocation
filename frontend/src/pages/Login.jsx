import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Users, GraduationCap, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('student'); // 'student', 'teacher', 'admin'
  const [identifier, setIdentifier] = useState(''); // username / employeeId / registerNumber
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError(null);
    setIdentifier('');
    setPassword('');
  }, [activeTab, setError]);

  // Route to correct dashboard if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else if (user.role === 'student') navigate('/student/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await login(activeTab, identifier, password);
    } catch (err) {
      // Error is already set in context
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getTabLabel = () => {
    if (activeTab === 'student') return 'Student Name';
    if (activeTab === 'teacher') return 'Teacher Name';
    return 'Username';
  };

  const getTabIcon = () => {
    if (activeTab === 'student') return <GraduationCap size={18} />;
    if (activeTab === 'teacher') return <Users size={18} />;
    return <Shield size={18} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-650/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md glass glow-card rounded-3xl p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3.5 rounded-2xl text-white shadow-lg shadow-indigo-600/30 mb-4 animate-bounce">
            <Shield size={28} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wide text-white">Smart Exam System</h2>
          <p className="text-slate-400 text-sm mt-1">Seat Allocation & Hall Management</p>
        </div>

        {/* Tab triggers */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 mb-6">
          {['student', 'teacher', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setActiveTab(role)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === role
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {role === 'student' && <GraduationCap size={16} />}
              {role === 'teacher' && <Users size={16} />}
              {role === 'admin' && <Shield size={16} />}
              <span>{role}</span>
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-sm mb-6 animate-pulse">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {getTabLabel()}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                {getTabIcon()}
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={`Enter ${getTabLabel().toLowerCase()}`}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500 text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 active:scale-[0.98] text-white py-4 rounded-2xl text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/25 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                <span>Log In to Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-800/60 pt-6">
          {activeTab === 'student' && (
            <p>Students can log in using their Name as username and Register Number as the password.</p>
          )}
          {activeTab === 'teacher' && (
            <p>Teachers can log in using their Name as username and Employee ID as the password.</p>
          )}
          {activeTab === 'admin' && (
            <p>Admin credentials seeded during server setup.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
