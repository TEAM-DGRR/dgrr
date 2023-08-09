package live.dgrr.domain.openvidu.service;

import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
public class OpenViduService {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * Param 다른건 다지우고, customSessionId 만 남겨둠.
     */
    public String createSession(String gameSessionId) {
        Map<String,String> parameterMap = new HashMap<>();
        parameterMap.put("customSessionId", gameSessionId);
        SessionProperties properties = SessionProperties.fromJson(parameterMap).build();
        Session session = null;
        try {
            session = openvidu.createSession(properties);
        } catch (OpenViduJavaClientException e) {
            throw new RuntimeException(e);
        } catch (OpenViduHttpException e) {
            throw new RuntimeException(e);
        }
        return session.getSessionId();
    }

    public String createConnection(String sessionId) {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            return "false";
        }
        Connection connection = null;
        try {
            connection = session.createConnection();
        } catch (OpenViduJavaClientException e) {
            throw new RuntimeException(e);
        } catch (OpenViduHttpException e) {
            throw new RuntimeException(e);
        }
        return connection.getToken();
    }

    public void closeConnection(String sessionId) {
        Session session = openvidu.getActiveSession(sessionId);
        try {
            session.close();
        } catch (OpenViduJavaClientException e) {
            throw new RuntimeException(e);
        } catch (OpenViduHttpException e) {
            throw new RuntimeException(e);
        }
    }
}
