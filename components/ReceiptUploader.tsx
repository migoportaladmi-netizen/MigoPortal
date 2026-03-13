import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ReceiptAnalysisResult, ExpenseCategory } from '../types';

interface ReceiptUploaderProps {
  onAnalysisComplete: (data: ReceiptAnalysisResult, imageUrl: string) => void;
}

const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setIsAnalyzing(true);
      setError(null);

      try {
        // Receipt analysis — AI integration removed; prompts manual entry
        const analysis = await (async (): Promise<any> => ({
          merchant: 'Manual Entry Required',
          amount: 0,
          currency: 'USD',
          date: new Date().toISOString().split('T')[0],
          category: 'Other',
          description: 'Please enter receipt details manually.',
          confidence: 0,
          taxDeductibility: 'No',
          taxReasoning: 'Enter details manually.'
        }))();
        onAnalysisComplete(analysis, base64String);
      } catch (err) {
        setError("Failed to analyze receipt. Please try again or enter manually.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => fileInputRef.current?.click();

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div
        onClick={!isAnalyzing ? triggerUpload : undefined}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isAnalyzing ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
        `}
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
            <p className="text-indigo-800 dark:text-indigo-300 font-medium">Analyzing your receipt...</p>
            <p className="text-indigo-500 dark:text-indigo-400 text-sm mt-1">Extracting merchant, date, and amount.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center group">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Scan Smart Receipt</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs mx-auto">
              Upload an image. Our AI will automatically extract the details for you.
            </p>
            {error && (
              <div className="mt-4 flex items-center text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg border border-red-100 dark:border-red-900">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUploader;