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

  /* ── ACTIVE CONTEXT STATE ── */
  if (currentContext) {
    return (
      <div className="relative flex items-center gap-3 p-3.5 rounded-2xl overflow-hidden group">
        {/* Glowing background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-teal-500/8 to-transparent rounded-2xl border border-cyan-500/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />

        {/* File icon */}
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-900/40">
          <FileText size={16} className="text-white" />
        </div>

        {/* File info */}
        <div className="relative flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{currentContext.fileName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <CheckCircle2 size={10} className="text-cyan-400" />
            <p className="text-[10px] font-semibold text-cyan-400">Context injected</p>
          </div>
        </div>

        {/* Remove button */}
        <button
          onClick={onClear}
          className="relative flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/25 transition-all duration-200"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden group',
          isDragActive
            ? 'border-violet-500/70 bg-violet-500/8 scale-[1.02] shadow-lg shadow-violet-900/20'
            : 'border-white/[0.09] bg-white/[0.02] hover:border-violet-500/40 hover:bg-white/[0.04] hover:shadow-md hover:shadow-violet-900/10',
          isUploading && 'pointer-events-none opacity-60'
        )}
      >
        {/* drag state radial glow */}
        {isDragActive && (
          <div className="absolute inset-0 bg-radial-gradient from-violet-500/10 to-transparent pointer-events-none" />
        )}

        <input {...getInputProps()} />

        <div className={cn(
          'w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300',
          isDragActive
            ? 'bg-gradient-to-br from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-900/50 scale-110'
            : isUploading
              ? 'bg-violet-500/15 text-violet-400 border border-violet-500/25'
              : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] group-hover:bg-violet-500/10 group-hover:text-violet-400 group-hover:border-violet-500/25'
        )}>
          {isUploading
            ? <Loader2 size={18} className="animate-spin" />
            : <UploadCloud size={18} className={cn(isDragActive && 'animate-bounce')} />
          }
        </div>

        <div className="text-center">
          <p className={cn(
            'text-xs font-bold transition-colors duration-200',
            isDragActive ? 'text-violet-300' : 'text-slate-300'
          )}>
            {isUploading ? 'Parsing document…' : isDragActive ? 'Drop to inject context' : 'Attach PDF Context'}
          </p>
          {!isUploading && (
            <p className="text-[10px] text-slate-600 mt-1">
              {isDragActive ? 'Release to upload' : 'Drag & drop or click to browse'}
            </p>
          )}
        </div>

        {isUploading && progress > 0 && (
          <div className="w-full space-y-1">
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-center text-slate-600 font-medium">{progress}%</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/8 border border-rose-500/20">
          <div className="w-4 h-4 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <X size={9} className="text-rose-400" />
          </div>
          <p className="text-xs font-medium text-rose-400/90 leading-relaxed">{error}</p>
        </div>
      )}
    </div>
  );
};