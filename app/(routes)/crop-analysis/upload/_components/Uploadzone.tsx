// components/UploadZone.tsx
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";

interface UploadZoneProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraOpen: () => void;
}

export const UploadZone = ({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onCameraOpen,
}: UploadZoneProps) => {
  const t = useTranslations("crop-analysis.upload");

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {/* Camera Capture */}
        <button
          onClick={onCameraOpen}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all"
        >
          <Camera className="w-12 h-12 text-primary-600 dark:text-primary-400 mb-3" />
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
            {t("camera.title")}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
            {t("camera.subtitle")}
          </p>
        </button>
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 md:p-12 text-center transition-all duration-300 ${
          isDragOver
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10 scale-105"
            : "border-neutral-300 dark:border-neutral-600 hover:border-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Upload className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-neutral-400 dark:text-neutral-500 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-neutral-900 dark:text-white px-2">
          {t("dropzone.title")}
        </h3>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-6 px-2">
          {t("dropzone.subtitle")}
        </p>
        <input
          type="file"
          accept=".pdf,image/*"
          multiple
          onChange={onFileSelect}
          className="hidden"
          id="file-input"
        />
        <Button
          size="lg"
          asChild
          className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white w-full sm:w-auto"
        >
          <label htmlFor="file-input" className="cursor-pointer">
            {t("dropzone.browseButton")}
          </label>
        </Button>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-3 sm:mt-4 px-2">
          {t("dropzone.supportedFormats")}
        </p>
      </div>
    </>
  );
};