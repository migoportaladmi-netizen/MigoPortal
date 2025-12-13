import React from 'react';
import { Job } from '../types';
import { MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const tags = job.tags && job.tags.length > 0 ? job.tags : [job.department];
  const companyName = job.companyName || job.companyId;
  // Fallback logo generation using company name
  const logoUrl = job.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random`;

  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-indigo-100 dark:hover:border-indigo-900/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
            <img src={logoUrl} alt={companyName} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{companyName}</p>
          </div>
        </div>
        <span className="shrink-0 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full">
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4" />
          {job.salaryRange}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {job.postedDate}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default JobCard;