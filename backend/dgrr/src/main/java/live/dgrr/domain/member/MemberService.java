package live.dgrr.domain.member;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import live.dgrr.domain.oauth.OauthToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class MemberService {

    @Autowired
    MemberRepository memberRepository;

    public OauthToken getAccessToken(String code) {
        RestTemplate rt = new RestTemplate();

        System.out.println("code: " + code);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "4761381774a32ff8949b9db4a3850618");
        params.add("redirect_uri", "http://localhost:3000/kakaoCallback");
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(params, headers);

        ResponseEntity<String> accessTokenResponse = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        //(7)
        ObjectMapper objectMapper = new ObjectMapper();
        OauthToken oauthToken = null;
        try {
            oauthToken = objectMapper.readValue(accessTokenResponse.getBody(), OauthToken.class);
        } catch (JsonProcessingException e) {
            System.out.println("jsonprocessingexception");
            e.printStackTrace();
        }


        return oauthToken;
    }


    public void addMember(Member member) {
         memberRepository.save(member);
    }

    public String getKakaoAccessToken(String code) {
        String access_Token = "";
        String reqURL = "https://kauth.kakao.com/oauth/token";

        System.out.println("code: " + code);

        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            //POST 요청을 위해 기본값이 false인 setDoOutput을 true로
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            //POST 요청에 필요로 요구하는 파라미터 스트림을 통해 전송
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            String sb = "grant_type=authorization_code" +
                    "&client_id=4761381774a32ff8949b9db4a3850618" + // TODO REST_API_KEY 입력
                    "&redirect_uri=http://localhost:3000/kakaoCallback" + // TODO 인가코드 받은 redirect_uri 입력
                    "&code=" + code;
            bw.write(sb);
            bw.flush();

            // 결과 코드가 200이라면 성공
            int responseCode = conn.getResponseCode();
            System.out.println("response Code: " + responseCode);

            //요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line;
            StringBuilder result = new StringBuilder();

            while ((line = br.readLine()) != null) {
                result.append(line);
            }

            //Gson 라이브러리에 포함된 클래스로 JSON파싱 객체 생성
            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(result.toString());

            System.out.println("access_token: " + access_Token);
            System.out.println("result: " + result);

            access_Token = element.getAsJsonObject().get("access_token").getAsString();
            br.close();
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println(":::\nmemberService: " + e.getMessage());
            System.out.println(e.toString());
        }

        return access_Token;
    }


    public String createKakaoMember(String token) {
        String id = "";
        String reqURL = "https://kapi.kakao.com/v2/user/me";

        System.out.println("token: " + token);

        //access_token을 이용하여 사용자 정보 조회
        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Authorization", "Bearer " + token); //전송할 header 작성, access_token전송

            //요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line;
            StringBuilder result = new StringBuilder();

            while ((line = br.readLine()) != null) {
                result.append(line);
            }
            //Gson 라이브러리로 JSON파싱
            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(result.toString());

            id = element.getAsJsonObject().get("id").getAsString();

            System.out.println("id: " + id);
            br.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return id;
    }

    public Member getMemberByKakaoId(String id) {
        return memberRepository.findByKakaoId(id);
    }
}
