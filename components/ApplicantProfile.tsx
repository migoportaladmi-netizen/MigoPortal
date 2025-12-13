import React, { useState } from 'react';
import { User, Experience, Education, Achievement } from '../types';
import { ArrowLeft, Plus, Trash2, Save, User as UserIcon, Briefcase, GraduationCap, Award, Zap } from 'lucide-react';

interface ApplicantProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
}

const ApplicantProfile: React.FC<ApplicantProfileProps> = ({ user, onUpdateUser, onBack }) => {
  const [formData, setFormData] = useState<User>(user);
  
  // Local state for temporary inputs
  const [newSkill, setNewSkill] = useState('');
  
  // Section Toggle States for adding new items
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [isAddingAch, setIsAddingAch] = useState(false);

  // Temporary state for new items
  const [tempExp, setTempExp] = useState<Partial<Experience>>({});
  const [tempEdu, setTempEdu] = useState<Partial<Education>>({});
  const [tempAch, setTempAch] = useState<Partial<Achievement>>({});

  const handleSaveProfile = () => {
    onUpdateUser(formData);
    alert('Profile saved successfully!');
  };

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Skills Logic ---
  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      const currentSkills = formData.skills || [];
      if (!currentSkills.includes(newSkill.trim())) {
        setFormData(prev => ({ ...prev, skills: [...currentSkills, newSkill.trim()] }));
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skillToRemove)
    }));
  };

  // --- Experience Logic ---
  const addExperience = () => {
    if (tempExp.role && tempExp.company) {
      const newExp: Experience = {
        id: Date.now().toString(),
        role: tempExp.role,
        company: tempExp.company,
        duration: tempExp.duration || '',
        description: tempExp.description || ''
      };
      setFormData(prev => ({
        ...prev,
        experience: [newExp, ...(prev.experience || [])]
      }));
      setTempExp({});
      setIsAddingExp(false);
    }
  };

  const removeExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience?.filter(e => e.id !== id)
    }));
  };

  // --- Education Logic ---
  const addEducation = () => {
    if (tempEdu.degree && tempEdu.institution) {
      const newEdu: Education = {
        id: Date.now().toString(),
        degree: tempEdu.degree,
        institution: tempEdu.institution,
        year: tempEdu.year || ''
      };
      setFormData(prev => ({
        ...prev,
        education: [newEdu, ...(prev.education || [])]
      }));
      setTempEdu({});
      setIsAddingEdu(false);
    }
  };

  const removeEducation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.filter(e => e.id !== id)
    }));
  };

  // --- Achievement Logic ---
  const addAchievement = () => {
    if (tempAch.title) {
      const newAch: Achievement = {
        id: Date.now().toString(),
        title: tempAch.title,
        description: tempAch.description || '',
        date: tempAch.date || ''
      };
      setFormData(prev => ({
        ...prev,
        achievements: [newAch, ...(prev.achievements || [])]
      }));
      setTempAch({});
      setIsAddingAch(false);
    }
  };

  const removeAchievement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter(a => a.id !== id)
    }));
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex items-center justify-between mb-6">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium transition-colors"
        >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
        </button>
        <button 
            onClick={handleSaveProfile}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-colors"
        >
            <Save className="w-4 h-4" />
            Save Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Info & Skills */}
        <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                        {formData.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{formData.email}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Senior Software Engineer"
                            value={formData.headline || ''}
                            onChange={(e) => handleInputChange('headline', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Me</label>
                        <textarea 
                            rows={4}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            placeholder="Tell us about yourself..."
                            value={formData.bio || ''}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold text-lg">
                    <Zap className="w-5 h-5 text-indigo-500" />
                    Skills
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills?.map(skill => (
                        <div key={skill} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="hover:text-indigo-900 dark:hover:text-white"><Trash2 className="w-3 h-3" /></button>
                        </div>
                    ))}
                </div>
                <input 
                    type="text" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Type skill and press Enter..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={addSkill}
                />
            </div>
        </div>

        {/* Right Column: Experience, Education, Achievements */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        Experience
                    </div>
                    <button 
                        onClick={() => setIsAddingExp(!isAddingExp)}
                        className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {isAddingExp && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700 animate-fade-in space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                placeholder="Role Title" 
                                className="input-std p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={tempExp.role || ''} onChange={e => setTempExp({...tempExp, role: e.target.value})}
                            />
                            <input 
                                placeholder="Company" 
                                className="input-std p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={tempExp.company || ''} onChange={e => setTempExp({...tempExp, company: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <input 
                                placeholder="Duration (e.g. 2020 - 2022)" 
                                className="input-std p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={tempExp.duration || ''} onChange={e => setTempExp({...tempExp, duration: e.target.value})}
                            />
                        </div>
                        <textarea 
                            placeholder="Description" 
                            rows={2}
                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            value={tempExp.description || ''} onChange={e => setTempExp({...tempExp, description: e.target.value})}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAddingExp(false)} className="px-3 py-1 text-sm text-gray-500">Cancel</button>
                            <button onClick={addExperience} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Add</button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {formData.experience?.map((exp) => (
                        <div key={exp.id} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 group">
                             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-gray-800"></div>
                             <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{exp.company}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{exp.duration}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{exp.description}</p>
                                </div>
                                <button onClick={() => removeExperience(exp.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                        </div>
                    ))}
                    {(!formData.experience || formData.experience.length === 0) && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">No experience added yet.</p>
                    )}
                </div>
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
                        <GraduationCap className="w-5 h-5 text-indigo-500" />
                        Education
                    </div>
                    <button 
                        onClick={() => setIsAddingEdu(!isAddingEdu)}
                        className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                 {isAddingEdu && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700 animate-fade-in space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                placeholder="Degree" 
                                className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={tempEdu.degree || ''} onChange={e => setTempEdu({...tempEdu, degree: e.target.value})}
                            />
                             <input 
                                placeholder="Institution" 
                                className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={tempEdu.institution || ''} onChange={e => setTempEdu({...tempEdu, institution: e.target.value})}
                            />
                            <input 
                                placeholder="Year" 
                                className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                value={tempEdu.year || ''} onChange={e => setTempEdu({...tempEdu, year: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAddingEdu(false)} className="px-3 py-1 text-sm text-gray-500">Cancel</button>
                            <button onClick={addEducation} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Add</button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {formData.education?.map((edu) => (
                        <div key={edu.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group">
                             <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{edu.degree}</h3>
                                <p className="text-sm text-indigo-600 dark:text-indigo-400">{edu.institution}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{edu.year}</p>
                             </div>
                             <button onClick={() => removeEducation(edu.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                     {(!formData.education || formData.education.length === 0) && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">No education listed.</p>
                    )}
                </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
                        <Award className="w-5 h-5 text-indigo-500" />
                        Achievements
                    </div>
                    <button 
                        onClick={() => setIsAddingAch(!isAddingAch)}
                        className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {isAddingAch && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700 animate-fade-in space-y-3">
                        <input 
                            placeholder="Title / Award Name" 
                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            value={tempAch.title || ''} onChange={e => setTempAch({...tempAch, title: e.target.value})}
                        />
                         <input 
                            placeholder="Date" 
                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            value={tempAch.date || ''} onChange={e => setTempAch({...tempAch, date: e.target.value})}
                        />
                         <textarea 
                            placeholder="Description" 
                            rows={2}
                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            value={tempAch.description || ''} onChange={e => setTempAch({...tempAch, description: e.target.value})}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAddingAch(false)} className="px-3 py-1 text-sm text-gray-500">Cancel</button>
                            <button onClick={addAchievement} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Add</button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                     {formData.achievements?.map((ach) => (
                        <div key={ach.id} className="flex gap-4 p-3 group">
                             <div className="mt-1">
                                <Award className="w-5 h-5 text-yellow-500" />
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{ach.title}</h3>
                                    <button onClick={() => removeAchievement(ach.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{ach.date}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{ach.description}</p>
                             </div>
                        </div>
                    ))}
                     {(!formData.achievements || formData.achievements.length === 0) && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">No achievements added.</p>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;