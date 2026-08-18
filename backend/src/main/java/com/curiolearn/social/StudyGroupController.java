package com.curiolearn.social;

import com.curiolearn.social.StudyGroupDto;
import com.curiolearn.user.User;
import com.curiolearn.social.StudyGroupService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/study-groups")
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    public StudyGroupController(StudyGroupService studyGroupService) {
        this.studyGroupService = studyGroupService;
    }

    @GetMapping
    public ResponseEntity<List<StudyGroupDto>> getAllGroups(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(studyGroupService.getAllGroups(userId));
    }

    @PostMapping
    public ResponseEntity<StudyGroupDto> createGroup(@RequestBody CreateGroupRequest request, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(studyGroupService.createGroup(request.getName(), request.getDescription(), userId));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<StudyGroupDto> joinGroup(@PathVariable UUID id, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.ok(studyGroupService.joinGroup(id, userId));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<UserDto>> getMembers(@PathVariable UUID id) {
        List<User> members = studyGroupService.getGroupMembers(id);
        List<UserDto> dtos = members.stream().map(m -> new UserDto(m.getId(), m.getFirstName(), m.getLastName(), m.getRole())).toList();
        return ResponseEntity.ok(dtos);
    }

    @Data
    public static class CreateGroupRequest {
        private String name;
        private String description;
    }

    @Data
    public static class UserDto {
        private final UUID id;
        private final String firstName;
        private final String lastName;
        private final String role;
    }
}

