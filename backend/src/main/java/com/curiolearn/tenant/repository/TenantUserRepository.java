package com.curiolearn.tenant.repository;

import com.curiolearn.tenant.entity.TenantUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TenantUserRepository extends JpaRepository<TenantUser, UUID> {
    List<TenantUser> findByTenantId(UUID tenantId);
    List<TenantUser> findByUserId(UUID userId);
    long countByTenantId(UUID tenantId);
}
