import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Extract text from PDF using the correct async function
        const data = await pdf(buffer);

        return NextResponse.json({
            fileName: file.name,
            extractedText: data.text,
        });
    } catch (error: any) {
        console.error('Error parsing PDF:', error);
        return NextResponse.json({ error: 'Failed to parse PDF: ' + error.message }, { status: 500 });
    }
}
