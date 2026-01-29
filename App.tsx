import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import Controls from './components/Controls';
import { GenerationSettings, EvaluationResult } from './types';
import { generateProfilePicture, evaluateProfile } from './services/geminiService';
import { Sparkles, Download, RefreshCw, AlertCircle, Award, CheckCircle, XCircle, TrendingUp, BadgeCheck } from 'lucide-react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // New visual states
  const [bannerText, setBannerText] = useState<string>('');
  const [showBanner, setShowBanner] = useState(false);

  const [settings, setSettings] = useState<GenerationSettings>({
    context: '',
    clothes: '',
    background: '',
    format: 'round', // Default format
    enhance: true,
  });

  const handleImageUpload = (base64: string) => {
    setOriginalImage(base64);
    setGeneratedImage(null);
    setEvaluation(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsGenerating(true);
    setError(null);
    setEvaluation(null);

    try {
      const base64Data = originalImage.split(',')[1] || originalImage;
      
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

  const handleEvaluation = async () => {
    if (!generatedImage && !originalImage) return;
    
    // Evaluate the generated image if available, else original
    const imgToEval = generatedImage || originalImage;
    if(!imgToEval) return;

    setIsEvaluating(true);
    try {
       const base64Data = imgToEval.split(',')[1] || imgToEval;
       const result = await evaluateProfile(base64Data);
       setEvaluation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
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

  // Determine container shape classes
  const getContainerShape = () => {
    switch (settings.format) {
      case 'round': return 'rounded-full aspect-square';
      case 'youtube': return 'rounded-xl aspect-video'; // 16:9
      case 'square': 
      default: return 'rounded-3xl aspect-square';
    }
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
          <div className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded hidden sm:block">
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
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Result Area */}
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs">3</span>
                Résultat
              </h2>
              
              <div className={`relative w-full max-w-lg mx-auto bg-slate-900 border-4 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group transition-all duration-500 ${getContainerShape()}`}>
                
                {/* Loader Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 z-30 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-white">Transformation...</h3>
                    <p className="mt-2 text-slate-400 max-w-sm text-sm">
                      Format {settings.format} • {settings.context || 'Pro'}
                    </p>
                  </div>
                )}

                {/* Empty State */}
                {!generatedImage && !isGenerating && !originalImage && (
                  <div className="text-center p-8 text-slate-500">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 opacity-50" />
                    </div>
                    <p>Commencez par uploader une photo.</p>
                  </div>
                )}
                
                {/* Error State */}
                {error && (
                  <div className="absolute inset-0 z-10 bg-slate-900/90 flex flex-col items-center justify-center p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-red-300">{error}</p>
                  </div>
                )}

                {/* Result Image */}
                {generatedImage && (
                  <>
                    <img 
                      src={generatedImage} 
                      alt="Generated Profile" 
                      className="w-full h-full object-cover animate-in fade-in duration-700"
                    />
                    
                    {/* Banner Overlay */}
                    {showBanner && (
                      <div className="absolute inset-0 z-20 pointer-events-none">
                         {/* Circle Frame "Open to Work" style - Only for Round/Square */}
                         {settings.format !== 'youtube' && (
                             <div className={`absolute inset-0 border-[10px] sm:border-[16px] border-[#0a66c2] opacity-90 sm:border-0 ${settings.format === 'round' ? 'rounded-full' : 'rounded-3xl'}`}></div>
                         )}
                         
                         {/* Badge Placement */}
                         <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                            <div className="bg-[#0a66c2] text-white px-6 py-1 rounded-full font-bold shadow-lg transform translate-y-2">
                               {bannerText || '#OPENTOWORK'}
                            </div>
                         </div>

                         {/* Mobile circular text (Only for Round) */}
                         {settings.format === 'round' && (
                             <svg className="absolute w-full h-full sm:hidden" viewBox="0 0 100 100">
                                <path id="curve" d="M 10 50 A 40 40 0 0 0 90 50" fill="transparent" />
                                <text width="500" className="text-[14px] font-bold fill-[#0a66c2] uppercase tracking-wider">
                                <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                                    {bannerText || '#OPENTOWORK'}
                                </textPath>
                                </text>
                             </svg>
                         )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Post-Processing Tools */}
            {generatedImage && (
               <div className="glass-panel rounded-xl p-4 space-y-4 animate-in slide-in-from-bottom-4">
                  
                  {/* Banner Controls */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center border-b border-slate-700 pb-4">
                    <div className="flex items-center gap-2 flex-1">
                      <BadgeCheck className="text-blue-400 w-5 h-5" />
                      <span className="text-sm font-medium">Bandeau</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                       <input 
                          type="text" 
                          placeholder="#OPENTOWORK" 
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none flex-1"
                          value={bannerText}
                          onChange={(e) => setBannerText(e.target.value)}
                       />
                       <button 
                          onClick={() => setShowBanner(!showBanner)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${showBanner ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                       >
                          {showBanner ? 'Masquer' : 'Afficher'}
                       </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Régénérer
                    </button>
                    
                    <button 
                      onClick={handleEvaluation}
                      disabled={isEvaluating}
                      className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-all"
                    >
                       {isEvaluating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Award className="w-4 h-4" />}
                       Évaluer l'image
                    </button>

                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
               </div>
            )}

            {/* Evaluation Results */}
            {evaluation && (
               <div className="glass-panel rounded-xl p-6 border-l-4 border-purple-500 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                           <TrendingUp className="w-5 h-5 text-purple-400" />
                           Score d'attractivité
                        </h3>
                        <p className="text-sm text-slate-400">Analyse IA professionnelle</p>
                     </div>
                     <div className="text-3xl font-bold text-white bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/50">
                        {evaluation.score}/10
                     </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-1">
                           <CheckCircle className="w-4 h-4" /> Points Forts
                        </h4>
                        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                           {evaluation.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                        </ul>
                     </div>
                     <div>
                        <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1">
                           <XCircle className="w-4 h-4" /> Améliorations
                        </h4>
                        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                           {evaluation.cons.map((con, i) => <li key={i}>{con}</li>)}
                        </ul>
                     </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-700">
                     <p className="text-sm italic text-slate-400">
                        <span className="font-bold text-purple-400 not-italic">Conseil Pro: </span> 
                        {evaluation.tips}
                     </p>
                  </div>
               </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;