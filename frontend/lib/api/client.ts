/**
 * Central API client for the Spring Boot backend.
 *
 * Every call to the backend should go through this module (or a
 * feature-specific wrapper in lib/api/*) rather than hardcoding
 * `http://localhost:8085` fetch calls in components. This is what makes
 * NEXT_PUBLIC_API_URL a single source of truth for environment config,
 * and gives us one place to attach auth headers, handle timeouts, and
 * normalize errors.
 */

const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api/v1"
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/api/v1");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

interface RequestOptions extends RequestInit {
  /** Attach the bearer token from localStorage if present. Default true. */
  authenticated?: boolean;
  /** Abort the request after this many ms. Default 8000. */
  timeoutMs?: number;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { authenticated = true, timeoutMs = 8000, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (authenticated) {
    const token = getToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      signal: controller.signal,
    });

    // Gap 7.1: If 401 Unauthorized, attempt refresh token exchange once and retry
    if (res.status === 401 && authenticated && typeof window !== "undefined" && !path.startsWith("/auth/")) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            if (data && data.token) {
              localStorage.setItem("token", data.token);
              finalHeaders["Authorization"] = `Bearer ${data.token}`;
              res = await fetch(`${API_BASE_URL}${path}`, {
                ...rest,
                headers: finalHeaders,
                signal: controller.signal,
              });
            }
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
          }
        } catch {
          // Ignore refresh error and proceed to throw ApiError below
        }
      }
    }

    if (!res.ok) {
      throw new ApiError(`Request to ${path} failed with status ${res.status}`, res.status);
    }

    // Some endpoints (e.g. 204 No Content) have no body.
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
  } finally {
    clearTimeout(timeout);
  }
}


export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
