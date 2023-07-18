// src/main/java/com/myproject/domain/Member.java

package com.myproject.domain;

public class Member {
    private String name;
    private String sessionId;
    public Member(String name, String sessionId) {
        this.name = name;
        this.sessionId = sessionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
