package com.curiolearn.simulation;

import com.curiolearn.simulation.controller.SimulationApiController;
import com.curiolearn.simulation.dto.SimulationCalculateRequestDto;
import com.curiolearn.simulation.dto.SimulationCalculateResponseDto;
import com.curiolearn.simulation.dto.SimulationCatalogItemDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class SimulationApiControllerTest {

    private MockMvc mockMvc;
    private SimulationApiService simulationApiService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        simulationApiService = new SimulationApiService();
        SimulationApiController controller = new SimulationApiController(simulationApiService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testGetSimulationCatalog_ReturnsCatalogList() throws Exception {
        mockMvc.perform(get("/api/v1/simulations/catalog"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$[0].code", is("CARDIOVASCULAR_PV_LOOP")))
                .andExpect(jsonPath("$[0].category", is("CARDIOVASCULAR")))
                .andExpect(jsonPath("$[0].defaultParameters.preloadEdv", is(120.0)));
    }

    @Test
    void testCalculateSimulation_ValidHemodynamics_ReturnsPvLoopCoordinates() throws Exception {
        SimulationCalculateRequestDto requestDto = SimulationCalculateRequestDto.builder()
                .preloadEdv(120.0)
                .afterloadSvr(100.0)
                .inotropyEes(2.5)
                .heartRate(75.0)
                .build();

        mockMvc.perform(post("/api/v1/simulations/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.strokeVolume", greaterThan(0.0)))
                .andExpect(jsonPath("$.ejectionFraction", greaterThan(30.0)))
                .andExpect(jsonPath("$.cardiacOutput", greaterThan(2.0)))
                .andExpect(jsonPath("$.pvLoopCoordinates", hasSize(greaterThan(20))));
    }

    @Test
    void testCalculateSimulationById_ReturnsCalculationResult() throws Exception {
        String simId = UUID.randomUUID().toString();
        SimulationCalculateRequestDto requestDto = SimulationCalculateRequestDto.builder()
                .preloadEdv(140.0)
                .afterloadSvr(90.0)
                .inotropyEes(3.0)
                .build();

        mockMvc.perform(post("/api/v1/simulations/" + simId + "/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.strokeVolume", greaterThan(50.0)))
                .andExpect(jsonPath("$.pvLoopCoordinates", notNullValue()));
    }

    @Test
    void testSimulationApiServiceDirectMath() {
        SimulationCalculateRequestDto req = SimulationCalculateRequestDto.builder()
                .preloadEdv(120.0)
                .afterloadSvr(100.0)
                .inotropyEes(2.5)
                .heartRate(75.0)
                .build();

        SimulationCalculateResponseDto resp = simulationApiService.calculate(req);

        assertNotNull(resp);
        assertTrue(resp.getStrokeVolume() > 0);
        assertTrue(resp.getEjectionFraction() > 40 && resp.getEjectionFraction() < 80);
        assertTrue(resp.getEndSystolicVolume() < resp.getEndDiastolicVolume());
        assertFalse(resp.getPvLoopCoordinates().isEmpty());
    }
}
