interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="error-message">
      <p>{message}</p>

      {onRetry && (
        <button onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;