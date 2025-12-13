import React, { useState } from 'react';
import { User, Job } from '../types';
import { ArrowLeft, Bot, Sparkles, Building2, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { generateJobDescription } from '../services/geminiService';

interface PostJobProps {
  user: User;
  onPost: (job: Job) => void;
  onBack: () => void;
}

const PostJob: React.FC<PostJobProps> = ({ user, onPost, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Full-time' as const,
    salary: '',
    description: '',
    requirements: '',
    responsibilities: '',
    tags: ''
  });

  const handleGenerateAI = async () => {
    if (!formData.title || !formData.location) {
      alert("Please enter a Job Title and Location first.");
      return;
    }
    setLoading(true);
    try {
      const companyName = user.company || user.companyId || 'Our Company';
      const result = await generateJobDescription(formData.title, companyName, formData.location);
      setFormData(prev => ({
        ...prev,
        description: result.description,
        requirements: result.requirements.join('\n'),
        responsibilities: result.responsibilities.join('\n')
      }));
    } catch (e) {
      alert("Failed to generate description.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const companyName = user.company || 'Unknown Corp';
    
    const newJob: Job = {
      id: Date.now().toString(),
      companyId: user.companyId || 'comp_123',
      companyName: companyName,
      logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random`,
      postedDate: new Date().toISOString().split('T')[0],
      title: formData.title,
      location: formData.location,
      type: formData.type,
      salaryRange: formData.salary,
      description: formData.description,
      status: 'Open',
      department: 'General', // Defaulting for now
      requirements: formData.requirements.split('\n').filter(s => s.trim()),
      responsibilities: formData.responsibilities.split('\n').filter(s => s.trim()),
      tags: formData.tags.split(',').map(s => s.trim()).filter(s => s)
    };
    onPost(newJob);
  };

  return (
    <div className="animate-fade-in pb-10 max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Cancel & Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-600 rounded-lg text-white">
                <Building2 className="w-6 h-6" />
            </div>
            <div>
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post a New Job</h1>
                 <p className="text-gray-500 dark:text-gray-400 text-sm">Create a job listing for {user.company || user.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Senior Product Manager" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  required
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. New York, NY (Hybrid)" 
                />
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Range</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  required
                  type="text" 
                  value={formData.salary}
                  onChange={e => setFormData({...formData, salary: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. $120k - $150k" 
                />
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employment Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
                <option value="Working Student">Working Student</option>
              </select>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900 dark:text-white">Gemini AI Assistant</p>
                <p className="text-gray-500 dark:text-gray-400">Auto-fill description and requirements based on title.</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleGenerateAI}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Generating...' : <><Bot className="w-4 h-4" /> Auto-Generate</>}
            </button>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description</label>
             <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                placeholder="Describe the role..."
             ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Requirements (One per line)</label>
               <textarea 
                  required
                  rows={4}
                  value={formData.requirements}
                  onChange={e => setFormData({...formData, requirements: e.target.value})}
                  className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="- 5+ years React exp..."
               ></textarea>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsibilities (One per line)</label>
               <textarea 
                  required
                  rows={4}
                  value={formData.responsibilities}
                  onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                  className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="- Lead the frontend team..."
               ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (Comma separated)</label>
            <input 
              type="text" 
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="React, TypeScript, Remote" 
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
             <button type="button" onClick={onBack} className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
               Cancel
             </button>
             <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-colors">
               Post Job
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;