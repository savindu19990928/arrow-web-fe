import React from "react";
import { BoxIcon } from "lucide-react";
interface EmptyStateProps {
  icon: BoxIcon;
  title: string;
  text?: string;
  action?: React.ReactNode;
}
export function EmptyState({
  icon: Icon,
  title,
  text,
  action
}: EmptyStateProps) {
  return <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-surface px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {text && <p className="max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>;
}