# syntax=docker/dockerfile:1
FROM maven:3.9.13-eclipse-temurin-25-alpine AS build

WORKDIR /app

COPY pom.xml .

RUN --mount=type=cache,target=/root/.m2,sharing=locked \
    mvn -B -ntp dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2,sharing=locked \
    mvn -B -ntp package -Dmaven.test.skip=true

FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

RUN addgroup -S -g 10001 restaurant \
    && adduser -S -D -u 10001 -G restaurant restaurant \
    && apk add --no-cache tzdata wget \
    && mkdir -p /app/uploads \
    && chown restaurant:restaurant /app /app/uploads

ENV TZ=Asia/Ho_Chi_Minh \
    JAVA_TOOL_OPTIONS="-Xms128m -XX:MaxRAMPercentage=60.0"

COPY --from=build --chown=restaurant:restaurant /app/target/app.jar app.jar

USER restaurant

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=90s --retries=6 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/actuator/health/readiness || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
