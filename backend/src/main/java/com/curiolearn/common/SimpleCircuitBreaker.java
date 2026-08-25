package com.curiolearn.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;

public class SimpleCircuitBreaker {

    private static final Logger log = LoggerFactory.getLogger(SimpleCircuitBreaker.class);

    public enum State {
        CLOSED, OPEN, HALF_OPEN
    }

    private final String name;
    private final int failureThreshold;
    private final long resetTimeoutMillis;
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private final AtomicReference<State> state = new AtomicReference<>(State.CLOSED);
    private volatile long lastStateChangeTimestamp = System.currentTimeMillis();

    public SimpleCircuitBreaker(String name, int failureThreshold, long resetTimeoutMillis) {
        this.name = name;
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMillis = resetTimeoutMillis;
    }

    public <T> T execute(Supplier<T> action, Supplier<T> fallback) {
        checkStateTransition();

        if (state.get() == State.OPEN) {
            log.warn("Circuit breaker '{}' is OPEN. Tripping directly to fallback.", name);
            return fallback.get();
        }

        try {
            T result = action.get();
            onSuccess();
            return result;
        } catch (Exception ex) {
            onError(ex);
            return fallback.get();
        }
    }

    private void onSuccess() {
        if (state.get() == State.HALF_OPEN) {
            log.info("Circuit breaker '{}' recovered. Transitioning HALF_OPEN -> CLOSED.", name);
            state.set(State.CLOSED);
        }
        failureCount.set(0);
    }

    private void onError(Exception ex) {
        int failures = failureCount.incrementAndGet();
        log.warn("Circuit breaker '{}' recorded failure #{}: {}", name, failures, ex.getMessage());

        if (failures >= failureThreshold || state.get() == State.HALF_OPEN) {
            log.error("Circuit breaker '{}' threshold exceeded ({}/{}). Transitioning to OPEN.", name, failures, failureThreshold);
            state.set(State.OPEN);
            lastStateChangeTimestamp = System.currentTimeMillis();
        }
    }

    private void checkStateTransition() {
        if (state.get() == State.OPEN) {
            long elapsed = System.currentTimeMillis() - lastStateChangeTimestamp;
            if (elapsed > resetTimeoutMillis) {
                log.info("Circuit breaker '{}' cooldown elapsed ({}ms). Transitioning OPEN -> HALF_OPEN.", name, elapsed);
                state.set(State.HALF_OPEN);
                lastStateChangeTimestamp = System.currentTimeMillis();
            }
        }
    }

    public State getState() {
        return state.get();
    }
}
