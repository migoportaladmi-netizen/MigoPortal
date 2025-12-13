import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Expense, Budget } from '../types';
import { DollarSign, Clock, ClipboardList, Briefcase, Sun } from 'lucide-react';

interface DashboardStatsProps {
  expenses: Expense[];
  budget?: Budget;
  hoursWorkedThisWeek?: number;
  pendingSurveys?: number;
  openJobs?: number;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

const DashboardStats: React.FC<DashboardStatsProps> = ({ expenses, budget, hoursWorkedThisWeek, pendingSurveys = 0, openJobs = 0 }) => {
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Calculate category breakdown
  const categoryData = expenses.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  // Calculate Monthly Spend (Simplified for demo)
  const monthlyData = [
    { name: 'Aug', amount: 1200 },
    { name: 'Sep', amount: 2100 },
    { name: 'Oct', amount: totalSpent }, // Current month roughly
  ];

  // Calculate Budget Progress if budget exists
  let budgetSpent = 0;
  let budgetProgress = 0;

  if (budget) {
    const now = new Date();
    // Filter expenses based on budget period
    if (budget.period === 'Monthly') {
       budgetSpent = expenses
         .filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
         })
         .reduce((acc, curr) => acc + curr.amount, 0);
    } else {
       budgetSpent = expenses
         .filter(e => new Date(e.date).getFullYear() === now.getFullYear())
         .reduce((acc, curr) => acc + curr.amount, 0);
    }
    budgetProgress = Math.min((budgetSpent / budget.amount) * 100, 100);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Stat Card 1: Total Spend */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider">Total Expenses</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 0 })}</p>
        </div>
        <div className="mt-4 text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
          +12.5% <span className="text-slate-400 dark:text-slate-500 font-normal ml-2">from last month</span>
        </div>
      </div>

      {/* Budget Status Card (Optional) */}
      {budget && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
           <div>
              <div className="flex justify-between items-start">
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider">{budget.period} Budget</h3>
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                     <DollarSign size={16} />
                  </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">${budgetSpent.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ ${budget.amount.toLocaleString()}</span></p>
           </div>
           <div className="mt-4 space-y-2">
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div 
                    className={`h-full rounded-full transition-all duration-500 ${budgetProgress > 90 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${budgetProgress}%` }}
                 ></div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-right">{budgetProgress.toFixed(1)}% Used</p>
           </div>
        </div>
      )}

      {/* Time Tracking Card (Optional) */}
      {hoursWorkedThisWeek !== undefined && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
              <div>
                  <div className="flex justify-between items-start">
                      <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider">Time Worked</h3>
                      <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                          <Clock size={16} />
                      </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{hoursWorkedThisWeek}h <span className="text-lg text-slate-400 dark:text-slate-500 font-normal">/ 40h</span></p>
              </div>
              <div className="mt-4">
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((hoursWorkedThisWeek / 40) * 100, 100)}%` }}
                      ></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This Week</p>
              </div>
          </div>
      )}

      {/* Active Actions Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
          <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider mb-2">Active Items</h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><ClipboardList size={14}/> Active Surveys</span>
                 <span className="font-bold text-slate-900 dark:text-white">{pendingSurveys}</span>
             </div>
             <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><Briefcase size={14}/> Open Jobs</span>
                 <span className="font-bold text-slate-900 dark:text-white">{openJobs}</span>
             </div>
             <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><Sun size={14}/> Vacation</span>
                 <span className="font-bold text-slate-900 dark:text-white text-xs">12/15 Days</span>
             </div>
          </div>
      </div>

      {/* Chart 1: Categories */}
      <div className={`col-span-1 md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors`}>
        <h3 className="text-slate-800 dark:text-white font-semibold mb-4">Spend by Category</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-prose-invert-body, #fff)' }}
                itemStyle={{ color: '#1e293b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Trends */}
      <div className={`col-span-1 md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors`}>
        <h3 className="text-slate-800 dark:text-white font-semibold mb-4">Monthly Trends</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
              <ReTooltip 
                cursor={{fill: 'rgba(241, 245, 249, 0.1)'}}
                formatter={(value: number) => [`$${value}`, 'Spent']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#6366f1' }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;