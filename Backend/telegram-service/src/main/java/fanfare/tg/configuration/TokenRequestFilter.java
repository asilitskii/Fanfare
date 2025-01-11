package fanfare.tg.configuration;

import com.google.gson.Gson;
import fanfare.tg.api.TokenPayload;
import fanfare.tg.exceptions.InvalidTokenException;
import fanfare.tg.exceptions.MissingTokenException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.java.Log;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Base64;

@Component
@Log
public class TokenRequestFilter extends GenericFilterBean{

    static final String TOKEN_HEADER = "Authorization";
    static final String TOKEN_PREFIX = "Bearer ";

    static final RequestMatcher matcherGetInfo = new AntPathRequestMatcher("/tg/activity/{store_id}");

    static final RequestMatcher matcherAfterGetInfo = new AntPathRequestMatcher("/tg/activity/{store_id}/*");

    static final RequestMatcher matcherActivity = new AntPathRequestMatcher("/tg/activity/**");

    static final RequestMatcher matcherActivitySubscriber = new AntPathRequestMatcher("/tg/activity/subscriptions");


    private final HandlerExceptionResolver exceptionResolver;

    public TokenRequestFilter(@Qualifier("handlerExceptionResolver") HandlerExceptionResolver exceptionResolver) {
        this.exceptionResolver = exceptionResolver;
    }

    private void doFilterInternal( HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (!matcherActivity.matches(request) ||
                (matcherGetInfo.matches(request) &&
                        !matcherAfterGetInfo.matches(request) &&
                        ! matcherActivitySubscriber.matches(request))) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader(TOKEN_HEADER);

        if (StringUtils.isEmpty(authHeader)) {
            throw new MissingTokenException("Missing token in " + TOKEN_HEADER + " header");
        }
        if (!StringUtils.startsWith(authHeader, TOKEN_PREFIX)){
            throw new InvalidTokenException("Invalid token, should start with \"" + TOKEN_PREFIX + "\" prefix, but got " + authHeader);
        }

        TokenPayload payload = tokenGetPayload(authHeader);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(payload);
        SecurityContextHolder.setContext(context);
        filterChain.doFilter(request, response);
    }


    private TokenPayload tokenGetPayload(String token)
    {
        try {
            Base64.Decoder decoder = Base64.getUrlDecoder();
            String[] chunks = token.substring(TOKEN_PREFIX.length()).split("\\.");
            if (chunks.length != 3)
                throw new InvalidTokenException("Invalid token " + token);
            String payload = new String(decoder.decode(chunks[1]));
            return new Gson().fromJson(payload, TokenPayload.class);
        }
        catch (Exception e) {
            throw new InvalidTokenException("Invalid token " + token);
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
        try {
            doFilterInternal((HttpServletRequest) request, (HttpServletResponse) response, chain);
        }
        catch (Exception e) {
            exceptionResolver.resolveException((HttpServletRequest) request, (HttpServletResponse) response, null, e);
        }
    }

}
