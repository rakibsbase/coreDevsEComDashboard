import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** Base animated skeleton block — use to compose page skeletons */
export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-zinc-800/80 ${className}`}
    />
  );
}
