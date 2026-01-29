export interface GenerationSettings {
  context: string;
  clothes: string;
  background: string;
  format: 'square' | 'round' | 'youtube';
  hairstyle?: string;
  beard?: string;
  enhance?: boolean;
  targetMB?: number; // Poids cible en MB (0 pour max/original)
}

export interface EvaluationResult {
  score: number;
  pros: string[];
  cons: string[];
  tips: string;
}

export interface GeneratedImage {
  url: string;
  timestamp: number;
}