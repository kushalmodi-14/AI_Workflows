import { runSearchAgent, runCodeAgent, runSummarizeAgent } from '../agents';
import { GeminiModelId, AgentTraceStep } from '@/types';

export const runSequentialWorkflow = async (
    prompt: string,
    modelId: GeminiModelId,
    ragContext?: string
) => {
    const trace: AgentTraceStep[] = [];

    // Step 1: Search Agent
    const searchResult = await runSearchAgent(prompt, modelId, ragContext);
    trace.push({
        agent: 'search',
        output: searchResult.content,
        reasoning: searchResult.reasoning,
        timestamp: new Date().toISOString(),
    });

    // Step 2: Code Agent
    const codeResult = await runCodeAgent(prompt, modelId, searchResult.content);
    trace.push({
        agent: 'code',
        output: codeResult.content,
        reasoning: codeResult.reasoning,
        timestamp: new Date().toISOString(),
    });

    // Step 3: Summarize Agent
    const finalResult = await runSummarizeAgent(prompt, modelId, `${searchResult.content}\n\n${codeResult.content}`);
    trace.push({
        agent: 'summarize',
        output: finalResult.content,
        reasoning: finalResult.reasoning,
        timestamp: new Date().toISOString(),
    });

    return {
        content: finalResult.content,
        trace,
    };
};
