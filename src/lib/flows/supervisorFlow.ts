import { getSupervisorModel } from '../gemini';
import { runSearchAgent, runCodeAgent, runSummarizeAgent } from '../agents';
import { GeminiModelId, AgentTraceStep, AgentType } from '@/types';

export const runSupervisorWorkflow = async (
    prompt: string,
    modelId: GeminiModelId,
    ragContext?: string
) => {
    const supervisor = getSupervisorModel(modelId);
    const trace: AgentTraceStep[] = [];

    const supervisorPrompt = `You are a Supervisor for a team of specialized AI agents.
  Based on the user prompt: "${prompt}", decide which agents should be called to provide the best response.
  
  Available agents:
  - "search": Use this if the prompt requires factual data, research, or information retrieval.
  - "code": Use this if the prompt involves coding, technical implementation, or architecture.
  - "summarize": Use this for polishing the final answer. (Usually always included).
  
  You MUST return your response as a JSON object with this format:
  {
    "selectedAgents": ["agent1", "agent2"],
    "plan": "Brief reasoning for your choices"
  }`;

    const result = await supervisor.generateContent(supervisorPrompt);
    const responseText = result.response.text();
    const routing = JSON.parse(responseText) as { selectedAgents: AgentType[]; plan: string };

    let currentContext = ragContext || '';

    for (const agentType of routing.selectedAgents) {
        let agentOutput;
        let agentReasoning;

        if (agentType === 'search') {
            const res = await runSearchAgent(prompt, modelId, currentContext);
            agentOutput = res.content;
            agentReasoning = res.reasoning;
        } else if (agentType === 'code') {
            const res = await runCodeAgent(prompt, modelId, currentContext);
            agentOutput = res.content;
            agentReasoning = res.reasoning;
        } else if (agentType === 'summarize') {
            const res = await runSummarizeAgent(prompt, modelId, currentContext);
            agentOutput = res.content;
            agentReasoning = res.reasoning;
        }

        if (agentOutput) {
            currentContext += `\n\n### Output from ${agentType}:\n${agentOutput}`;
            trace.push({
                agent: agentType as AgentType,
                output: agentOutput,
                reasoning: agentReasoning || `Supervisor selected this agent: ${routing.plan}`,
                timestamp: new Date().toISOString(),
            });
        }
    }

    const lastTrace = trace[trace.length - 1];
    const finalContent = lastTrace ? lastTrace.output : "No agents were selected by the supervisor to answer this.";

    return {
        content: finalContent,
        trace,
    };
};
