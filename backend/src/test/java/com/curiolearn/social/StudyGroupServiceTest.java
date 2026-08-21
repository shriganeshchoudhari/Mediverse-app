package com.curiolearn.social;

import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudyGroupServiceTest {

    @Mock
    private StudyGroupRepository studyGroupRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StudyGroupService studyGroupService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEmail("test@test.com");
    }

    @Test
    void testCreateGroup() {
        // Arrange
        String groupName = "Study Cohort 1";
        String groupDesc = "Description here";

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(studyGroupRepository.save(any(StudyGroup.class))).thenAnswer(i -> {
            StudyGroup group = i.getArgument(0);
            group.setId(UUID.randomUUID());
            return group;
        });

        // Act
        StudyGroupDto dto = studyGroupService.createGroup(groupName, groupDesc, testUser.getId());

        // Assert
        assertNotNull(dto);
        assertNotNull(dto.getId());
        assertEquals(groupName, dto.getName());
        assertEquals(groupDesc, dto.getDescription());
        assertEquals(1, dto.getMemberCount());
        assertTrue(dto.isMember());

        verify(userRepository, times(1)).findById(testUser.getId());
        verify(studyGroupRepository, times(1)).save(any(StudyGroup.class));
    }
}
