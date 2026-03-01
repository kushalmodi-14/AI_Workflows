import { getGeminiModel } from '../gemini';
import { GeminiModelId } from '@/types';

export const runSearchAgent = async (
    prompt: string,
    modelId: GeminiModelId,
    ragContext?: string
) => {
    const model = getGeminiModel(modelId);
    const systemPrompt = `You are a Search Agent. Your role is to gather factual information, data, and context related to the user's query. 
  Focus on providing research-backed details, statistics, and objective facts.
  If RAG context is provided, prioritize information from it.
  
  Format your response clearly. Use bullet points for facts.
  
  RAG CONTEXT (if any):
  ${ragContext || 'None provided.'}`;

    const result = await model.generateContent([
        { text: systemPrompt },
        { text: `QUERY: ${prompt}` }
    ]);

    return {
        content: result.response.text(),
        reasoning: 'Gathered factual context and research details.',
    };
};
