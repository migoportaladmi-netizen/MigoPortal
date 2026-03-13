import React from 'react';
import {
  ArrowRight, Check, Receipt, Shield, Map, Star, Menu, X, LayoutDashboard,
  Search, Bell, Plus, Briefcase, MapPin, Clock, Users, ClipboardList, Heart,
  UserPlus, Target, DollarSign, BookOpen, Award, CalendarDays, UserCog, ChevronRight
} from 'lucide-react';
import { MOCK_JOBS } from '../constants';

interface LandingPageProps {
  onNavigateToAuth: (mode?: 'login' | 'signup') => void;
}

const FEATURES = [
  {
    icon: <Receipt size={22} />,
    color: 'indigo',
    title: 'Expense Management',
    description: 'Upload receipts, track spending, get tax-deductibility hints, and manage multi-currency expenses.'
  },
  {
    icon: <Map size={22} />,
    color: 'violet',
    title: 'Trip & Travel',
    description: 'Plan business trips, build detailed itineraries, and track travel budgets in one place.'
  },
  {
    icon: <Clock size={22} />,
    color: 'blue',
    title: 'Attendance',
    description: 'Log daily hours, track weekly targets, and get manager approvals with a simple timesheet.'
  },
  {
    icon: <CalendarDays size={22} />,
    color: 'teal',
    title: 'Absence & Leave',
    description: 'Request vacation, sick leave, and remote work. See balances and get approvals fast.'
  },
  {
    icon: <DollarSign size={22} />,
    color: 'green',
    title: 'Payroll',
    description: 'Run payroll, publish pay stubs, and manage compensation — all within a secure hub.'
  },
  {
    icon: <Users size={22} />,
    color: 'sky',
    title: 'My Team',
    description: 'View team member profiles, roles, departments, and employment details in one directory.'
  },
  {
    icon: <Target size={22} />,
    color: 'orange',
    title: 'Goals & OKRs',
    description: "Set personal and business goals, track progress, and align your team's priorities."
  },
  {
    icon: <BookOpen size={22} />,
    color: 'pink',
    title: 'Performance Reviews',
    description: 'Run structured review cycles with self-assessments, manager ratings, and custom templates.'
  },
  {
    icon: <ClipboardList size={22} />,
    color: 'emerald',
    title: 'Surveys & Feedback',
    description: 'Create custom surveys, collect responses, and analyze results to improve your culture.'
  },
  {
    icon: <Heart size={22} />,
    color: 'rose',
    title: 'Peer Recognition',
    description: 'Celebrate wins with public praise badges — boost morale and team engagement.'
  },
  {
    icon: <Briefcase size={22} />,
    color: 'amber',
    title: 'Jobs & Recruitment',
    description: 'Post open roles, screen applicants, schedule interviews, and hire — all in-portal.'
  },
  {
    icon: <UserCog size={22} />,
    color: 'slate',
    title: 'Admin Controls',
    description: 'Manage team members, company settings, roles, and approvals from a dedicated admin panel.'
  },
];

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', icon: 'text-indigo-600 dark:text-indigo-400' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', icon: 'text-violet-600 dark:text-violet-400' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-600 dark:text-blue-400' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300', icon: 'text-teal-600 dark:text-teal-400' },
  green: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', icon: 'text-green-600 dark:text-green-400' },
  sky: { bg: 'bg-sky-50 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300', icon: 'text-sky-600 dark:text-sky-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', icon: 'text-orange-600 dark:text-orange-400' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', icon: 'text-pink-600 dark:text-pink-400' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', icon: 'text-emerald-600 dark:text-emerald-400' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', icon: 'text-rose-600 dark:text-rose-400' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', icon: 'text-amber-600 dark:text-amber-400' },
  slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', icon: 'text-slate-600 dark:text-slate-400' },
};

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const openJobs = MOCK_JOBS.filter(job => job.status === 'Open');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">M</div>
              <span className="font-bold text-xl tracking-tight">MigoPortal</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('careers')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</button>
              <button onClick={() => onNavigateToAuth('login')} className="text-sm font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Log in</button>
              <button onClick={() => onNavigateToAuth('signup')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                Get Started
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-300">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-4 space-y-4">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left text-slate-600 dark:text-slate-300 font-medium">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-slate-600 dark:text-slate-300 font-medium">Pricing</button>
            <button onClick={() => scrollToSection('careers')} className="block w-full text-left text-slate-600 dark:text-slate-300 font-medium">Careers</button>
            <hr className="border-slate-100 dark:border-slate-800" />
            <button onClick={() => onNavigateToAuth('login')} className="block w-full text-left text-indigo-600 dark:text-indigo-400 font-bold">Log In</button>
            <button onClick={() => onNavigateToAuth('signup')} className="block w-full bg-indigo-600 text-white py-2 rounded-lg font-medium">Get Started</button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-6 animate-fade-in">
          <Star size={14} className="fill-indigo-600 dark:fill-indigo-300" />
          <span>All-in-one HR & Employee Portal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white animate-fade-in">
          Every HR Tool Your <br className="hidden md:block" />Team Will Ever Need
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 animate-fade-in">
          From expenses and payroll to attendance, performance reviews, recognition, and recruitment — run your entire people operation in one secure platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in mb-12">
          <button
            onClick={() => onNavigateToAuth('signup')}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-full shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Start Free Trial <ArrowRight size={20} />
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-lg font-semibold rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            Explore Features
          </button>
        </div>

        {/* Feature pill chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 animate-fade-in">
          {['Expenses', 'Payroll', 'Attendance', 'Absence', 'Trips', 'Goals', 'Reviews', 'Surveys', 'Recognition', 'Recruitment', 'My Team', 'Admin'].map(f => (
            <span key={f} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm rounded-full font-medium border border-slate-200 dark:border-slate-700">
              {f}
            </span>
          ))}
        </div>

        {/* App Mockup */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-2xl overflow-hidden animate-fade-in text-left">
          <div className="absolute top-0 w-full h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 space-x-2 z-10">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex h-[500px] md:h-[580px] pt-8 bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Mock Sidebar */}
            <div className="w-56 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800 p-3 gap-0.5 overflow-hidden">
              <div className="flex items-center gap-2 mb-5 px-2 mt-1">
                <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">M</div>
                <span className="font-bold text-lg text-white">MigoPortal</span>
              </div>
              {[
                { icon: <LayoutDashboard size={15} />, label: 'Dashboard', active: true },
                { icon: <Receipt size={15} />, label: 'Expenses' },
                { icon: <Map size={15} />, label: 'Trips' },
                { icon: <Clock size={15} />, label: 'Attendance' },
                { icon: <CalendarDays size={15} />, label: 'Absence' },
                { icon: <DollarSign size={15} />, label: 'Payroll' },
                { icon: <Users size={15} />, label: 'My Team' },
                { icon: <Target size={15} />, label: 'Goals' },
                { icon: <BookOpen size={15} />, label: 'Reviews' },
                { icon: <ClipboardList size={15} />, label: 'Surveys' },
                { icon: <Heart size={15} />, label: 'Recognition' },
                { icon: <Briefcase size={15} />, label: 'Recruitment' },
              ].map(item => (
                <div key={item.label} className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium ${item.active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                  {item.icon} {item.label}
                </div>
              ))}
            </div>

            {/* Mock Content */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
              <div className="h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-5">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1 w-48">
                  <Search size={13} className="text-slate-400" />
                  <span className="ml-2 text-xs text-slate-400">Search portal...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600"><Bell size={13} /></div>
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">JD</div>
                </div>
              </div>

              <div className="p-5 overflow-hidden space-y-4">
                {/* Welcome Banner mockup */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white">
                  <p className="font-bold text-sm">Welcome back, John! 👋</p>
                  <p className="text-indigo-200 text-xs mt-0.5">Product Manager · Engineering</p>
                </div>

                {/* Attendance / Absence mini cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <p className="text-xs text-slate-500 font-semibold">Attendance</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">32.5h</p>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2">
                      <div className="h-full w-4/5 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                    <p className="text-xs text-slate-500 font-semibold">Absence</p>
                    <div className="flex gap-3 mt-1">
                      <div><p className="text-lg font-bold text-green-600">15</p><p className="text-xs text-slate-400">Vacation</p></div>
                      <div><p className="text-lg font-bold text-blue-500">5</p><p className="text-xs text-slate-400">Sick</p></div>
                    </div>
                  </div>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Expenses', value: '$4,250', sub: '+12%', color: 'indigo' },
                    { label: 'Goals', value: '3', sub: 'In Progress', color: 'green' },
                    { label: 'Reviews', value: '2', sub: 'Pending', color: 'pink' },
                    { label: 'Open Jobs', value: '3', sub: 'Hiring', color: 'amber' },
                  ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-400">{s.label}</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{s.value}</p>
                      <p className="text-xs text-green-500">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Complete Suite for Modern Teams</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Replace a dozen disjointed tools with one unified platform. 12 powerful modules, zero complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(feature => {
              const c = colorMap[feature.color];
              return (
                <div key={feature.title} className="bg-white dark:bg-slate-800 p-7 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                  <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center ${c.icon} mb-5`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '12', label: 'Integrated Modules' },
              { value: '100%', label: 'Secure & Encrypted' },
              { value: '✓', label: 'Intuitive & Easy to Use' },
              { value: '1', label: 'Platform. Zero Chaos.' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-white">{s.value}</p>
                <p className="text-indigo-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-64 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -left-64 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Transparent Pricing for Growing Teams</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Start with the essentials and scale as your team grows. Secure payments via Stripe.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-900 rounded-3xl p-1 border border-slate-800 shadow-2xl">
              <div className="bg-slate-900 rounded-[22px] p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex-1 w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
                    Starter Plan
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Team Starter</h3>
                  <p className="text-slate-400 mb-6">Perfect for establishing your company's digital HR hub.</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-6xl font-bold text-white tracking-tight">$13.98</span>
                    <span className="text-slate-400 text-xl mb-2">/ month</span>
                  </div>
                  <p className="text-indigo-400 font-medium mb-8 flex items-center gap-2">
                    <Users size={18} /> Includes 2 Users (1 Admin + 1 Employee)
                  </p>
                  <button onClick={() => onNavigateToAuth('signup')} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2">
                    Subscribe with Stripe <ArrowRight size={18} />
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-3">Secure checkout. Cancel anytime.</p>
                </div>
                <div className="w-full lg:w-px h-px lg:h-80 bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
                <div className="flex-1 w-full">
                  <h4 className="text-xl font-bold text-white mb-6">Everything included:</h4>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Expenses, Trips & Payroll',
                      'Attendance & Absence Management',
                      'Goals, Reviews & Surveys',
                      'Peer Recognition & Team Directory',
                      'Jobs Board & Recruitment Pipeline',
                      'Smart Receipt Upload with Manual Entry',
                      'Admin Panel & Role Management',
                      'PWA — Install as a native app',
                    ].map(item => (
                      <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                        <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 mt-0.5 flex-shrink-0"><Check size={12} /></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400"><UserPlus size={20} /></div>
                      <div>
                        <h5 className="font-bold text-white text-sm">Scaling Up?</h5>
                        <p className="text-xs text-slate-400">Add more members anytime.</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center">
                      <span className="text-slate-300 text-sm">Additional User</span>
                      <span className="text-white font-bold">$6.99 <span className="text-slate-500 text-xs font-normal">/ user / mo</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Careers ── */}
      <section id="careers" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Join Our Team</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We're hiring talented people to help build the future of work. Browse open positions below.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openJobs.length > 0 ? openJobs.map(job => (
              <div key={job.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">{job.department}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.postedDate}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                <div className="space-y-1.5 mb-4 flex-grow">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><MapPin size={14} /> {job.location}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Briefcase size={14} /> {job.type}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><DollarSign size={14} /> {job.salaryRange}</div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 line-clamp-2">{job.description}</p>
                <button onClick={() => onNavigateToAuth('signup')} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  Apply Now <ArrowRight size={16} />
                </button>
              </div>
            )) : (
              <div className="col-span-3 text-center py-16">
                <Briefcase size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No open positions right now. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">M</div>
              <span className="font-bold text-lg text-slate-800 dark:text-white">MigoPortal</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <button onClick={() => scrollToSection('features')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('careers')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</button>
              <button onClick={() => onNavigateToAuth('login')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Log In</button>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-600">© {new Date().getFullYear()} MigoPortal LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;