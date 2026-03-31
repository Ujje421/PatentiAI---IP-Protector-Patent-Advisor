
import React, { useState } from 'react';

interface InventionFormProps {
  onSubmit: (desc: string) => void;
  isLoading: boolean;
}

const InventionForm: React.FC<InventionFormProps> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-2xl mx-auto">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Secure IP Analysis</h2>
        <p className="text-slate-500 mb-8">
          Describe your invention in detail. Include technical mechanisms, unique prediction models, 
          or algorithmic improvements. Our AI will analyze it for novelty and draft patent requirements.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Technical Description
            </label>
            <textarea
              required
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none text-slate-800"
              placeholder="Example: I have developed a new solar panel tracking algorithm that optimizes energy efficiency using AI prediction models. It uses real-time weather telemetry to adjust tilting angles every 15 minutes..."
            ></textarea>
          </div>

          <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <i className="fa-solid fa-shield-halved text-blue-600 mt-1"></i>
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase">Privacy Notice</p>
              <p className="text-[11px] text-blue-600">Your inputs are processed in an isolated session. Data is not used for training public models. All drafting follows professional confidentiality standards.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !description.trim()}
            className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition shadow-lg ${
              isLoading || !description.trim() ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <><i className="fa-solid fa-spinner animate-spin"></i> Processing...</>
            ) : (
              <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate IP Analysis & Search</>
            )}
          </button>
        </form>
      </div>
      <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-center gap-8">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <i className="fa-brands fa-usps text-lg"></i>
          <span>USPTO Compliant</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <i className="fa-solid fa-globe text-lg"></i>
          <span>WIPO/EPO Standards</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <i className="fa-solid fa-lock text-lg"></i>
          <span>AES-256 Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default InventionForm;
