import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageUpload: (base64: string) => void;
}

// Increased limit based on user feedback
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validation de la taille
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`L'image est trop volumineuse (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum autorisé : ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }

      setError(null); // Reset error
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  return (
    <div className="w-full space-y-2">
      <label 
        className={`
          relative flex flex-col items-center justify-center w-full h-64 sm:h-80 
          border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
          ${error 
            ? 'border-red-500/50 bg-red-500/10' 
            : currentImage 
              ? 'border-blue-500/50 bg-slate-800/50' 
              : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800/50 bg-slate-900/50'
          }
        `}
      >
        {currentImage && !error ? (
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
            <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${error ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-blue-400'}`}>
              {error ? <AlertCircle className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
            </div>
            <p className="mb-2 text-lg font-semibold text-slate-200">
              {error ? "Fichier refusé" : "Cliquez pour uploader votre photo"}
            </p>
            <p className="text-sm text-slate-400">
              JPG, PNG (Max {MAX_FILE_SIZE_MB} MB)
            </p>
            {error && (
              <p className="mt-2 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                {error}
              </p>
            )}
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