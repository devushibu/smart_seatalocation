import React from "react";
import {
  Users,
  School,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  RefreshCw,
  Cpu,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OverviewPanel = ({ stats, loading, error, onRefresh, setActiveTab }) => {
  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      description: "Registered student database",
      icon: Users,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      action: () => setActiveTab("students"),
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      description: "Active invigilators pool",
      icon: UserCheck,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      action: () => setActiveTab("teachers"),
    },
    {
      title: "Classrooms",
      value: stats.totalClassrooms,
      description: "Available exam halls",
      icon: School,
      color: "text-emerald-450",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      action: () => setActiveTab("classrooms"),
    },
    {
      title: "Total Capacity",
      value: stats.totalCapacity,
      description: "Max simultaneous seatings",
      icon: CheckCircle2,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-400px gap-3">
        <div className="w-10 h-10 border-4 border-indigo-650/30 border-t-indigo-550 rounded-full animate-spin" />
        <span className="text-muted-foreground text-sm font-medium tracking-wide">
          Aggregating statistics...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive-foreground p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="hover:bg-destructive/20 hover:text-white"
        >
          <RefreshCw size={14} className="mr-2" /> Retry
        </Button>
      </div>
    );
  }

  const utilizationRate =
    stats.totalCapacity > 0
      ? Math.round((stats.totalStudents / stats.totalCapacity) * 100)
      : 0;

  const isOverCapacity = utilizationRate > 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className={`bg-card border-border shadow-md overflow-hidden transition-all duration-300 ${stat.action ? "hover:-translate-y-1 hover:shadow-lg cursor-pointer" : ""}`}
              onClick={stat.action}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">
                      {stat.title}
                    </CardTitle>
                    <div className="text-3xl font-black text-foreground tracking-tight">
                      {stat.value || 0}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl border ${stat.bg} ${stat.border} ${stat.color} shadow-inner`}
                  >
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <CardDescription className="text-xs font-medium text-muted-foreground">
                    {stat.description}
                  </CardDescription>
                  {stat.action && (
                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-colors">
                      <ChevronRight size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card border-border overflow-hidden rounded-3xl shadow-md relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]" />

        <CardHeader className="p-8 border-b border-border flex flex-row justify-between items-center bg-muted/40 space-y-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <Cpu size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground tracking-wide">
                System Capacity Overview
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                Real-time Resource Allocation
              </CardDescription>
            </div>
          </div>
          {isOverCapacity && (
            <div className="flex items-center gap-2 text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
              <ShieldAlert size={14} /> Critical Overload
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-sm font-semibold text-foreground">
                  Total Infrastructure Utilization
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Comparing total registered students against available seating
                  capacity
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-3xl font-black ${isOverCapacity ? "text-destructive" : "text-emerald-500"}`}
                >
                  {utilizationRate}%
                </span>
              </div>
            </div>

            <div className="h-4 bg-muted rounded-full overflow-hidden border border-border shadow-inner p-0.5 relative">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                  isOverCapacity
                    ? "bg-linear-to-r from-orange-500 to-red-500"
                    : "bg-linear-to-r from-emerald-500 to-teal-400"
                }`}
                style={{ width: `${Math.min(utilizationRate, 100)}%` }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>

            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>{stats.totalStudents} Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{stats.totalCapacity} Capacity</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {isOverCapacity && (
              <div className="mt-6 bg-destructive/10 border border-destructive/20 p-5 rounded-2xl flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="text-destructive-foreground shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="text-sm font-bold text-destructive-foreground">
                    Action Required: Insufficient Capacity
                  </h4>
                  <p className="text-xs text-destructive-foreground/80 mt-1 leading-relaxed">
                    There are currently more students registered than available
                    seats in the system. You must add more classrooms or
                    reconfigure seating capacities before attempting to run the
                    allocation wizard.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("classrooms")}
                    className="mt-3 text-xs hover:bg-destructive/20"
                  >
                    Manage Classrooms
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPanel;
