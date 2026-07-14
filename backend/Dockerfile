## build stage ##
FROM maven:3.9.13-eclipse-temurin-25-alpine AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests

## run stage ##
FROM eclipse-temurin:25-jre-alpine

RUN adduser -D restaurant
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh

COPY --from=build /app/target/*.jar /run/app.jar

RUN chown restaurant:restaurant /run/app.jar
USER restaurant

EXPOSE 8080

ENV JAVA_TOOL_OPTIONS="-Xmx1024m -Xms256m"
ENTRYPOINT ["java", "-jar", "/run/app.jar"]
