import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faFile, faTimes } from "@fortawesome/free-solid-svg-icons";

interface CompactFileInputProps {
  label?: string;
  accept?: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  helperText?: string;
  required?: boolean;
}

export function CompactFileInput({
  label,
  accept,
  file,
  onFileSelect,
  helperText,
  required = false,
}: CompactFileInputProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    onFileSelect(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div>
      {label && (
        <label className="text-sm font-medium text-foreground mb-2 block">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50 hover:bg-muted/30"
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <FontAwesomeIcon icon={faUpload} className="text-2xl text-muted-foreground mb-2" />
          <p className="text-sm text-foreground font-medium">
            {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
          </p>
          {helperText && (
            <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
          )}
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faFile} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
