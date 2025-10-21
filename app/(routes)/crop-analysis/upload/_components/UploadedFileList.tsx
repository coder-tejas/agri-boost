// components/UploadedFilesList.tsx
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, FileText, X } from "lucide-react";

interface UploadedFile {
  file: File;
  type: "pdf" | "image";
  preview?: string;
}

interface UploadedFilesListProps {
  files: UploadedFile[];
  onRemove: (index: number) => void;
}

export const UploadedFilesList = ({
  files,
  onRemove,
}: UploadedFilesListProps) => {
  const t = useTranslations("crop-analysis.upload");

  if (files.length === 0) return null;

  return (
    <Card className="mb-6 sm:mb-8 border-neutral-200 dark:border-neutral-700">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="flex items-center text-base sm:text-lg text-neutral-900 dark:text-white">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success mr-2 flex-shrink-0" />
          <span className="break-words">
            {t("uploadedFiles.title", { count: files.length })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {files.map((item, index) => (
            <div
              key={index}
              className="relative group bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              {item.type === "image" && item.preview ? (
                <div className="aspect-video relative">
                  <img    //TODO : its not working ....... fix it
                    src={item.preview}
                    alt={item.file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemove(index)}
                      className="rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {t("uploadedFiles.fileSize", {
                          size: (item.file.size / 1024 / 1024).toFixed(2),
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {item.type === "image" && (
                <div className="px-3 py-2 bg-white/50 dark:bg-black/30">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                    {item.file.name}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};