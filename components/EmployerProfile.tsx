import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeft, Save, Building2, MapPin, Globe, Users, Database, Heart, Trash2, Plus } from 'lucide-react';

interface EmployerProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
}

const EmployerProfile: React.FC<EmployerProfileProps> = ({ user, onUpdateUser, onBack }) => {
  const [formData, setFormData] = useState<User>(user);
  const [newTech, setNewTech] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const handleSaveProfile = () => {
    onUpdateUser(formData);
    alert('Company Profile saved successfully!');
  };

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Tech Stack Logic (Mapped to skills) ---
  const addTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTech.trim()) {
      e.preventDefault();
      const currentStack = formData.skills || [];
      if (!currentStack.includes(newTech.trim())) {
        setFormData(prev => ({ ...prev, skills: [...currentStack, newTech.trim()] }));
      }
      setNewTech('');
    }
  };

  const removeTech = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== techToRemove)
    }));
  };

  // --- Benefits Logic ---
  const addBenefit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newBenefit.trim()) {
      e.preventDefault();
      const currentBenefits = formData.benefits || [];
      if (!currentBenefits.includes(newBenefit.trim())) {
        setFormData(prev => ({ ...prev, benefits: [...currentBenefits, newBenefit.trim()] }));
      }
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits?.filter(b => b !== benefitToRemove)
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
        
        {/* Left Column: Core Info */}
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                        <Building2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">{formData.company || formData.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{formData.industry || 'Industry not set'}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.company || ''}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HR/Admin Name</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                         <div className="relative">
                            <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="https://example.com"
                                value={formData.website || ''}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                            />
                         </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Details</h3>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Fintech"
                            value={formData.industry || ''}
                            onChange={(e) => handleInputChange('industry', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Size</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <select 
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.companySize || ''}
                                onChange={(e) => handleInputChange('companySize', e.target.value)}
                            >
                                <option value="">Select size</option>
                                <option value="1-10">1-10 Employees</option>
                                <option value="11-50">11-50 Employees</option>
                                <option value="50-200">50-200 Employees</option>
                                <option value="200-500">200-500 Employees</option>
                                <option value="500+">500+ Employees</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headquarters</label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. San Francisco, CA"
                                value={formData.location || ''}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                            />
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: About, Tech Stack, Benefits */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">About the Company</h3>
                <textarea 
                    rows={6}
                    className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Describe your company culture, mission, and what makes it a great place to work..."
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                />
            </div>

            {/* Tech Stack */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold text-lg">
                    <Database className="w-5 h-5 text-indigo-500" />
                    Tech Stack
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">What technologies does your team use?</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills?.map(tech => (
                        <div key={tech} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                            {tech}
                            <button onClick={() => removeTech(tech)} className="hover:text-indigo-900 dark:hover:text-white"><Trash2 className="w-3 h-3" /></button>
                        </div>
                    ))}
                </div>
                <input 
                    type="text" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Type technology (e.g. React) and press Enter..."
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={addTech}
                />
            </div>

             {/* Benefits */}
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold text-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                    Benefits & Perks
                </div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add benefits like Health Insurance, Remote Work, etc.</p>
                
                <div className="space-y-3 mb-4">
                    {formData.benefits?.map(benefit => (
                         <div key={benefit} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group">
                             <span className="text-gray-700 dark:text-gray-200 text-sm">{benefit}</span>
                             <button onClick={() => removeBenefit(benefit)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                     {(!formData.benefits || formData.benefits.length === 0) && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">No benefits listed yet.</p>
                    )}
                </div>

                <div className="flex gap-2">
                     <input 
                        type="text" 
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Type benefit and press Enter..."
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        onKeyDown={addBenefit}
                    />
                    <button 
                        onClick={() => {
                            if(newBenefit.trim()) {
                                 const currentBenefits = formData.benefits || [];
                                 if (!currentBenefits.includes(newBenefit.trim())) {
                                    setFormData(prev => ({ ...prev, benefits: [...currentBenefits, newBenefit.trim()] }));
                                 }
                                 setNewBenefit('');
                            }
                        }}
                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;