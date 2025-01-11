FROM openjdk:21 AS base
WORKDIR /app

FROM gradle:8.11-jdk21-alpine AS build
WORKDIR /build
COPY . .
RUN gradle build --no-daemon


FROM base AS final
WORKDIR /app
COPY --from=build /build/build/libs/app.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
