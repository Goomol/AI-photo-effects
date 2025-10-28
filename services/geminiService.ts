
import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedImage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// FIX: Correct model name based on guidelines
const model = 'gemini-2.5-flash-image';

export const generateImage = async (prompt: string, images: UploadedImage[]): Promise<string> => {
  try {
    const imageParts = images.map(image => ({
        inlineData: {
            data: image.base64,
            mimeType: image.mimeType,
        },
    }));

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          ...imageParts,
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Check for safety blocks first
    // FIX: Access promptFeedback correctly
    if (response.promptFeedback?.blockReason) {
      console.warn(`Request blocked due to: ${response.promptFeedback.blockReason}`);
      throw new Error('SAFETY_BLOCK');
    }

    // Find the generated image data
    // FIX: Correctly access candidates and parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data; // Success
        }
    }

    // If loop completes without returning, no image was found
    console.warn('API response received, but no image data was found.');
    throw new Error('NO_IMAGE_GENERATED');

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        // Forward our specific error codes
        if (['SAFETY_BLOCK', 'NO_IMAGE_GENERATED'].includes(error.message)) {
            throw error;
        }
        // Otherwise, it's a generic API error
        throw new Error('API_ERROR');
    }
    // Fallback for non-Error objects being thrown
    throw new Error('UNKNOWN_ERROR');
  }
};
