import CyberLoader from "./CyberLoader";

export function SkeletonCard() {
  return (
    <div className="bg-slate-900/80 border border-emerald-500/20 p-5 rounded-none animate-pulse space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded-none w-1/3" />
        <div className="w-8 h-8 bg-slate-800 rounded-none" />
      </div>
      <div className="h-8 bg-slate-800 rounded-none w-1/4" />
      <div className="h-3 bg-slate-800 rounded-none w-1/2" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-none animate-pulse space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-slate-800 rounded-none w-2/5" />
        <div className="w-7 h-7 bg-slate-800 rounded-none" />
      </div>
      <div className="h-7 bg-slate-800 rounded-none w-1/3" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-none animate-pulse flex items-center justify-between font-mono">
      <div className="space-y-2 w-1/3">
        <div className="h-4 bg-slate-800 rounded-none w-full" />
        <div className="h-3 bg-slate-800/60 rounded-none w-2/3" />
      </div>
      <div className="h-6 bg-slate-800 rounded-none w-16" />
    </div>
  );
}

export default CyberLoader;
