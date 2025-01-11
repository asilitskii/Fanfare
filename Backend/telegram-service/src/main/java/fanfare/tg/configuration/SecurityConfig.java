package fanfare.tg.configuration;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import static org.springframework.security.config.http.SessionCreationPolicy.*;

@Component
@EnableWebSecurity
@EnableMethodSecurity
@Log
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SecurityConfig {
    private final TokenRequestFilter tokenRequestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(manager -> manager.sessionCreationPolicy(ALWAYS))
                .authenticationManager(authenticationManager -> authenticationManager)
                .addFilterAfter(tokenRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
