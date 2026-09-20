import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  Sentry.captureException(error);

  return (
    <div className="bg-dark-background-main flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <img
        src="/images/logoBig.svg"
        alt="Krypt Kard"
        className="mb-8 h-9 opacity-90"
      />

      <div className="border-dark-stroke-3 w-full max-w-md rounded-2xl border bg-white px-8 py-10 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="text-dark-error-300 size-8" />
          </div>

          <h1 className="text-primary-500 mb-2 text-2xl font-semibold">
            Something went wrong
          </h1>
          <p className="text-primary-50 mb-1 text-sm leading-5">
            We&apos;re sorry for the hiccup. Our team has been notified and
            we&apos;re working to fix it.
          </p>
          <p className="text-primary-50/70 mb-6 text-xs">
            Try refreshing the page or returning to the dashboard.
          </p>

          {import.meta.env.DEV && (
            <details className="bg-dark-grey-50 mb-6 w-full rounded-xl p-3 text-left text-xs">
              <summary className="text-primary-500 mb-2 cursor-pointer font-medium">
                Error Details (Dev Only)
              </summary>
              <pre className="text-primary-500/60 overflow-auto font-mono text-[10px] leading-4 whitespace-pre-wrap">
                {error.message}
                {"\n\n"}
                {error.stack}
              </pre>
            </details>
          )}

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              className="border-dark-stroke-3 text-primary-500 hover:bg-dark-grey-50 gap-2"
            >
              <RefreshCw className="size-4" />
              Try Again
            </Button>
            <Button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="gradient-button gap-2"
            >
              <Home className="size-4" />
              Go to Dashboard
            </Button>
          </div>

          <button
            onClick={() => window.history.back()}
            className="text-primary-50 hover:text-dark-primary-400 mt-4 flex items-center gap-1 text-xs transition-colors"
          >
            <ArrowLeft className="size-3" />
            Go back
          </button>
        </div>
      </div>

      <p className="text-primary-50/50 mt-6 text-xs">
        If this issue keeps happening, please contact support.
      </p>
    </div>
  );
};

export default ErrorFallback;
