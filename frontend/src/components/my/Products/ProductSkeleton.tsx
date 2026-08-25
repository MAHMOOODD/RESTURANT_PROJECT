export default function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-card/60 rounded-[2.5rem] border border-border p-5 space-y-5 animate-pulse flex flex-col justify-between shadow-sm"
        >
          <div className="h-56 bg-muted rounded-[2rem] w-full relative overflow-hidden">
            <div className="absolute bottom-4 right-4 h-7 w-20 bg-muted-foreground/20 rounded-2xl" />
          </div>

          <div className="space-y-3">
            <div className="h-5 bg-muted rounded-lg w-3/4" />
            <div className="h-3.5 bg-muted/80 rounded-lg w-full" />
            <div className="h-3.5 bg-muted/60 rounded-lg w-2/3" />
          </div>

          <div className="pt-4 border-t border-border/40 flex items-center justify-between">
            <div className="h-7 bg-muted rounded-lg w-1/3" />
            <div className="h-11 bg-muted rounded-2xl w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
