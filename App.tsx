import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import Controls from './components/Controls';
import { GenerationSettings } from './types';
import { generateProfilePicture } from './services/geminiService';
import { Sparkles, Download, RefreshCw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<GenerationSettings>({
    context: '',
    clothes: '',
    background: '',
  });

  const handleImageUpload = (base64: string) => {
    setOriginalImage(base64);
    setGeneratedImage(null); // Reset result when new image uploaded
    setError(null);
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Strip data URL prefix to get raw base64
      const base64Data = originalImage.split(',')[1] || originalImage;
      
      // Default fallback settings if empty
      const effectiveSettings = {
        ...settings,
        clothes: settings.clothes || 'Business casual attire',
        background: settings.background || 'Professional blurred background',
        context: settings.context || 'Professional'
      };

      const resultUrl = await generateProfilePicture(base64Data, effectiveSettings);
      setGeneratedImage(resultUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de la génération. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `context-cam-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ContextCam
            </span>
          </div>
          <div className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">
            Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Upload & Controls */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs">1</span>
                Votre Photo
              </h2>
              <ImageUploader 
                currentImage={originalImage} 
                onImageUpload={handleImageUpload} 
              />
            </section>

            <section className="space-y-4">
               <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs">2</span>
                Personnalisation
              </h2>
              <div className="glass-panel p-6 rounded-2xl">
                <Controls 
                  settings={settings} 
                  onSettingsChange={setSettings} 
                  isGenerating={isGenerating}
                  onGenerate={handleGenerate}
                  disabled={!originalImage}
                />
              </div>
            </section>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs">3</span>
              Résultat
            </h2>
            
            <div className="relative w-full aspect-square bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
              
              {isGenerating && (
                <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-white">Création de votre profil...</h3>
                  <p className="mt-2 text-slate-400 max-w-sm">
                    L'IA analyse votre photo, ajuste la tenue "{settings.clothes || 'professionnelle'}" 
                    et prépare l'environnement "{settings.background || 'adapté'}".
                  </p>
                </div>
              )}

              {!generatedImage && !isGenerating && !originalImage && (
                <div className="text-center p-8 text-slate-500">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Commencez par uploader une photo pour voir la magie opérer.</p>
                </div>
              )}

              {!generatedImage && !isGenerating && originalImage && !error && (
                <div className="text-center p-8 text-slate-400">
                  <p>Configurez vos préférences et cliquez sur "Générer".</p>
                </div>
              )}
              
               {error && (
                <div className="absolute inset-0 z-10 bg-slate-900/90 flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Erreur</h3>
                  <p className="text-red-300">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {generatedImage && (
                <img 
                  src={generatedImage} 
                  alt="Generated Profile" 
                  className="w-full h-full object-cover animate-in fade-in duration-700"
                />
              )}
            </div>

            {generatedImage && (
              <div className="mt-6 flex gap-4 justify-center">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Régénérer
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;