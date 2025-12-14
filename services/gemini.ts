import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCopy, GenerationSettings } from "../types";
import { mapAspectRatioToApi } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // We re-instantiate this on every call in the component to ensure we catch the fresh API key
    // But for structure, we keep the class. The component will handle the instantiation logic properly.
    const apiKey = process.env.API_KEY || ''; 
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateCreativeBrief(productName: string, productDescription: string, url: string): Promise<GeneratedCopy & { imagePrompt: string }> {
    const prompt = `
      You are an expert creative director for digital advertising.
      Product Name: ${productName}
      Description: ${productDescription}
      URL: ${url}

      Tasks:
      1. Create a catchy, short headline (max 30 characters).
      2. Create a compelling Call to Action (CTA) button text (max 15 characters).
      3. Write a 1-sentence description for the ad body (max 60 characters).
      4. Suggest a primary hex color code that fits the product vibe.
      5. Suggest a high-contrast text hex color code.
      6. Write a HIGHLY DETAILED, artistic image generation prompt for a background image that showcases the product or its benefits abstractly. 
         The image prompt should describe lighting, mood, composition, and style. 
         Do not include text in the image prompt itself, just the visual description.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            cta: { type: Type.STRING },
            description: { type: Type.STRING },
            primaryColor: { type: Type.STRING },
            textColor: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
          },
          required: ["headline", "cta", "description", "imagePrompt"]
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return json;
  }

  async generateAdImage(prompt: string, settings: GenerationSettings): Promise<string> {
    const validAspectRatio = mapAspectRatioToApi(settings.aspectRatio);

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: validAspectRatio,
          imageSize: settings.imageSize,
        },
      },
    });

    // Iterate to find the inline data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned from API");
  }
}
