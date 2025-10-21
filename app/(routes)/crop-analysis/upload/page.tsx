"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload } from "lucide-react";
import AppHeader from "@/app/_components/AppHeader";
import { Stepper } from "./_components/Stepper";
import { CameraModal } from "./_components/CameraModal";
import { UploadZone } from "./_components/Uploadzone";
import { UploadedFilesList } from "./_components/UploadedFileList";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useRouter } from "next/navigation";

const UploadPage = () => {
  const t = useTranslations("crop-analysis.upload");
  const [showCamera, setShowCamera] = useState(false);
  const camera = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    uploadedFiles,
    isDragOver,
    uploadProgress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
    setUploadedFiles,
  } = useFileUpload();

  const handleCapture = async () => {
    // @ts-ignore
    const photoBlob = camera.current?.takePhoto();
    if (!photoBlob) return;

    // Convert Blob to File
    const file = new File([photoBlob], "captured_photo.jpg", { type: "image/jpeg" });

    // Generate preview URL
    const preview = URL.createObjectURL(file);

    setUploadedFiles((prev) => [
      ...prev,
      { file, type: "image", preview },
    ]);

    setShowCamera(false);
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type.includes("pdf") ? "pdf" : "image";
    const preview = URL.createObjectURL(file);

    setUploadedFiles((prev) => [...prev, { file, type, preview }]);
  };

  const saveFileToLocalStorage = async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Clear previous data and save new
        localStorage.removeItem("USER_SOIL_DATA");
        localStorage.setItem("USER_SOIL_DATA", base64);
        resolve(base64);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleClick = async () => {
    if (uploadedFiles.length === 0) return;

    const firstFile = uploadedFiles[0].file;

    if (!(firstFile instanceof File)) {
      console.error("Invalid file type, expected File instance");
      return;
    }

    try {
      await saveFileToLocalStorage(firstFile);
      router.push("/crop-analysis/questionnaire");
    } catch (err) {
      console.error("Error saving file to storage:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
      <AppHeader>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 flex justify-center">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {t("pageTitle")}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </AppHeader>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stepper Component */}
          <Stepper activeIndex={0} />

          {/* Camera Modal */}
          <CameraModal
            showCamera={showCamera}
            cameraRef={camera}
            uploadedFiles={uploadedFiles}
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
            onFileChange={handleImageCapture}
            fileInputRef={fileInputRef}
          />

          {/* Upload Card */}
          <Card className="mb-6 sm:mb-8 border-neutral-200 dark:border-neutral-700">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-xl sm:text-2xl text-neutral-900 dark:text-white">
                {t("card.title")}
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300">
                {t("card.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              {/* Upload Zone */}
              {uploadedFiles.length === 0 && (
                <UploadZone
                  isDragOver={isDragOver}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onFileSelect={handleFileSelect}
                  onCameraOpen={() => setShowCamera(true)}
                />
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4 sm:mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      {t("uploadProgress.uploading")}
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      {t("uploadProgress.percentage", {
                        percent: uploadProgress,
                      })}
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          <UploadedFilesList files={uploadedFiles} onRemove={removeFile} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("buttons.backToHome")}
              </Link>
            </Button>

            {uploadedFiles.length > 0 && (
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                onClick={handleClick}
              >
                {t("buttons.continueToQuestionnaire")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;