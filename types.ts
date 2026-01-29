export interface GenerationSettings {
  clothes: string;
  background: string;
  context: string;
}

export interface GeneratedImage {
  url: string;
  timestamp: number;
}