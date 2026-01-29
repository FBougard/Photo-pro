import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageUpload: (base64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpload }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip prefix if necessary, but Gemini mostly handles data URIs or raw base64 depending on how we send it.
        // For inlineData, we need just the base64 part usually.
        // But for display we need the prefix.
        // Let's keep the full data URI for state, and strip it before sending to API.
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  return (
    <div className="w-full">
      <label 
        className={`
          relative flex flex-col items-center justify-center w-full h-64 sm:h-80 
          border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
          ${currentImage 
            ? 'border-blue-500/50 bg-slate-800/50' 
            : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800/50 bg-slate-900/50'
          }
        `}
      >
        {currentImage ? (
          <div className="relative w-full h-full p-2">
            <img 
              src={currentImage} 
              alt="Uploaded preview" 
              className="w-full h-full object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
              <span className="text-white font-medium flex items-center gap-2">
                <Upload className="w-5 h-5" /> Changer l'image
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="mb-2 text-lg font-semibold text-slate-200">
              Cliquez pour uploader votre photo
            </p>
            <p className="text-sm text-slate-400">
              Ou glissez-déposez ici (JPG, PNG)
            </p>
          </div>
        )}
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
