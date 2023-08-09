package live.dgrr.global.security.jwt;

public interface JwtProperties {

    int EXPIRATION_TIME =  864000000; //60000 1분 //864000000 10일
    String TOKEN_PREFIX = "Bearer ";
    String HEADER_STRING = "Authorization";
}
