import { getGeminiModel } from '../gemini';
import { GeminiModelId } from '@/types';

export const runSummarizeAgent = async (
    prompt: string,
    modelId: GeminiModelId,
    previousContext?: string
) => {
    const model = getGeminiModel(modelId);
    const systemPrompt = `You are a Summarize Agent. Your role is to synthesize all previous information into a final, polished, and user-friendly response.
  Ensure the tone is helpful and the layout is easy to read.
  
  If there is code, include it but wrap it with a concise explanation.
  
  PREVIOUS CONTEXT (if any):
  ${previousContext || 'None provided.'}`;

    const result = await model.generateContent([
        { text: systemPrompt },
        { text: `QUERY: ${prompt}` }
    ]);

    return {
        content: result.response.text(),
        reasoning: 'Synthesized previous agent outputs into a final polished response.',
    };
};
