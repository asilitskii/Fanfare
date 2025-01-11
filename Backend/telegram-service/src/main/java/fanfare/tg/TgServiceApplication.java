package fanfare.tg;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(
        info = @Info(
                title = "Fanflow TG Store API",
                description = "API for managing a store linked to a blogger, tracking user engagement, and awarding " +
                              "FanfCoin. Token always valid, because api gateway proxy token through auth/validate",
                version = "1.0.0"
                ),

        servers = {@Server()}
)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT Authorization",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
@SpringBootApplication
public class TgServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TgServiceApplication.class, args);
    }
}
