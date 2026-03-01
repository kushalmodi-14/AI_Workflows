import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiModelId } from '@/types';

// Client-side safety: In Next.js, we should use server-side for API calls.
// But we'll initialize it here to be used by our API routes.

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const getGeminiModel = (modelId: GeminiModelId = 'gemini-2.0-flash') => {
    return genAI.getGenerativeModel({
        model: modelId,
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
        },
    });
};

export const getSupervisorModel = (modelId: GeminiModelId = 'gemini-2.0-flash') => {
    return genAI.getGenerativeModel({
        model: modelId,
        generationConfig: {
            temperature: 0.1, // Lower temperature for more deterministic routing
            responseMimeType: 'application/json',
        },
    });
};
