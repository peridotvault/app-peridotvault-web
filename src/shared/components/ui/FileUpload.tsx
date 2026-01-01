"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  currentPreview?: string;
  label?: string;
  helperText?: string;
  error?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  currentPreview,
  label,
  helperText,
  error,
  aspectRatio = "landscape",
}) => {
  const [preview, setPreview] = useState<string | undefined>(currentPreview);
  const [dragError, setDragError] = useState<string>("");

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-video",
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setDragError("");

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setDragError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setDragError("Invalid file type");
        } else {
          setDragError("Failed to upload file");
        }
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onFileSelect(file);
      }
    },
    [maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const handleRemove = () => {
    setPreview(undefined);
    onFileRemove?.();
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          <span className="text-destructive ml-1">*</span>
        </label>
      )}

      {preview ? (
        <div className="relative">
          <div className={`w-full rounded-lg overflow-hidden border-2 border-border ${aspectClasses[aspectRatio]}`}>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-destructive text-white rounded-full p-2 hover:bg-destructive/80 transition shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            ${aspectClasses[aspectRatio]}
            border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center
            cursor-pointer transition-all duration-200
            ${
              isDragActive
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50 hover:bg-muted/40"
            }
            ${error || dragError ? "border-destructive" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-center p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-sm">
              <span className="font-medium text-foreground">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-muted-foreground">PNG, JPG, GIF up to {maxSize / 1024 / 1024}MB</div>
          </div>
        </div>
      )}

      {helperText && !error && !dragError && <p className="text-xs text-muted-foreground">{helperText}</p>}

      {(error || dragError) && <p className="text-xs text-destructive">{error || dragError}</p>}
    </div>
  );
};
