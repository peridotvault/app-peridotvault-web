import { Button } from "./Button";

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title, message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-destructive/10 border border-destructive rounded-lg p-8 text-center">
      <p className="text-destructive font-semibold text-lg">{title}</p>
      <p className="text-sm text-muted-foreground mt-2">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button onClick={onRetry}>Retry</Button>
        </div>
      )}
    </div>
  );
}
