# ================================================================
# Multi-stage Dockerfile for Spring Java Mastery
# Stage 1: Build with Maven
# Stage 2: Run with lightweight JRE
# ================================================================

# ── Stage 1: Build ───────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

# Copy source and build
COPY src/ src/
RUN mvn clean package -DskipTests -B -q

# ── Stage 2: Runtime ─────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Copy the built JAR
COPY --from=builder /app/target/*.jar app.jar
RUN chown spring:spring app.jar

USER spring

# Render exposes the PORT env variable (default 10000)
EXPOSE 10000

# Health check — waits 2min for seeding to complete
HEALTHCHECK --interval=30s --timeout=15s --retries=5 --start-period=180s \
  CMD wget -qO- http://localhost:${PORT:-10000}/actuator/health | grep -q '"status":"UP"' || exit 1

# JVM tuned for Render free tier (512MB RAM)
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=70.0", \
  "-XX:InitialRAMPercentage=25.0", \
  "-XX:+UseSerialGC", \
  "-XX:MaxMetaspaceSize=120m", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
