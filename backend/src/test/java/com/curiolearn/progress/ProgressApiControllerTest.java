package com.curiolearn.progress;

import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProgressApiControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProgressService progressService;

    @Mock
    private UserRepository userRepository;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        ProgressController controller = new ProgressController(progressService, userRepository);

        HandlerMethodArgumentResolver authPrincipalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.hasParameterAnnotation(AuthenticationPrincipal.class)
                        || UserDetails.class.isAssignableFrom(parameter.getParameterType());
            }

            @Override
            public Object resolveArgument(MethodParameter parameter,
                    ModelAndViewContainer mavContainer,
                    NativeWebRequest webRequest,
                    WebDataBinderFactory binderFactory) {
                Principal principal = webRequest.getUserPrincipal();
                if (principal == null) {
                    return null;
                }
                return new org.springframework.security.core.userdetails.User(
                        principal.getName(),
                        "password",
                        Collections.emptyList());
            }
        };

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(authPrincipalResolver)
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("TC-API-PROG-001: GET /api/v1/progress without authentication returns 401 Unauthorized")
    void testGetProgress_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(get("/api/v1/progress"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-API-PROG-002: GET /api/v1/progress with valid user returns lesson progress list")
    void testGetProgress_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).email("student@mediverse.edu").build();

        ProgressDto progressItem = ProgressDto.builder()
                .lessonId("cardiac-cycle")
                .completionPercentage(100)
                .completed(true)
                .build();

        when(userRepository.findByEmail("student@mediverse.edu")).thenReturn(Optional.of(user));
        when(progressService.getProgress(userId)).thenReturn(List.of(progressItem));

        mockMvc.perform(get("/api/v1/progress")
                .principal(() -> "student@mediverse.edu"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].lessonId", is("cardiac-cycle")))
                .andExpect(jsonPath("$[0].completionPercentage", is(100)))
                .andExpect(jsonPath("$[0].completed", is(true)));
    }
}
