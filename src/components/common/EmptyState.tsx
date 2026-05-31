import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Icon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
    <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">{title}</p>
    {description && <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{description}</p>}
    {action}
  </div>
);
