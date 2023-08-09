package live.dgrr.global.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
@Component
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String SECRET;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 아래 주석: header에 안 들어올 때를 대비한 디버그용
//        System.out.println("JwtRequestFilter. Header: ");
//        Iterator i = request.getHeaderNames().asIterator();
//        for (Iterator it = i; it.hasNext(); ) {
//            String s = (String) it.next();
//            System.out.println("aaa " + s);
//        }
        String jwtHeader = (request).getHeader(JwtProperties.HEADER_STRING);
        System.out.println("JwtRequestFilter 진입");
        System.out.println("SECRET: " + SECRET);
        // header 가 정상적인 형식인지 확인
        if(jwtHeader == null || !jwtHeader.startsWith(JwtProperties.TOKEN_PREFIX)) {
            System.out.println("::: jwtHeader가 없거나 token prefix로 시작하지 않음");
//            System.out.println("jwtHeader: " + jwtHeader);
            filterChain.doFilter(request, response);
            return;
        }

        // jwt 토큰을 검증해서 정상적인 사용자인지 확인
        String token = jwtHeader.replace(JwtProperties.TOKEN_PREFIX, "");

        Long memberId = null;

        try {
            memberId = JWT.require(Algorithm.HMAC512(SECRET)).build().verify(token)
                    .getClaim("id").asLong();

        } catch (TokenExpiredException e) {
            e.printStackTrace();
            request.setAttribute(JwtProperties.HEADER_STRING, "토큰이 만료되었습니다.");
        } catch (JWTVerificationException e) {
            e.printStackTrace();
            request.setAttribute(JwtProperties.HEADER_STRING, "유효하지 않은 토큰입니다.");
        }

        request.setAttribute("memberId", memberId);

        filterChain.doFilter(request, response);
    }
}
