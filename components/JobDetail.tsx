import React, { useState } from 'react';
import { Job, ResumeAnalysis, User } from '../types';
import { ArrowLeft, MapPin, Building, DollarSign, Calendar, CheckCircle2, Bot, Sparkles, FileText, X } from 'lucide-react';
import { analyzeResume, generateCoverLetter, getMarketInsights } from '../services/geminiService';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface JobDetailProps {
  job: Job;
  user: User | null;
  onBack: () => void;
  onLoginRequest: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, user, onBack, onLoginRequest }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'ai-tools'>('details');
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [marketInsights, setMarketInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [applied, setApplied] = useState(false);

  // Computed/Fallback properties
  const requirements = job.requirements || [];
  const responsibilities = job.responsibilities || [];
  const companyName = job.companyName || job.companyId;
  const logoUrl = job.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random`;

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeText, job.description + " " + requirements.join(" "));
      setAnalysisResult(result);
    } catch (e) {
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    try {
      const letter = await generateCoverLetter(resumeText, job.description, companyName);
      setCoverLetter(letter);
    } catch (e) {
      alert("Failed to generate cover letter.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const insights = await getMarketInsights(job.title, job.location);
      setMarketInsights(insights);
    } catch (e) {
      setMarketInsights("Could not load market insights.");
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleApply = () => {
    if (!user) {
        onLoginRequest();
        return;
    }
    setApplied(true);
    setTimeout(() => alert("Application Sent successfully! The employer will contact you soon."), 100);
  };

  // Chart data for Match Score
  const chartData = analysisResult ? [
    {
      name: 'Match Score',
      uv: analysisResult.matchScore,
      fill: analysisResult.matchScore > 75 ? '#4f46e5' : analysisResult.matchScore > 50 ? '#eab308' : '#ef4444',
    }
  ] : [];

  return (
    <div className="animate-fade-in pb-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex gap-5">
              <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-2 flex items-center justify-center">
                 <img src={logoUrl} alt={companyName} className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400 text-sm">
                  <div className="flex items-center gap-1.5"><Building className="w-4 h-4" /> {companyName}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</div>
                  <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salaryRange}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {job.postedDate}</div>
                </div>
              </div>
            </div>
            
            {/* Action Button: Hide for Employer, Show for Applicant/Guest */}
            {user?.role !== 'Administrator' && ( // Assuming Administrator role for employer for simplicity or check specific employer role
                <button 
                  onClick={handleApply}
                  disabled={applied}
                  className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg ${applied ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none'}`}
                >
                  {applied ? 'Application Sent ✓' : 'Apply Now'}
                </button>
            )}
            
            {user?.role === 'Administrator' && (
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-lg text-sm font-medium">
                    View Only (Admin Mode)
                </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('details')}
            className={`px-8 py-4 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'details' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            Job Details
          </button>
          {user?.role !== 'Administrator' && (
              <button 
                onClick={() => setActiveTab('ai-tools')}
                className={`px-8 py-4 font-medium text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'ai-tools' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                <Sparkles className="w-4 h-4" />
                AI Assistant
              </button>
          )}
        </div>

        <div className="p-6 md:p-8 min-h-[500px]">
          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{job.description}</p>
                </section>
                {requirements.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Requirements</h3>
                    <ul className="space-y-3">
                      {requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {responsibilities.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                      {responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-100 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Market Insights
                  </h3>
                  {marketInsights ? (
                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed markdown-prose">
                      {marketInsights}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Get real-time salary and demand trends for this role powered by Google Search.</p>
                      <button 
                        onClick={handleFetchInsights}
                        disabled={loadingInsights}
                        className="w-full py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors disabled:opacity-50"
                      >
                        {loadingInsights ? 'Analyzing...' : 'Fetch Insights'}
                      </button>
                    </div>
                  )}
                </div>
                
                {user?.role !== 'Administrator' && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/50">
                    <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Perfect Fit?</h3>
                    <p className="text-indigo-700 dark:text-indigo-300 text-sm mb-4">Use our AI tools to analyze your resume against this job description.</p>
                    <button onClick={() => setActiveTab('ai-tools')} className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">
                      Go to AI Tools &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Left: Input */}
              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Paste your Resume / CV Text
                </label>
                <textarea 
                  className="flex-1 w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[300px]"
                  placeholder="Paste your resume content here to unlock AI insights..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                ></textarea>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !resumeText}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? 'Processing...' : <><Bot className="w-4 h-4" /> Analyze Match</>}
                  </button>
                  <button 
                    onClick={handleGenerateCoverLetter}
                    disabled={isAnalyzing || !resumeText}
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? 'Writing...' : <><FileText className="w-4 h-4" /> Write Cover Letter</>}
                  </button>
                </div>
              </div>

              {/* Right: Results */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto max-h-[600px]">
                {!analysisResult && !coverLetter && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-center">
                    <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                    <p>AI results will appear here</p>
                  </div>
                )}

                {/* Cover Letter Result */}
                {coverLetter && (
                  <div className="animate-fade-in relative mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Generated Cover Letter</h3>
                        <button onClick={() => setCoverLetter(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-sm leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {coverLetter}
                    </div>
                     <button 
                        onClick={() => navigator.clipboard.writeText(coverLetter)}
                        className="mt-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:underline"
                     >
                        Copy to Clipboard
                     </button>
                  </div>
                )}

                {/* Analysis Result */}
                {analysisResult && (
                  <div className="animate-fade-in space-y-6">
                     <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resume Analysis</h3>
                        <button onClick={() => setAnalysisResult(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
                    </div>

                    {/* Score Chart */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                         <div className="h-24 w-24 relative">
                             <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart 
                                  cx="50%" cy="50%" 
                                  innerRadius="60%" outerRadius="100%" 
                                  barSize={10} 
                                  data={chartData} 
                                  startAngle={90} 
                                  endAngle={-270}
                                >
                                  <RadialBar
                                    background
                                    dataKey="uv"
                                    cornerRadius={30}
                                  />
                                </RadialBarChart>
                             </ResponsiveContainer>
                             <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-gray-800 dark:text-white">
                                {analysisResult.matchScore}%
                             </div>
                         </div>
                         <div className="flex-1 ml-6">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Match Score</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{analysisResult.advice}</p>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 text-sm">Matching Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.matchingSkills.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-full">{skill}</span>
                                ))}
                                {analysisResult.matchingSkills.length === 0 && <span className="text-xs text-gray-500 dark:text-gray-400">None detected</span>}
                            </div>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/50">
                            <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 text-sm">Missing Skills</h4>
                             <div className="flex flex-wrap gap-2">
                                {analysisResult.missingSkills.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs rounded-full">{skill}</span>
                                ))}
                                {analysisResult.missingSkills.length === 0 && <span className="text-xs text-gray-500 dark:text-gray-400">None! Great fit.</span>}
                            </div>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;