// src/main/java/com/myproject/service/MatchingService.java

package com.myproject.service;

import com.myproject.domain.Room;
import com.myproject.domain.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MatchingService {
    private final Queue<Member> memberQueue = new ConcurrentLinkedQueue<>();
    private final ConcurrentHashMap<String, Room> roomMap = new ConcurrentHashMap<>();
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public synchronized void join(Member member) {
        memberQueue.add(member);

        if (memberQueue.size() == 1) { // 만약 내가 들어왔는데 queue 사이즈가 1인 경우 -> 대기
            Room room = new Room(member);
            roomMap.put(member.getSessionId(), room);
            System.out.println("room의 status : " + room.getStatus());
        } else if (memberQueue.size() == 2) { // 만약 내가 들어왔는데 queue 사이즈가 2인 경우 -> 게임 매치
            Member firstMember = memberQueue.poll();
            Member secondMember = memberQueue.poll();
            Room room = roomMap.get(firstMember.getSessionId());
            room.getMembers()[1] = secondMember;
            if (room.getMembers().length ==2) {
                room.setStatus("matched");
                System.out.println("room의 status : " + room.getStatus());
                notifyRoomUpdate(room);
            }
        }
    }

    public void notifyRoomUpdate(Room room) {
        messagingTemplate.convertAndSend("/topic/room", room);
    }

}
