import { Skeleton } from "@/components/ui/skeleton";

export default function CropAnalysisLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
