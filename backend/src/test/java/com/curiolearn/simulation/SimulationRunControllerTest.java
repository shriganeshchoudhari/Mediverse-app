package com.curiolearn.simulation;

import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import org.springframework.core.MethodParameter;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class SimulationRunControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SimulationRunService simulationRunService;

    @Mock
    private UserRepository userRepository;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        SimulationRunController controller = new SimulationRunController(simulationRunService, userRepository);

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
    @DisplayName("TC-API-SIM-001: GET /api/v1/simulations returns current user simulation history")
    void testGetMySimulations_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).email("student@mediverse.edu").build();
        when(userRepository.findByEmail("student@mediverse.edu")).thenReturn(Optional.of(user));

        SimulationRun run = SimulationRun.builder()
                .id(UUID.randomUUID())
                .user(user)
                .simulationType("CARDIOVASCULAR_PV_LOOP")
                .inputParameters(Map.of("preloadEdv", 120.0))
                .outcomeMetrics(Map.of("strokeVolume", 72.0))
                .executedAt(LocalDateTime.now())
                .build();

        when(simulationRunService.getSimulationRuns(userId)).thenReturn(List.of(run));

        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(
                        "student@mediverse.edu", "pass", List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        mockMvc.perform(get("/api/v1/simulations").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].simulationType", is("CARDIOVASCULAR_PV_LOOP")));
    }

    @Test
    @DisplayName("TC-API-SIM-002: POST /api/v1/simulations saves new simulation execution outcome")
    void testSaveSimulation_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).email("student@mediverse.edu").build();
        when(userRepository.findByEmail("student@mediverse.edu")).thenReturn(Optional.of(user));

        SimulationRunRequestDto requestDto = SimulationRunRequestDto.builder()
                .simulationType("ARDS_MECHANICS")
                .inputParameters(Map.of("pao2Fio2", 150.0))
                .outcomeMetrics(Map.of("drivingPressure", 12.0))
                .build();

        SimulationRun saved = SimulationRun.builder()
                .id(UUID.randomUUID())
                .user(user)
                .simulationType("ARDS_MECHANICS")
                .inputParameters(Map.of("pao2Fio2", 150.0))
                .outcomeMetrics(Map.of("drivingPressure", 12.0))
                .executedAt(LocalDateTime.now())
                .build();

        when(simulationRunService.saveSimulationRun(eq(userId), eq("ARDS_MECHANICS"), any(), any()))
                .thenReturn(saved);

        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(
                        "student@mediverse.edu", "pass", List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        mockMvc.perform(post("/api/v1/simulations")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.simulationType", is("ARDS_MECHANICS")));
    }
}
