// components/CameraModal.tsx
import { RefObject } from "react";
import { Camera as CameraLens } from "react-camera-pro";
import { Button } from "@/components/ui/button";

interface CameraProps {
  errorMessages?: {
    noCameraAccessible?: string;
    permissionDenied?: string;
    switchCamera?: string;
    canvas?: string;
  };
}

interface UploadedFile {
  file: File;
  type: "pdf" | "image";
  preview?: string;
}

interface CameraModalProps {
  showCamera: boolean;
  cameraRef: RefObject<CameraProps | null>;
  uploadedFiles: UploadedFile[];
  onCapture: () => void;
  onClose: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}
const CameraErrors: CameraProps["errorMessages"] = {
  noCameraAccessible:
    "No camera device accessible. Please connect your camera or try a different browser.",
  permissionDenied:
    "Permission denied. Please refresh and give camera permission.",
  switchCamera:
    "It is not possible to switch camera to different one because there is only one video device accessible.",
  canvas: "Canvas is not supported.",
};
export const CameraModal = ({
  showCamera,
  cameraRef,
  uploadedFiles,
  onCapture,
  onClose,
  onFileChange,
  fileInputRef,
}: CameraModalProps) => {
  if (!showCamera) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        <CameraLens
          ref={cameraRef}
          aspectRatio={16 / 9}
          errorMessages={CameraErrors}
        />
        <input
          type="file"
          accept="image/*,application/pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={onFileChange}
        />

        {uploadedFiles.map((item, i) => (
          <div key={i}>
            {item.type === "image" ? (
              <img src={item.preview} alt={`preview-${i}`} width={150} />
            ) : (
              <p>{item.file.name} (PDF)</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        <Button size="lg" onClick={onCapture} variant="default">
          Capture
        </Button>
        <Button size="lg" onClick={onClose} variant="destructive">
          Close
        </Button>
      </div>
    </div>
  );
};
