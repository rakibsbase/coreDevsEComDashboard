interface Props {
  rows?: number;
  className?: string;
}

export const LoadingSkeleton = ({ rows = 3, className = "" }: Props) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    ))}
  </div>
);
