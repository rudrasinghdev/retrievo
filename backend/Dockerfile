# Multi-stage Docker build for Spring Boot with Java 25
FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app

# Copy all backend source files & Maven wrapper
COPY . .
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Minimal production runtime image
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/target/retrievo-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
