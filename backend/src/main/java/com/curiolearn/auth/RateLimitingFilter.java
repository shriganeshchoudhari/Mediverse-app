package com.curiolearn.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    private static final int AUTH_LIMIT_PER_MINUTE = 10;
    private static final int AI_LIMIT_PER_MINUTE = 30;
    private static final Pattern IPV4_PATTERN = Pattern.compile("^([0-9]{1,3}\\.){3}[0-9]{1,3}$");

    private final StringRedisTemplate redisTemplate;

    private static class RequestWindow {
        final long windowStartEpochMinute;
        final AtomicInteger count;

        RequestWindow(long windowStartEpochMinute, int initialCount) {
            this.windowStartEpochMinute = windowStartEpochMinute;
            this.count = new AtomicInteger(initialCount);
        }
    }

    private final Map<String, RequestWindow> fallbackRateLimits = new ConcurrentHashMap<>();

    public RateLimitingFilter(@Autowired(required = false) StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        String clientIp = getClientIp(request);
        long currentEpochMinute = Instant.now().getEpochSecond() / 60;

        int limit = -1;
        String bucketPrefix = null;

        if (uri.startsWith("/api/v1/auth/login") && "POST".equalsIgnoreCase(request.getMethod())) {
            limit = AUTH_LIMIT_PER_MINUTE;
            bucketPrefix = "AUTH";
        } else if (uri.startsWith("/api/v1/ai/") || uri.startsWith("/api/v1/tutor/")) {
            limit = AI_LIMIT_PER_MINUTE;
            bucketPrefix = "AI";
        }

        if (limit > 0 && bucketPrefix != null) {
            boolean rateExceeded = isRateExceeded(bucketPrefix, clientIp, currentEpochMinute, limit);

            if (rateExceeded) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setHeader("Retry-After", "60");
                response.getWriter().write("{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please wait 60 seconds before retrying.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateExceeded(String bucketPrefix, String clientIp, long currentEpochMinute, int limit) {
        if (redisTemplate != null) {
            try {
                String redisKey = "ratelimit:" + bucketPrefix + ":" + clientIp + ":" + currentEpochMinute;
                Long count = redisTemplate.opsForValue().increment(redisKey);
                if (count != null && count == 1) {
                    redisTemplate.expire(redisKey, Duration.ofSeconds(120));
                }
                return count != null && count > limit;
            } catch (Exception e) {
                log.warn("Redis rate limit check failed, falling back to memory window: {}", e.getMessage());
            }
        }

        // Fallback to in-memory window
        String bucketKey = bucketPrefix + "_" + clientIp;
        RequestWindow window = fallbackRateLimits.compute(bucketKey, (k, existing) -> {
            if (existing == null || existing.windowStartEpochMinute != currentEpochMinute) {
                return new RequestWindow(currentEpochMinute, 1);
            } else {
                existing.count.incrementAndGet();
                return existing;
            }
        });

        if (fallbackRateLimits.size() > 5000) {
            fallbackRateLimits.entrySet().removeIf(entry -> entry.getValue().windowStartEpochMinute < currentEpochMinute - 2);
        }

        return window.count.get() > limit;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            String candidate = xForwardedFor.split(",")[0].trim();
            if (IPV4_PATTERN.matcher(candidate).matches() || candidate.contains(":")) {
                return candidate;
            }
        }
        String remoteAddr = request.getRemoteAddr();
        return (remoteAddr != null && !remoteAddr.isEmpty()) ? remoteAddr : "127.0.0.1";
    }
}

