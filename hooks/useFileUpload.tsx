// hooks/useFileUpload.ts
import { useState, useCallback } from "react";

interface UploadedFile {
  file: File;
  type: "pdf" | "image";
  preview?: string;
}

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const processFiles = useCallback((files: File[]) => {
    const processedFiles = files.map((file) => {
      const type = file.type === "application/pdf" ? "pdf" : "image";
      const preview = type === "image" ? URL.createObjectURL(file) : undefined;
      return { file, type, preview } as UploadedFile;
    });
    setUploadedFiles((prev) => [...prev, ...processedFiles]);
    simulateUpload();
  }, []);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === "application/pdf" || file.type.startsWith("image/")
      );
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(
        (file) =>
          file.type === "application/pdf" || file.type.startsWith("image/")
      );
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev[index];
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  return {
    uploadedFiles,
    isDragOver,
    uploadProgress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
    setUploadedFiles,
  };
};