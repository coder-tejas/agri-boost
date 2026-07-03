import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-2 shadow-sm flex items-center justify-between">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-screen h-screen rounded-xl border p-6 space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-3/4 rounded-lg" />
          <Skeleton className="h-24 w-5/6 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
