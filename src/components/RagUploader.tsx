'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, CheckCircle2, Loader2 } from 'lucide-react';
import { RagContext } from '@/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface RagUploaderProps {
  onUploadSuccess: (context: RagContext) => void;
  onClear: () => void;
  currentContext: RagContext | null;
}

export const RagUploader: React.FC<RagUploaderProps> = ({ onUploadSuccess, onClear, currentContext }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setError(null);
    setProgress(0);
    const file = acceptedFiles[0];
    setIsUploading(true);

    const tick = setInterval(() => setProgress(p => Math.min(p + 12, 85)), 300);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/rag', { method: 'POST', body: formData });
      clearInterval(tick);
      if (!response.ok) throw new Error('Failed to parse PDF');
      setProgress(100);
      const data = await response.json();
      setTimeout(() => { setProgress(0); onUploadSuccess(data); }, 400);
    } catch {
      clearInterval(tick);
      setProgress(0);
      setError('Could not parse this PDF. Try a different file.');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isUploading,
  });

  if (currentContext) {
    return (
      <div className="flex items-center gap-3 p-3 bg-primary/8 border border-primary/20 rounded-xl">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
          <FileText size={15} className="text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground truncate">{currentContext.fileName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <CheckCircle2 size={10} className="text-primary" />
            <p className="text-[10px] font-semibold text-primary">Context injected</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
        >
          <X size={13} />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/60',
          isUploading && 'pointer-events-none opacity-70'
        )}
      >
        <input {...getInputProps()} />
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
          isDragActive ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-muted-foreground'
        )}>
          {isUploading
            ? <Loader2 size={18} className="animate-spin text-primary" />
            : <UploadCloud size={18} />
          }
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-foreground">
            {isUploading ? 'Parsing document…' : isDragActive ? 'Drop to inject context' : 'Attach PDF'}
          </p>
          {!isUploading && (
            <p className="text-[10px] text-muted-foreground mt-0.5">Drag & drop or click to browse</p>
          )}
        </div>
        {isUploading && progress > 0 && (
          <Progress value={progress} className="w-full h-1.5 mt-1" />
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="py-2.5 px-3 rounded-xl">
          <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
