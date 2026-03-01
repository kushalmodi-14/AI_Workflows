import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiModelId } from '@/types';

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
            temperature: 0.1,
            responseMimeType: 'application/json',
        },
    });
};
