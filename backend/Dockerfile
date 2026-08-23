# Stage 1: Build JAR using Gradle
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
RUN ./gradlew dependencies --no-daemon || true
COPY src ./src
RUN ./gradlew bootJar --no-daemon -x test

# Stage 2: Minimal Runtime Image
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 spring && adduser --system --uid 1001 --ingroup spring spring
COPY --from=builder /app/build/libs/*.jar app.jar
RUN chown spring:spring /app/app.jar
USER spring
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
