import React, { useState, useEffect } from 'react';
import { Key, ExternalLink, Loader2 } from 'lucide-react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    try {
      const win = window as any;
      if (win.aistudio && await win.aistudio.hasSelectedApiKey()) {
        onKeySelected();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  const handleSelectKey = async () => {
    try {
      const win = window as any;
      if (win.aistudio) {
        await win.aistudio.openSelectKey();
        // Assume success if no error thrown, proceed immediately as per instructions
        onKeySelected();
      }
    } catch (error) {
      console.error("Key selection failed or cancelled", error);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6">
      <div className="glass-panel max-w-md w-full p-8 rounded-2xl shadow-2xl text-center border border-slate-700">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Key className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Configuration requise</h1>
        <p className="text-slate-300 mb-8 leading-relaxed">
          Pour utiliser le modèle haute définition <strong>Nano Banana Pro</strong> (Gemini 3 Pro Image), vous devez sélectionner une clé API associée à un projet Google Cloud facturable.
        </p>
        
        <button
          onClick={handleSelectKey}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg mb-6 flex items-center justify-center gap-2"
        >
          <Key className="w-5 h-5" />
          Sélectionner ma clé API
        </button>

        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-blue-400 flex items-center justify-center gap-1 transition-colors"
        >
          En savoir plus sur la facturation <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default ApiKeySelector;