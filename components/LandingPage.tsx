import React from 'react';
import { ArrowRight, Check, Receipt, Shield, Map, Star, Menu, X, LayoutDashboard, Search, Bell, Plus, Briefcase, MapPin, Clock, Users, ClipboardList, Heart, UserPlus } from 'lucide-react';
import { MOCK_JOBS } from '../constants';

interface LandingPageProps {
  onNavigateToAuth: (mode?: 'login' | 'signup') => void;
}

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
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">M</div>
              <span className="font-bold text-xl tracking-tight">MigoPortal</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</button>
              <button onClick={() => scrollToSection('careers')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">Careers</button>
              <button 
                onClick={() => onNavigateToAuth('login')}
                className="text-sm font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Log in
              </button>
              <button 
                onClick={() => onNavigateToAuth('signup')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-4 space-y-4">
             <button onClick={() => scrollToSection('features')} className="block w-full text-left text-slate-600 dark:text-slate-300 font-medium">Features</button>
             <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-slate-600 dark:text-slate-300 font-medium">Pricing</button>
             <button onClick={() => scrollToSection('careers')} className="block w-full text-left text-slate-600 dark:text-slate-300 font-medium">Careers</button>
             <hr className="border-slate-100 dark:border-slate-800"/>
             <button onClick={() => onNavigateToAuth('login')} className="block w-full text-left text-indigo-600 dark:text-indigo-400 font-bold">Log In</button>
             <button onClick={() => onNavigateToAuth('signup')} className="block w-full bg-indigo-600 text-white py-2 rounded-lg font-medium">Get Started</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-6 animate-fade-in">
          <Star size={14} className="fill-indigo-600 dark:fill-indigo-300" />
          <span>New: AI-Powered Employee Portal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white animate-fade-in">
          All-in-One Employee <br className="hidden md:block"/> Experience Platform
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in">
          Manage expenses, travel, time, hiring, and company culture in one unified portal powered by Gemini AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
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

        {/* Hero Image Mockup (Generated in CSS/HTML for high fidelity) */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-2xl overflow-hidden animate-fade-in text-left">
            {/* Browser Window Controls */}
            <div className="absolute top-0 w-full h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 space-x-2 z-10">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            
            {/* App Mockup Container */}
            <div className="flex h-[500px] md:h-[600px] pt-8 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Mock Sidebar */}
                <div className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800 p-4">
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">M</div>
                        <span className="font-bold text-xl text-white">MigoPortal</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 bg-indigo-600 text-white rounded-lg"><LayoutDashboard size={18}/> <span className="text-sm font-medium">Dashboard</span></div>
                        <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg"><Receipt size={18}/> <span className="text-sm font-medium">Expenses</span></div>
                        <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg"><Map size={18}/> <span className="text-sm font-medium">Trips</span></div>
                        <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg"><Clock size={18}/> <span className="text-sm font-medium">Time & Absence</span></div>
                        <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg"><Briefcase size={18}/> <span className="text-sm font-medium">Jobs</span></div>
                        <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg"><ClipboardList size={18}/> <span className="text-sm font-medium">Surveys</span></div>
                    </div>
                </div>

                {/* Mock Main Content */}
                <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
                     {/* Mock Header */}
                     <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5 w-64">
                           <Search size={16} className="text-slate-400"/>
                           <span className="ml-2 text-sm text-slate-400">Search portal...</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Bell size={16}/></div>
                           <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">JD</div>
                        </div>
                     </div>

                     {/* Mock Dashboard Body */}
                     <div className="p-6 overflow-hidden">
                        <div className="flex justify-between items-end mb-6">
                           <div>
                              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, John</p>
                           </div>
                           <div className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2">
                              <Plus size={16}/> Add Expense
                           </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                              <p className="text-xs text-slate-500 font-medium uppercase">Total Expenses</p>
                              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">$4,250</p>
                              <span className="text-xs text-green-600 font-medium">+12%</span>
                           </div>
                           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                              <p className="text-xs text-slate-500 font-medium uppercase">Active Surveys</p>
                              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">1</p>
                              <span className="text-xs text-indigo-600 font-medium">Pending</span>
                           </div>
                           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                              <p className="text-xs text-slate-500 font-medium uppercase">Hours Worked</p>
                              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">32h</p>
                              <span className="text-xs text-slate-400 font-medium">This Week</span>
                           </div>
                           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hidden md:block">
                               <p className="text-xs text-slate-500 font-medium uppercase">Open Jobs</p>
                               <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">3</p>
                               <span className="text-xs text-amber-600 font-medium">Hiring</span>
                           </div>
                        </div>

                        {/* Recent Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="font-semibold text-sm mb-4 text-slate-900 dark:text-white">Recent Activity</h3>
                                <div className="space-y-3">
                                   {[1, 2, 3].map(i => (
                                       <div key={i} className="flex justify-between items-center text-sm">
                                           <div className="flex items-center gap-3">
                                               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${i===1 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'} dark:bg-slate-800`}>
                                                   {i === 1 ? 'HR' : i === 2 ? 'DL' : 'SB'}
                                                </div>
                                               <div>
                                                   <p className="font-medium text-slate-900 dark:text-white">{i === 1 ? 'Survey Assigned' : i === 2 ? 'Flight Booking' : 'Expense Added'}</p>
                                                   <p className="text-xs text-slate-500">{i === 1 ? 'Feedback' : 'Travel'}</p>
                                               </div>
                                           </div>
                                           <span className="font-medium text-slate-900 dark:text-white">{i === 1 ? 'Action' : '-$320'}</span>
                                       </div>
                                   ))}
                                </div>
                            </div>
                             <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hidden md:block">
                                <h3 className="font-semibold text-sm mb-4 text-slate-900 dark:text-white">Leave Balance</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300"><span>Vacation</span> <span>12/15 Days</span></div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full"><div className="h-full w-3/4 bg-green-500 rounded-full"></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-300"><span>Sick Leave</span> <span>5/5 Days</span></div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full"><div className="h-full w-full bg-blue-500 rounded-full"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Complete Suite for Modern Teams</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Replace multiple disjointed tools with one unified platform tailored for growing LLCs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Expense */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <Receipt size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Expense Automation</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Scan receipts instantly. Our AI extracts data and flags tax-deductible expenses automatically.
              </p>
            </div>

            {/* Travel */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6">
                <Map size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Travel Planning</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Create detailed itineraries, manage bookings, and track travel budgets in one place.
              </p>
            </div>

            {/* Time */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Time & Absence</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Effortless timesheets and leave management. Request vacation and get approved in clicks.
              </p>
            </div>

            {/* Recruiting */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Internal Job Board</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Post open roles and manage internal applications seamlessly to grow your team.
              </p>
            </div>

            {/* Surveys */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <ClipboardList size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Surveys & Feedback</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Gather employee insights with custom surveys. Visualize results and improve culture.
              </p>
            </div>

            {/* Recognition */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Peer Recognition</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Boost morale by allowing team members to send public praise and badges to colleagues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Background blobs for visual interest */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -right-64 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -left-64 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Transparent Pricing for Growing Teams</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Start with the essentials and scale as you hire. Payments handled securely via Stripe.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-900 rounded-3xl p-1 border border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="bg-slate-900 rounded-[22px] p-8 md:p-12 relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                  
                  {/* Left Side: Base Plan */}
                  <div className="flex-1 w-full lg:w-auto">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
                        Beginner Plan
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">Team Starter</h3>
                      <p className="text-slate-400 mb-6">Perfect for establishing your LLC's digital HQ.</p>
                      
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

                  {/* Divider Line (Horizontal on mobile, vertical on desktop) */}
                  <div className="w-full lg:w-px h-px lg:h-80 bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>

                  {/* Right Side: Add-ons & Features */}
                  <div className="flex-1 w-full lg:w-auto">
                      <h4 className="text-xl font-bold text-white mb-6">What's included:</h4>
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3 text-slate-300">
                          <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 mt-0.5"><Check size={14} /></div>
                          <span><strong>Full Platform Access:</strong> Expenses, Travel, Time & Absence</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300">
                          <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 mt-0.5"><Check size={14} /></div>
                          <span><strong>Admin Controls:</strong> Manage roles, approvals, and company settings</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300">
                          <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 mt-0.5"><Check size={14} /></div>
                          <span><strong>AI Automation:</strong> Unlimited receipt scanning & itinerary generation</span>
                        </li>
                      </ul>

                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                          <div className="flex items-center gap-4 mb-2">
                              <div className="bg-indigo-500/20 p-2.5 rounded-lg text-indigo-400">
                                  <UserPlus size={24} />
                              </div>
                              <div>
                                  <h5 className="font-bold text-white">Scaling Up?</h5>
                                  <p className="text-xs text-slate-400">Add more team members anytime.</p>
                              </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center">
                              <span className="text-slate-300 text-sm">Additional User Cost</span>
                              <span className="text-white font-bold">$6.99 <span className="text-slate-500 text-xs font-normal">/ user / mo</span></span>
                          </div>
                      </div>
                  </div>

               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-20 bg-slate-50 dark:bg-slate-900">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Join our Team</h2>
               <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  We're looking for talented individuals to help us build the future of work.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {openJobs.length > 0 ? openJobs.map(job => (
                  <div key={job.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col">
                     <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                           {job.department}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.postedDate}</span>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                     
                     <div className="space-y-2 mb-6 flex-grow">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                           <MapPin size={16} className="text-slate-400" /> {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                           <Briefcase size={16} className="text-slate-400" /> {job.type}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                           <Clock size={16} className="text-slate-400" /> {job.salaryRange}
                        </div>
                     </div>
                     
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">
                        {job.description}
                     </p>
                     
                     <button 
                        onClick={() => onNavigateToAuth('signup')}
                        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors mt-auto"
                     >
                        Apply Now
                     </button>
                  </div>
               )) : (
                  <div className="col-span-3 text-center py-12">
                     <p className="text-slate-500 dark:text-slate-400">No open positions at the moment. Check back later!</p>
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400">
           <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-slate-300 dark:bg-slate-700 rounded-md flex items-center justify-center font-bold text-white text-xs">M</div>
              <span className="font-bold text-slate-700 dark:text-slate-300">MigoPortal</span>
           </div>
           <p className="text-sm">© {new Date().getFullYear()} MigoPortal LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;