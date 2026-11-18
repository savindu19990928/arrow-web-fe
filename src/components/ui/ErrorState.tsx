import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';

export function ErrorState({ message, onRetry }: {message: string;onRetry?: () => void;}) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-surface px-6 py-14 text-center">
      <AlertTriangleIcon className="h-7 w-7 text-sale" aria-hidden="true" />
      <p className="max-w-md text-sm text-ink-700">{message}</p>
      {onRetry &&
      <button type="button" onClick={onRetry} className="btn-outline">
          Try again
        </button>
      }
    </div>);

}