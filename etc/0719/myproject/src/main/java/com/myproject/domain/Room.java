// src/main/java/com/myproject/domain/Room.java

package com.myproject.domain;

import java.util.concurrent.atomic.AtomicInteger;

public class Room {
    private static final AtomicInteger count = new AtomicInteger(0);
    private int roomId;
    private Member[] members = new Member[2];
    private String status = "waiting";

    public Room(Member member) {
        this.roomId = count.incrementAndGet();
        this.members[0] = member;
    }

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public Member[] getMembers() {
        return members;
    }

    public void setMembers(Member[] members) {
        this.members = members;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


}
