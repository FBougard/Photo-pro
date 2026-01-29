import { GoogleGenAI, Type } from "@google/genai";
import { GenerationSettings, EvaluationResult } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key might be missing in env");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateProfilePicture = async (
  base64Image: string,
  settings: GenerationSettings
): Promise<string> => {
  const ai = getClient();
  
  // Détermination du ratio d'aspect
  // YouTube = 16:9, les autres (Carré, Rond) = 1:1
  const aspectRatio = settings.format === 'youtube' ? '16:9' : '1:1';

  // Construction d'un prompt plus détaillé avec les nouvelles options
  let prompt = `
    Edit this image to create a professional profile picture.
    
    Output Format: ${aspectRatio} aspect ratio.
    Target Context: ${settings.context}
    Target Outfit: ${settings.clothes}
    Target Background: ${settings.background}
    
    Physical Modifications:
    1. Keep the person's identity strictly recognizable.
  `;

  if (settings.hairstyle) {
    prompt += `\n2. Change hairstyle to: ${settings.hairstyle}.`;
  }
  if (settings.beard) {
    prompt += `\n3. Facial hair style: ${settings.beard}.`;
  }
  if (settings.enhance) {
    prompt += `\n4. IMPROVE FACE SYMMETRY, skin texture, and lighting for a high-end magazine look.`;
  }

  prompt += `
    \nGeneral Instructions:
    - Ensure perfect lighting (Rembrandt or Softbox).
    - High resolution, photorealistic, 8k.
    - Focus on the face and upper shoulders.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const evaluateProfile = async (base64Image: string): Promise<EvaluationResult> => {
  const ai = getClient();

  const prompt = `
    Analyze this profile picture for a professional context (LinkedIn, CV).
    Rate the "Professional Attractiveness" out of 10.
    Provide 3 pros, 3 cons, and a quick tip to improve.
    Return JSON only.
  `;

  // Définition manuelle du schéma de réponse attendu pour le JSON
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "Score out of 10" },
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      cons: { type: Type.ARRAY, items: { type: Type.STRING } },
      tips: { type: Type.STRING, description: "Actionable advice" }
    },
    required: ["score", "pros", "cons", "tips"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No analysis returned");
    
    return JSON.parse(text) as EvaluationResult;
  } catch (error) {
    console.error("Error evaluating image:", error);
    throw error;
  }
};