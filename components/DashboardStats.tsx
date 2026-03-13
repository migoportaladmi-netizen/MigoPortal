import React from 'react';
import {
  DollarSign, Clock, Briefcase, Heart, Target, ClipboardList, Users, Plane,
  ArrowRight, TrendingUp, CheckCircle, XCircle, AlertCircle, Award, Calendar,
  Receipt, MapPin, BookOpen, BarChart2, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Expense, Trip, TimeEntry, AbsenceRequest, Job, JobApplication, Goal, Survey, EmployeeReview, Praise, Budget } from '../types';

interface DashboardStatsProps {
  user: any;
  expenses: Expense[];
  trips: Trip[];
  timeEntries: TimeEntry[];
  absenceRequests: AbsenceRequest[];
  jobs: Job[];
  applications: JobApplication[];
  goals: Goal[];
  surveys: Survey[];
  reviews: EmployeeReview[];
  praiseList: Praise[];
  allUsers: any[];
  setView: (view: string) => void;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#14b8a6'];

const DashboardStats: React.FC<DashboardStatsProps> = ({
  user, expenses, trips, timeEntries, absenceRequests, jobs, applications,
  goals, surveys, reviews, praiseList, allUsers, setView
}) => {
  const budget: Budget | undefined = user?.budget;

  // --- Expense Calculations ---
  const totalSpent = expenses.filter(e => e.submittedBy === user.name || user.role === 'Administrator').reduce((acc, e) => acc + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'Pending').length;

  const budgetSpent = budget
    ? expenses.filter(e => {
      const d = new Date(e.date);
      const now = new Date();
      return budget.period === 'Monthly'
        ? d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        : d.getFullYear() === now.getFullYear();
    }).reduce((acc, e) => acc + e.amount, 0)
    : 0;
  const budgetProgress = budget ? Math.min((budgetSpent / budget.amount) * 100, 100) : 0;

  const categoryData = expenses.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) existing.value += curr.amount;
    else acc.push({ name: curr.category, value: Math.round(curr.amount) });
    return acc;
  }, []);

  // --- Time & Absence ---
  const myTimeEntries = timeEntries.filter(e => e.userId === user.email);
  const hoursThisWeek = myTimeEntries
    .filter(e => {
      const d = new Date(e.date);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return d >= weekStart;
    })
    .reduce((acc, e) => acc + e.totalHours, 0);
  const pendingAbsences = absenceRequests.filter(a => a.status === 'Pending').length;

  // --- Goals ---
  const myGoals = goals.filter((g: any) => g.userId === user.email || user.role === 'Administrator');
  const completedGoals = myGoals.filter((g: any) => g.status === 'Completed').length;
  const inProgressGoals = myGoals.filter((g: any) => g.status === 'In Progress' || g.status === 'Not Started').length;

  // --- Jobs & Applications ---
  const openJobs = jobs.filter(j => j.status === 'Open').length;
  const pendingApplications = applications.filter(a => a.status === 'Pending').length;

  // --- Surveys ---
  const activeSurveys = surveys.filter(s => s.isActive).length;

  // --- Reviews ---
  const pendingReviews = reviews.filter((r: any) => r.status === 'Pending Self' || r.status === 'Pending Manager').length;

  // --- Team ---
  const activeTeamMembers = allUsers.filter(u => u.status === 'Active').length;
  const myPraise = praiseList.filter((p: any) => p.toUserName === user.name).length;

  // --- Monthly Expense Trend (last 4 months) ---
  const monthlyTrend = (() => {
    const months: { name: string; amount: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString('default', { month: 'short' });
      const amount = expenses
        .filter(e => {
          const ed = new Date(e.date);
          return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
        })
        .reduce((a, e) => a + e.amount, 0);
      months.push({ name: month, amount: Math.round(amount) });
    }
    return months;
  })();

  // --- Recent Trips ---
  const recentTrips = trips.slice(0, 3);

  // --- Recent Expenses ---
  const recentExpenses = expenses.slice(0, 5);

  // --- Status badge helper ---
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      Active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Planned: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Open: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    };
    return `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-600'}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
            <p className="mt-1 text-indigo-200 text-sm">
              {user.employment?.jobTitle || user.role} · {user.employment?.department || 'MigoPortal'}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-indigo-100 text-xs">Today</p>
            <p className="text-white font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* ── Attendance & Absence Quick View ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Attendance card */}
        <button
          onClick={() => setView('attendance')}
          className="text-left bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <Clock size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-white">Attendance</span>
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{hoursThisWeek.toFixed(1)}<span className="text-base font-normal text-slate-400 ml-1">h</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">this week of 40h target</p>
            </div>
            <span className={`text-sm font-semibold ${hoursThisWeek >= 40 ? 'text-green-500' : hoursThisWeek >= 30 ? 'text-blue-500' : 'text-amber-500'}`}>
              {Math.round((hoursThisWeek / 40) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${hoursThisWeek >= 40 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min((hoursThisWeek / 40) * 100, 100)}%` }}
            />
          </div>
        </button>

        {/* Absence card */}
        <button
          onClick={() => setView('absence')}
          className="text-left bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 hover:border-teal-300 dark:hover:border-teal-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-xl">
                <Calendar size={18} className="text-teal-600 dark:text-teal-400" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-white">Absence</span>
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xl font-bold text-green-600 dark:text-green-400">15</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Vacation</p>
            </div>
            <div className="text-center border-x border-slate-100 dark:border-slate-800">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">5</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sick</p>
            </div>
            <div className="text-center">
              <p className={`text-xl font-bold ${pendingAbsences > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{pendingAbsences}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pending</p>
            </div>
          </div>
        </button>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Expenses KPI */}
        <button onClick={() => setView('expenses')} className="text-left bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
              <Receipt size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Expenses</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
          {pendingExpenses > 0 && <p className="text-xs text-amber-500 mt-1">{pendingExpenses} pending approval</p>}
        </button>

        {/* Time KPI */}
        <button onClick={() => setView('time-absence')} className="text-left bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <Clock size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hours This Week</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{hoursThisWeek.toFixed(1)}h</p>
          <p className="text-xs text-slate-400 mt-1">of 40h target</p>
        </button>

        {/* Goals KPI */}
        <button onClick={() => setView('goals')} className="text-left bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-700 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <Target size={18} className="text-green-600 dark:text-green-400" />
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-green-500 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Goals</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{inProgressGoals}</p>
          <p className="text-xs text-green-500 mt-1">{completedGoals} completed</p>
        </button>

        {/* Team KPI */}
        <button onClick={() => setView('my-team')} className="text-left bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
              <Users size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-purple-500 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Team Members</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeTeamMembers}</p>
          <p className="text-xs text-slate-400 mt-1">active employees</p>
        </button>
      </div>

      {/* ── Budget Progress (if exists) ── */}
      {budget && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">{budget.period} Budget</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">${budgetSpent.toLocaleString()} of ${budget.amount.toLocaleString()} used</p>
            </div>
            <span className={`text-sm font-bold ${budgetProgress > 90 ? 'text-red-500' : budgetProgress > 70 ? 'text-amber-500' : 'text-green-500'}`}>
              {budgetProgress.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${budgetProgress > 90 ? 'bg-red-500' : budgetProgress > 70 ? 'bg-amber-500' : 'bg-indigo-500'}`}
              style={{ width: `${budgetProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Expense Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Monthly Expense Trend</h3>
            <TrendingUp size={16} className="text-indigo-500" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyTrend} barSize={28}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Spent']}
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spend by Category */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Spend by Category</h3>
            <BarChart2 size={16} className="text-purple-500" />
          </div>
          {categoryData.length > 0 ? (
            <div className="flex items-center gap-4">
              <PieChart width={140} height={140}>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                  {categoryData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {categoryData.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex-shrink-0">${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-slate-400 text-sm">No expense data yet</div>
          )}
        </div>
      </div>

      {/* ── Activity Overview Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Open Jobs */}
        <button onClick={() => setView('jobs')} className="text-left bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl w-fit mb-3">
            <Briefcase size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Open Jobs</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{openJobs}</p>
          {pendingApplications > 0 && <p className="text-xs text-amber-500 mt-1">{pendingApplications} applicants pending</p>}
        </button>

        {/* Active Surveys */}
        <button onClick={() => setView('surveys')} className="text-left bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all group">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl w-fit mb-3">
            <ClipboardList size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Surveys</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{activeSurveys}</p>
          <p className="text-xs text-slate-400 mt-1">awaiting responses</p>
        </button>

        {/* Pending Reviews */}
        <button onClick={() => setView('reviews')} className="text-left bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-700 transition-all group">
          <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-xl w-fit mb-3">
            <BookOpen size={16} className="text-pink-600 dark:text-pink-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Reviews</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{pendingReviews}</p>
          <p className="text-xs text-slate-400 mt-1">performance reviews</p>
        </button>

        {/* Recognition */}
        <button onClick={() => setView('recognition')} className="text-left bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all group">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-xl w-fit mb-3">
            <Award size={16} className="text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Praise Received</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{myPraise}</p>
          <p className="text-xs text-slate-400 mt-1">from teammates</p>
        </button>
      </div>

      {/* ── Recent Expenses & Trips ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Receipt size={16} className="text-indigo-500" /> Recent Expenses
            </h3>
            <button onClick={() => setView('expenses')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {recentExpenses.length === 0 ? (
              <p className="p-5 text-center text-sm text-slate-400">No expenses yet</p>
            ) : recentExpenses.map(expense => (
              <div key={expense.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{expense.merchant}</p>
                  <p className="text-xs text-slate-400 truncate">{expense.category} · {expense.date}</p>
                </div>
                <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">${expense.amount.toFixed(0)}</span>
                  <span className={statusBadge(expense.status)}>{expense.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Trips */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Plane size={16} className="text-blue-500" /> Upcoming Trips
            </h3>
            <button onClick={() => setView('trips')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {recentTrips.length === 0 ? (
              <p className="p-5 text-center text-sm text-slate-400">No trips planned</p>
            ) : recentTrips.map(trip => (
              <div key={trip.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                    <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{trip.destination}</p>
                    <p className="text-xs text-slate-400">{trip.startDate} → {trip.endDate}</p>
                  </div>
                </div>
                <span className={statusBadge(trip.status)}>{trip.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default DashboardStats;