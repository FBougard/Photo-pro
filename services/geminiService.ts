import { GoogleGenAI } from "@google/genai";
import { GenerationSettings } from "../types";

// For Gemini 2.5 Flash, we use the standard API key from the environment.
// No special billing selection is required.
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
  
  // Construct a prompt that guides the model to edit the image while preserving identity.
  const prompt = `
    Edit this image to create a professional profile picture.
    Context: ${settings.context}.
    
    Instructions:
    1. Keep the person's face and identity exactly as is.
    2. Change clothing to: ${settings.clothes}.
    3. Change background to: ${settings.background}.
    4. Improve lighting to be professional.
    5. Photorealistic style.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
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
          aspectRatio: "1:1",
        },
      },
    });

    // Extract image from response
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