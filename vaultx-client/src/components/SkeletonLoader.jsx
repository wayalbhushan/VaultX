export function SkeletonCard() {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-800 rounded w-1/3"></div>
        <div className="h-4 bg-slate-800 rounded w-12"></div>
      </div>
      <div className="h-4 bg-slate-800/60 rounded w-3/4"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 bg-slate-800/40 rounded w-1/4"></div>
        <div className="h-8 bg-slate-800/80 rounded w-16"></div>
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-24"></div>
        <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
      </div>
      <div className="h-8 bg-slate-800 rounded w-16"></div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800/60 animate-pulse">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-9 h-9 bg-slate-800 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
          <div className="h-3 bg-slate-800/60 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-6 bg-slate-800 rounded w-20"></div>
    </div>
  );
}
