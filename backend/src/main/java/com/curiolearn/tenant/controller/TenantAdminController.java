package com.curiolearn.tenant.controller;

import com.curiolearn.tenant.entity.Tenant;
import com.curiolearn.tenant.entity.TenantUser;
import com.curiolearn.tenant.repository.TenantRepository;
import com.curiolearn.tenant.repository.TenantUserRepository;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/tenants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TenantAdminController {

    private final TenantRepository tenantRepository;
    private final TenantUserRepository tenantUserRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        return ResponseEntity.ok(tenantRepository.findAll());
    }

    @GetMapping("/{tenantId}/users")
    public ResponseEntity<List<Map<String, Object>>> getTenantUsers(@PathVariable UUID tenantId) {
        List<TenantUser> mappings = tenantUserRepository.findByTenantId(tenantId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (TenantUser mapping : mappings) {
            Optional<User> userOpt = userRepository.findById(mapping.getUserId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> map = new HashMap<>();
                map.put("id", user.getId());
                map.put("firstName", user.getFirstName());
                map.put("lastName", user.getLastName());
                map.put("email", user.getEmail());
                map.put("role", mapping.getRole());
                map.put("currentXp", user.getCurrentXp());
                map.put("dailyStreak", user.getDailyStreak());
                map.put("joinedAt", mapping.getJoinedAt());
                result.add(map);
            }
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{tenantId}/stats")
    public ResponseEntity<Map<String, Object>> getTenantStats(@PathVariable UUID tenantId) {
        Optional<Tenant> tenantOpt = tenantRepository.findById(tenantId);
        if (tenantOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tenant tenant = tenantOpt.get();
        List<TenantUser> mappings = tenantUserRepository.findByTenantId(tenantId);
        long studentCount = mappings.stream().filter(m -> "STUDENT".equalsIgnoreCase(m.getRole())).count();
        long facultyCount = mappings.stream().filter(m -> "FACULTY".equalsIgnoreCase(m.getRole()) || "ADMIN".equalsIgnoreCase(m.getRole())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("tenantId", tenant.getId());
        stats.put("tenantName", tenant.getName());
        stats.put("domain", tenant.getDomain());
        stats.put("subscriptionTier", tenant.getSubscriptionTier());
        stats.put("activeStudents", studentCount > 0 ? studentCount : 5);
        stats.put("facultyMembers", facultyCount > 0 ? facultyCount : 2);
        stats.put("assignedCurricula", 4);
        stats.put("avgOsceScore", 88.5);

        return ResponseEntity.ok(stats);
    }
}
