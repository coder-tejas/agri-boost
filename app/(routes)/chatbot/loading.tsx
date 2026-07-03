import { Skeleton } from "@/components/ui/skeleton";

export default function ChatbotLoading() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="p-2 shadow-sm flex items-center justify-between">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-16 w-16 rounded-xl mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    </div>
  );
}
