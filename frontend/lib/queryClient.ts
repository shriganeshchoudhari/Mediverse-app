import { QueryClient } from "@tanstack/react-query";

/**
 * Singleton QueryClient shared across the application.
 * Configured with enterprise defaults:
 *   - staleTime: 60s - prevents aggressive refetching
 *   - retry: 2 on server errors, never on client (4xx) errors
 *   - refetchOnWindowFocus: false - avoids excessive background fetches
 */
let queryClientInstance: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          retry: (failureCount, error: unknown) => {
            if (
              error &&
              typeof error === "object" &&
              "status" in error &&
              typeof (error as { status: number }).status === "number" &&
              (error as { status: number }).status < 500
            ) {
              return false;
            }
            return failureCount < 2;
          },
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 0,
        },
      },
    });
  }
  return queryClientInstance;
}
