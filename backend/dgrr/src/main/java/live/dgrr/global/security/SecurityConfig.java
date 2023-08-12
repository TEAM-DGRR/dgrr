package live.dgrr.global.security;

import live.dgrr.global.security.jwt.CustomAuthenticationEntryPoint;
import live.dgrr.global.security.jwt.JwtRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // rest api는 stateless 하기 때문에 cross-site request forgery 공격을 막는 코드가 필요 없음.
//                .headers().frameOptions().disable()
//                .and()
                .cors() // 프론트엔드 서버와 통신을 위해
                .and()
                .sessionManagement()//세션 정책 설정
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 스프링 시큐리티가 세션을 만들지도 기존 것을 사용하지도 않음
                .and()
                .httpBasic().disable()
                .formLogin().disable()
                .authorizeRequests()
                .antMatchers("/ws","/api/v1/member/**", "/api/v1/member/", "/api/v1/member", "/api/v1/file", "/api/v1/**").permitAll() // 인증 절차 없이 허용할 URI
                .anyRequest().authenticated()  // 위에서 허용한 URI를 제외한 모든 요청은 인증을 완료해야 접근 가능
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint());
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
