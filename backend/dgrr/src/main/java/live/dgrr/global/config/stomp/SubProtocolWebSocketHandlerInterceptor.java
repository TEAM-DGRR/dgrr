// 64kb 이상의 데이터를 보내기 위한 Stomp 설정
// 이 곳에는 실제 사이즈 제한에 대한 내용을 작성

package live.dgrr.global.config.stomp;

import org.aopalliance.intercept.MethodInvocation;
import org.springframework.aop.support.DelegatingIntroductionInterceptor;
import org.springframework.web.socket.WebSocketSession;

public class SubProtocolWebSocketHandlerInterceptor extends DelegatingIntroductionInterceptor {

    @Override
    protected Object doProceed(MethodInvocation mi) throws Throwable {
        if(mi.getMethod().getName().equals("afterConnectionEstablished")) {
            WebSocketSession session = (WebSocketSession) mi.getArguments()[0];
            session.setTextMessageSizeLimit(60 * 1024 * 1024);
            session.setBinaryMessageSizeLimit(60 * 1024 * 1024);
        }
        return super.doProceed(mi);
    }
}
