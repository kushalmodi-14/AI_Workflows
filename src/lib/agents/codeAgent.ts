import { getGeminiModel } from '../gemini';
import { GeminiModelId } from '@/types';

export const runCodeAgent = async (
    prompt: string,
    modelId: GeminiModelId,
    previousContext?: string
) => {
    const model = getGeminiModel(modelId);
    const systemPrompt = `You are a Code Agent. Your role is to provide technical implementation details, algorithms, and code snippets.
  You take the user's request and any previous context and turn it into working code or architectural blueprints.
  
  Always include code blocks where appropriate.
  
  PREVIOUS CONTEXT (if any):
  ${previousContext || 'None provided.'}`;

    const result = await model.generateContent([
        { text: systemPrompt },
        { text: `QUERY: ${prompt}` }
    ]);

    return {
        content: result.response.text(),
        reasoning: 'Generated technical implementation and code blocks.',
    };
};
