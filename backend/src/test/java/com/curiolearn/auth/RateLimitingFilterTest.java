package com.curiolearn.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.io.PrintWriter;
import java.io.StringWriter;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RateLimitingFilterTest {

    private RateLimitingFilter rateLimitingFilter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @BeforeEach
    void setUp() {
        rateLimitingFilter = new RateLimitingFilter(null);
    }

    @Test
    @DisplayName("TC-SEC-RATE-001: Allows requests below the rate limit")
    void testRateLimit_BelowLimit_Passes() throws Exception {
        when(request.getRequestURI()).thenReturn("/api/v1/auth/login");
        when(request.getMethod()).thenReturn("POST");
        when(request.getRemoteAddr()).thenReturn("192.168.1.100");

        rateLimitingFilter.doFilter(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
        verify(response, never()).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    }

    @Test
    @DisplayName("TC-SEC-RATE-002: Rejects requests exceeding the rate limit with 429 Too Many Requests")
    void testRateLimit_ExceededLimit_Returns429() throws Exception {
        when(request.getRequestURI()).thenReturn("/api/v1/auth/login");
        when(request.getMethod()).thenReturn("POST");
        when(request.getRemoteAddr()).thenReturn("192.168.1.101");
        StringWriter stringWriter = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(stringWriter));

        for (int i = 0; i < 11; i++) {
            rateLimitingFilter.doFilter(request, response, filterChain);
        }

        verify(response, atLeastOnce()).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    }

    @Test
    @DisplayName("TC-SEC-RATE-003: Unthrottled public endpoints pass freely without rate limiting")
    void testRateLimit_PublicEndpoint_PassesFreely() throws Exception {
        when(request.getRequestURI()).thenReturn("/api/v1/curriculum/subjects");
        when(request.getRemoteAddr()).thenReturn("192.168.1.102");

        for (int i = 0; i < 50; i++) {
            rateLimitingFilter.doFilter(request, response, filterChain);
        }

        verify(filterChain, times(50)).doFilter(request, response);
        verify(response, never()).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    }
}

