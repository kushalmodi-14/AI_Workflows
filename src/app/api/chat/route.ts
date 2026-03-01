import { NextRequest, NextResponse } from 'next/server';
import { runSequentialWorkflow } from '@/lib/flows/sequentialFlow';
import { runSupervisorWorkflow } from '@/lib/flows/supervisorFlow';
import { FlowMode, GeminiModelId } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const { message, model, flowMode, ragContext } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'No message provided' }, { status: 400 });
        }

        let result;

        if (flowMode === 'supervisor') {
            result = await runSupervisorWorkflow(message, model as GeminiModelId, ragContext);
        } else {
            result = await runSequentialWorkflow(message, model as GeminiModelId, ragContext);
        }

        return NextResponse.json({
            role: 'assistant',
            content: result.content,
            agentTrace: result.trace,
            model: model,
            flowMode: flowMode,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Workflow execution failed: ' + error.message }, { status: 500 });
    }
}
