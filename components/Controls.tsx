import React from 'react';
import { GenerationSettings } from '../types';
import { Briefcase, Coffee, Camera, User, Palette } from 'lucide-react';

interface ControlsProps {
  settings: GenerationSettings;
  onSettingsChange: (newSettings: GenerationSettings) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  disabled: boolean;
}

const CONTEXT_PRESETS = [
  { id: 'linkedin', label: 'LinkedIn', icon: Briefcase, clothes: 'Costume professionnel ou tailleur élégant', bg: 'Bureau moderne flou, tons neutres' },
  { id: 'twitter', label: 'Réseaux Sociaux', icon: User, clothes: 'Décontracté chic, t-shirt premium', bg: 'Urbain coloré, artistique' },
  { id: 'slack', label: 'Slack / Teams', icon: Coffee, clothes: 'Smart casual, chemise confortable', bg: 'Bureau à domicile bien rangé, plantes' },
  { id: 'artistic', label: 'Créatif', icon: Palette, clothes: 'Vêtements avant-garde, colorés', bg: 'Studio abstrait, éclairage néon' },
];

const Controls: React.FC<ControlsProps> = ({ 
  settings, 
  onSettingsChange, 
  isGenerating, 
  onGenerate,
  disabled 
}) => {
  
  const handlePresetClick = (preset: typeof CONTEXT_PRESETS[0]) => {
    onSettingsChange({
      ...settings,
      context: preset.label,
      clothes: preset.clothes,
      background: preset.bg,
    });
  };

  const handleChange = (field: keyof GenerationSettings, value: string) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-6">
      
      {/* Context Presets */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-3">Choisir un style prédéfini</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CONTEXT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl border transition-all
                ${settings.context === preset.label 
                  ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-lg shadow-blue-500/10' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                }
              `}
            >
              <preset.icon className="w-5 h-5 mb-2" />
              <span className="text-xs font-medium">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Tenue vestimentaire</label>
          <input
            type="text"
            value={settings.clothes}
            onChange={(e) => handleChange('clothes', e.target.value)}
            placeholder="Ex: Costume bleu marine, T-shirt blanc..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Arrière-plan</label>
          <input
            type="text"
            value={settings.background}
            onChange={(e) => handleChange('background', e.target.value)}
            placeholder="Ex: Mur de briques, Parc ensoleillé..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-2">
        <button
            onClick={onGenerate}
            disabled={disabled || isGenerating}
            className={`
            w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
            ${disabled || isGenerating
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]'
            }
            `}
        >
            {isGenerating ? (
            <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Génération en cours...
            </>
            ) : (
            <>
                <Camera className="w-5 h-5" />
                Générer ma photo
            </>
            )}
        </button>
        <p className="text-xs text-slate-500 mt-3 text-center">
            Propulsé par Gemini 2.5 Flash • Gratuit & Rapide
        </p>
      </div>
    </div>
  );
};

export default Controls;