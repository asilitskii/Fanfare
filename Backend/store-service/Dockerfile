FROM maven:latest
WORKDIR /app

COPY . /app

RUN mvn clean install -DskipTests

EXPOSE 8000

CMD ["mvn", "spring-boot:run"]
