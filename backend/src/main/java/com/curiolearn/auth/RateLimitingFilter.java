package com.curiolearn.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int AUTH_LIMIT_PER_MINUTE = 10;
    private static final int AI_LIMIT_PER_MINUTE = 30;

    private static class RequestWindow {
        final long windowStartEpochMinute;
        final AtomicInteger count;

        RequestWindow(long windowStartEpochMinute, int initialCount) {
            this.windowStartEpochMinute = windowStartEpochMinute;
            this.count = new AtomicInteger(initialCount);
        }
    }

    private final Map<String, RequestWindow> rateLimits = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        String clientIp = getClientIp(request);
        long currentEpochMinute = Instant.now().getEpochSecond() / 60;

        int limit = -1;
        String bucketKey = null;

        if (uri.startsWith("/api/v1/auth/login") && "POST".equalsIgnoreCase(request.getMethod())) {
            limit = AUTH_LIMIT_PER_MINUTE;
            bucketKey = "AUTH_" + clientIp;
        } else if (uri.startsWith("/api/v1/ai/") || uri.startsWith("/api/v1/tutor/")) {
            limit = AI_LIMIT_PER_MINUTE;
            bucketKey = "AI_" + clientIp;
        }

        if (limit > 0 && bucketKey != null) {
            RequestWindow window = rateLimits.compute(bucketKey, (k, existing) -> {
                if (existing == null || existing.windowStartEpochMinute != currentEpochMinute) {
                    return new RequestWindow(currentEpochMinute, 1);
                } else {
                    existing.count.incrementAndGet();
                    return existing;
                }
            });

            if (window.count.get() > limit) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setHeader("Retry-After", "60");
                response.getWriter().write("{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please wait 60 seconds before retrying.\"}");
                return;
            }
        }

        // Clean up old buckets periodically if map gets large
        if (rateLimits.size() > 5000) {
            rateLimits.entrySet().removeIf(entry -> entry.getValue().windowStartEpochMinute < currentEpochMinute - 2);
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
    }
}
