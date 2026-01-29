export interface GenerationSettings {
  context: string;
  clothes: string;
  background: string;
  format: 'square' | 'round' | 'youtube'; // Nouveau champ
  hairstyle?: string;
  beard?: string;
  enhance?: boolean; // Pour la symétrie et la qualité
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