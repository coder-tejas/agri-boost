"use client";
import { useState, useCallback } from "react";
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
import { ArrowLeft, Upload, FileText, X, CheckCircle } from "lucide-react";
import AppHeader from "@/app/_components/AppHeader";

// Simple stepper for progress indication
const Stepper = ({ activeIndex }: { activeIndex: number }) => {
  const t = useTranslations("crop-analysis.upload.stepper");
  const steps = [
    { label: t("step1") },
    { label: t("step2") },
    { label: t("step3") },
  ];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, idx) => (
          <div
            key={step.label}
            className={`flex items-center space-x-2 ${
              idx > activeIndex ? "opacity-50" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                idx === activeIndex
                  ? "bg-gradient-to-br from-primary-500 to-secondary-600 text-white"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`font-semibold ${
                idx === activeIndex
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <Progress
        value={((activeIndex + 1) / steps.length) * 100}
        className="h-2"
      />
    </div>
  );
};

const UploadPage = () => {
  const t = useTranslations("crop-analysis.upload");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handlers for drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files]);
      simulateUpload();
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(
        (file) => file.type === "application/pdf"
      );
      if (files.length > 0) {
        setUploadedFiles((prev) => [...prev, ...files]);
        simulateUpload();
      }
    },
    []
  );

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

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header, navigation, branding */}
      <AppHeader>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 flex justify-center">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {t("pageTitle")}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </AppHeader>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stepper Component */}
          <Stepper activeIndex={0} />

          {/* Upload Card */}
          <Card className="mb-8 border-neutral-200 dark:border-neutral-700">
            <CardHeader>
              <CardTitle className="text-2xl text-neutral-900 dark:text-white">
                {t("card.title")}
              </CardTitle>
              <CardDescription className="text-lg text-neutral-600 dark:text-neutral-300">
                {t("card.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                  isDragOver
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10 scale-105"
                    : "border-neutral-300 dark:border-neutral-600 hover:border-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                  {t("dropzone.title")}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  {t("dropzone.subtitle")}
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white"
                >
                  <label htmlFor="file-input" className="cursor-pointer">
                    {t("dropzone.browseButton")}
                  </label>
                </Button>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                  {t("dropzone.supportedFormats")}
                </p>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {t("uploadProgress.uploading")}
                    </span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {t("uploadProgress.percentage", { percent: uploadProgress })}
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card className="mb-8 border-neutral-200 dark:border-neutral-700">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-900 dark:text-white">
                  <CheckCircle className="w-5 h-5 text-success mr-2" />
                  {t("uploadedFiles.title", { count: uploadedFiles.length })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {file.name}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t("uploadedFiles.fileSize", { size: (file.size / 1024 / 1024).toFixed(2)  })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <Button variant="ghost" size="lg" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("buttons.backToHome")}
            </Link>
          </Button>
          {/* Next Step Button */}
          {uploadedFiles.length > 0 && (
            <div className="flex justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/crop-analysis/questionnaire">
                  {t("buttons.continueToQuestionnaire")}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;