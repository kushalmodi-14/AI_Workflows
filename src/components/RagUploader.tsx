'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, FileText, X, CheckCircle2, Loader2 } from 'lucide-react';
import { RagContext } from '@/types';

interface RagUploaderProps {
  onUploadSuccess: (context: RagContext) => void;
  onClear: () => void;
  currentContext: RagContext | null;
}

export const RagUploader: React.FC<RagUploaderProps> = ({ onUploadSuccess, onClear, currentContext }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to parse PDF');
      
      const data = await response.json();
      onUploadSuccess(data);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload and parse PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  if (currentContext) {
    return (
      <div className="flex items-center justify-between p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <CheckCircle2 size={16} className="text-indigo-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white line-clamp-1">{currentContext.fileName}</span>
            <span className="text-[10px] text-zinc-500">RAG Context Loaded</span>
          </div>
        </div>
        <button onClick={onClear} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()} 
      className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all ${isDragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}`}
    >
      <input {...getInputProps()} />
      <div className="flex items-center justify-center gap-3">
        {isUploading ? (
          <Loader2 size={20} className="text-indigo-500 animate-spin" />
        ) : (
          <FileUp size={20} className={isDragActive ? 'text-indigo-500' : 'text-zinc-600'} />
        )}
        <div className="flex flex-col">
          <p className="text-xs font-medium text-zinc-400">
            {isUploading ? 'Parsing context...' : isDragActive ? 'Drop context here' : 'Add Context (PDF)'}
          </p>
          {!isUploading && <p className="text-[10px] text-zinc-600">Drag & drop or click</p>}
        </div>
      </div>
    </div>
  );
};
