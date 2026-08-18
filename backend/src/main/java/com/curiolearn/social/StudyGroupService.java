package com.curiolearn.social;

import com.curiolearn.social.StudyGroupDto;
import com.curiolearn.social.StudyGroup;
import com.curiolearn.user.User;
import com.curiolearn.social.StudyGroupRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudyGroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final UserRepository userRepository;

    public StudyGroupService(StudyGroupRepository studyGroupRepository, UserRepository userRepository) {
        this.studyGroupRepository = studyGroupRepository;
        this.userRepository = userRepository;
    }

    public List<StudyGroupDto> getAllGroups(UUID userId) {
        List<StudyGroup> groups = studyGroupRepository.findAll();
        User user = userRepository.findById(userId).orElseThrow();
        return groups.stream().map(g -> mapToDto(g, user)).collect(Collectors.toList());
    }

    @Transactional
    public StudyGroupDto createGroup(String name, String description, UUID creatorId) {
        User creator = userRepository.findById(creatorId).orElseThrow();
        StudyGroup group = StudyGroup.builder()
                .name(name)
                .description(description)
                .build();
        group.getMembers().add(creator);
        StudyGroup saved = studyGroupRepository.save(group);
        return mapToDto(saved, creator);
    }

    @Transactional
    public StudyGroupDto joinGroup(UUID groupId, UUID userId) {
        StudyGroup group = studyGroupRepository.findById(groupId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        
        if (!group.getMembers().contains(user)) {
            group.getMembers().add(user);
            studyGroupRepository.save(group);
        }
        return mapToDto(group, user);
    }

    public List<User> getGroupMembers(UUID groupId) {
        StudyGroup group = studyGroupRepository.findById(groupId).orElseThrow();
        return List.copyOf(group.getMembers());
    }

    private StudyGroupDto mapToDto(StudyGroup group, User currentUser) {
        return StudyGroupDto.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .createdAt(group.getCreatedAt())
                .memberCount(group.getMembers().size())
                .isMember(group.getMembers().contains(currentUser))
                .build();
    }
}

