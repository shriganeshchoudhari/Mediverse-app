package com.curiolearn.simulation;
import com.curiolearn.user.User;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "simulation_runs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulationRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String simulationType; // e.g. ECG, SPIROMETRY

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "input_parameters")
    private Map<String, Object> inputParameters;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "outcome_metrics")
    private Map<String, Object> outcomeMetrics;

    @Column(nullable = false)
    private LocalDateTime executedAt;

    @PrePersist
    protected void onCreate() {
        executedAt = LocalDateTime.now();
    }
}

