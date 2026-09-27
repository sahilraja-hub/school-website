import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';

export interface FileUploadProps {
  label?: string;
  helperText?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  helperText = 'PDF, PNG, JPG up to 10MB',
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSizeMB = 10,
  multiple = false,
  onFilesSelected,
  className = '',
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];
    Array.from(files).forEach((file) => {
      if (file.size <= maxSizeMB * 1024 * 1024) {
        validFiles.push(file);
      }
    });

    const updated = multiple ? [...selectedFiles, ...validFiles] : validFiles;
    setSelectedFiles(updated);
    if (onFilesSelected) onFilesSelected(updated);
  };

  const handleRemoveFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    if (onFilesSelected) onFilesSelected(updated);
  };

  return (
    <div className={`space-y-2 text-left ${className}`}>
      {label && <span className="block text-xs font-semibold text-slate-700">{label}</span>}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileChange(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 ${
          isDragging
            ? 'border-crest-600 bg-crest-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-crest-500 hover:bg-slate-50/80 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          className="sr-only"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-crest-50 text-crest-600 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-semibold text-crest-700 hover:underline">
              Click to upload
            </span>{' '}
            <span className="text-xs sm:text-sm text-slate-500">or drag and drop</span>
          </div>
          <p className="text-xs text-slate-400">{helperText}</p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2 pt-1">
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <File className="w-4 h-4 text-crest-600 shrink-0" />
                <span className="font-medium text-slate-800 truncate">{file.name}</span>
                <span className="text-slate-400 shrink-0">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(idx);
                }}
                className="text-slate-400 hover:text-danger-600 p-1 rounded-md transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
