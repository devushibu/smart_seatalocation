import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Shield,
  Users,
  GraduationCap,
  Lock,
  LogIn,
  AlertCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { login, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("student"); // 'student', 'teacher', 'admin'
  const [identifier, setIdentifier] = useState(""); // username / employeeId / registerNumber
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError(null);
    setIdentifier("");
    setPassword("");
  }, [activeTab, setError]);

  // Route to correct dashboard if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "teacher") navigate("/teacher/dashboard");
      else if (user.role === "student") navigate("/student/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields");
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
    if (activeTab === "student") return "Student Name";
    if (activeTab === "teacher") return "Teacher Name";
    return "Username";
  };

  const getPasswordPlaceholder = () => {
    if (activeTab === "student") return "Enter Register Number";
    if (activeTab === "teacher") return "Enter Employee ID";
    return "••••••••";
  };

  const getTabIcon = () => {
    if (activeTab === "student") return <GraduationCap size={15} />;
    if (activeTab === "teacher") return <Users size={15} />;
    return <Shield size={15} />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/5 dark:bg-indigo-650/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-85 bg-card text-card-foreground border-border relative z-10 shadow-2xl mx-auto">
        <CardHeader className="flex flex-col items-center mb-1 text-center pb-1">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/30 mb-3 static">
            <Shield size={24} />
          </div>
          <CardTitle className="text-xl font-bold tracking-wide text-foreground">
            Smart Exam System
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Seat Allocation & Hall Management
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="flex w-full bg-muted border border-border rounded-xl h-auto p-1 mb-4 items-center">
              <TabsTrigger
                value="student"
                className="flex-1 rounded-lg data-active:bg-indigo-600 data-active:text-white py-1.5"
              >
                <div className="flex flex-row items-center gap-1.5 justify-center">
                  <GraduationCap size={12} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Student
                  </span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="teacher"
                className="flex-1 rounded-lg data-active:bg-indigo-600 data-active:text-white py-1.5"
              >
                <div className="flex flex-row items-center gap-1.5 justify-center">
                  <Users size={12} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Teacher
                  </span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className="flex-1 rounded-lg data-active:bg-indigo-600 data-active:text-white py-1.5"
              >
                <div className="flex flex-row items-center gap-1.5 justify-center">
                  <Shield size={12} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Admin
                  </span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm mb-6 animate-pulse">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {getTabLabel()}
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground/70">
                    {getTabIcon()}
                  </span>
                  <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={`Enter ${getTabLabel().toLowerCase()}`}
                    className="pl-9 h-10 bg-background border-border focus-visible:ring-indigo-500 rounded-xl text-foreground placeholder:text-muted-foreground/50 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground/70">
                    <Lock size={15} />
                  </span>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={getPasswordPlaceholder()}
                    className="pl-9 h-10 bg-background border-border focus-visible:ring-indigo-500 rounded-xl text-foreground placeholder:text-muted-foreground/50 text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 mt-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-300"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={16} className="mr-2" />
                    <span className="font-semibold tracking-wide text-sm">
                      Log In to Portal
                    </span>
                  </>
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground text-center">
          {activeTab === "student" && (
            <p>
              Students can log in using their Name as username and Register
              Number as the password.
            </p>
          )}
          {activeTab === "teacher" && (
            <p>
              Teachers can log in using their Name as username and Employee ID
              as the password.
            </p>
          )}
          {activeTab === "admin" && (
            <p>Admin credentials seeded during server setup.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
