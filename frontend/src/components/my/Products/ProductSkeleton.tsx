export default function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-card/60 rounded-3xl border border-border/60 p-4 space-y-4 animate-pulse flex flex-col justify-between"
        >
          <div className="h-48 bg-muted rounded-2xl w-full relative overflow-hidden">
            <div className="absolute bottom-3 right-3 h-6 w-16 bg-muted-foreground/20 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-md w-3/4" />
            <div className="h-3 bg-muted/80 rounded-md w-full" />
            <div className="h-3 bg-muted/60 rounded-md w-2/3" />
          </div>

          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
            <div className="h-6 bg-muted rounded-md w-1/3" />
            <div className="h-9 bg-muted rounded-xl w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
