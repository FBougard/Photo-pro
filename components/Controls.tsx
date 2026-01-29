import React, { useState, useEffect } from 'react';
import { GenerationSettings } from '../types';
import { Briefcase, Coffee, Camera, User, Palette, Scissors, Smile, Circle, Square, MonitorPlay } from 'lucide-react';

interface ControlsProps {
  settings: GenerationSettings;
  onSettingsChange: (newSettings: GenerationSettings) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  disabled: boolean;
}

const CONTEXT_PRESETS = [
  { 
    id: 'linkedin', 
    label: 'LinkedIn', 
    icon: Briefcase, 
    bg: 'Bureau moderne flou, tons neutres',
    outfits: ['Costume Bleu Marine', 'Chemise Blanche & Veston', 'Blazer Gris', 'Tailleur Professionnel']
  },
  { 
    id: 'social', 
    label: 'Social', 
    icon: User, 
    bg: 'Urbain coloré, flou artistique',
    outfits: ['T-shirt Premium', 'Veste en Cuir', 'Sweatshirt Stylé', 'Casual Chic']
  },
  { 
    id: 'startup', 
    label: 'Startup', 
    icon: Coffee, 
    bg: 'Espace de coworking, plantes',
    outfits: ['Polo Minimaliste', 'Chemise en Jean', 'T-shirt Tech', 'Pull Col Roulé']
  },
  { 
    id: 'creative', 
    label: 'Artistique', 
    icon: Palette, 
    bg: 'Fond studio texturé, éclairage néon',
    outfits: ['Vêtements Avant-garde', 'Couleurs Vives', 'Accessoires Mode', 'Noir Total']
  },
];

const FORMATS = [
  { id: 'round', label: 'Rond (LinkedIn)', icon: Circle },
  { id: 'square', label: 'Carré (Insta/CV)', icon: Square },
  { id: 'youtube', label: 'Miniature (16:9)', icon: MonitorPlay },
];

const Controls: React.FC<ControlsProps> = ({ 
  settings, 
  onSettingsChange, 
  isGenerating, 
  onGenerate,
  disabled 
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'appearance'>('style');
  const [customOutfit, setCustomOutfit] = useState(false);

  // Met à jour les presets quand le contexte change, sauf si l'utilisateur a entré un custom
  const currentPreset = CONTEXT_PRESETS.find(p => p.label === settings.context) || CONTEXT_PRESETS[0];

  useEffect(() => {
    // Initialiser avec des valeurs par défaut si vide
    if (!settings.context) {
      handlePresetClick(CONTEXT_PRESETS[0]);
    }
    if (!settings.format) {
      handleChange('format', 'round');
    }
  }, []);

  const handlePresetClick = (preset: typeof CONTEXT_PRESETS[0]) => {
    onSettingsChange({
      ...settings,
      context: preset.label,
      background: preset.bg,
      clothes: preset.outfits[0], // Par défaut la première tenue
    });
    setCustomOutfit(false);
  };

  const handleChange = (field: keyof GenerationSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-700 mb-4">
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'style' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Style & Format
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'appearance' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Apparence Physique
        </button>
      </div>

      {activeTab === 'style' && (
        <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
          
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Format de sortie</label>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => handleChange('format', fmt.id)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-xl border transition-all
                    ${settings.format === fmt.id 
                      ? 'bg-slate-700 border-slate-500 text-white shadow-md' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }
                  `}
                >
                  <fmt.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] sm:text-xs font-medium text-center">{fmt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-800 my-2"></div>

          {/* Context Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contexte</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

          {/* Outfit Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tenue</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {currentPreset.outfits.map((outfit) => (
                <button
                  key={outfit}
                  onClick={() => {
                    handleChange('clothes', outfit);
                    setCustomOutfit(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    !customOutfit && settings.clothes === outfit
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {outfit}
                </button>
              ))}
              <button
                onClick={() => setCustomOutfit(true)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  customOutfit
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                Autre...
              </button>
            </div>
            
            {customOutfit && (
              <input
                type="text"
                value={settings.clothes}
                onChange={(e) => handleChange('clothes', e.target.value)}
                placeholder="Décrivez la tenue souhaitée..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus
              />
            )}
          </div>

           {/* Background Input */}
           <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Arrière-plan</label>
            <input
              type="text"
              value={settings.background}
              onChange={(e) => handleChange('background', e.target.value)}
              placeholder="Ex: Mur de briques..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
           {/* Hairstyle */}
           <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
              <Scissors className="w-4 h-4 text-purple-400" /> Coiffure (Optionnel)
            </label>
            <input
              type="text"
              value={settings.hairstyle || ''}
              onChange={(e) => handleChange('hairstyle', e.target.value)}
              placeholder="Ex: Plus court, Cheveux blonds, Chignon..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-slate-600"
            />
          </div>

          {/* Beard */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
              <Smile className="w-4 h-4 text-purple-400" /> Barbe / Moustache (Optionnel)
            </label>
            <input
              type="text"
              value={settings.beard || ''}
              onChange={(e) => handleChange('beard', e.target.value)}
              placeholder="Ex: Barbe de 3 jours, Rasé de près..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-slate-600"
            />
          </div>

          {/* Enhancement Checkbox */}
          <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={settings.enhance || false}
                  onChange={(e) => handleChange('enhance', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-white">Amélioration IA</span>
                <span className="block text-xs text-slate-400">Corrige la symétrie du visage, lisse la peau et améliore l'éclairage.</span>
              </div>
            </label>
          </div>
        </div>
      )}

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
                Génération...
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