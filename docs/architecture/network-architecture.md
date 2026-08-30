# Mediverse Architecture — Network & Ingress Specification

```text
Document ID:       MED-ARCH-04
Classification:    Enterprise Standard
Status:            APPROVED
Parent Document:   ENTERPRISE_SYSTEM_ARCHITECTURE.md
```

---

## 1. Network Architecture Overview

Mediverse enforces a layered, defence-in-depth network topology transitioning from public edge inspection to zero-trust microservice segmentation.

```mermaid
graph TD
    subgraph Layer1 ["Layer 1: Global Edge Tier"]
        Cloudflare["Cloudflare Edge (DDoS Shield, Anycast DNS, SSL Termination)"]
    end

    subgraph Layer2 ["Layer 2: Cloud Ingress Tier"]
        ALB["AWS Application Load Balancer (HTTPS :443)"]
        IngressCtrl["Kubernetes NGINX Ingress Controller"]
    end

    subgraph Layer3 ["Layer 3: API Gateway & Service Mesh"]
        SpringGateway["Spring Cloud Gateway (JWT Verification, Rate Limiting)"]
        ServiceMesh["Istio / Linkerd mTLS Service Mesh (SPIFFE Identity)"]
    end

    subgraph Layer4 ["Layer 4: Kubernetes Pod Segmentation (NetworkPolicies)"]
        AppPods["Application Microservices (Port 8080-8086)"]
        KafkaBrokers["Kafka Cluster (Port 9092)"]
    end

    subgraph Layer5 ["Layer 5: Database & Persistence Tier"]
        AuroraDB[("PostgreSQL Aurora Private Subnet (Port 5432)")]
        RedisCluster[("ElastiCache Redis Cluster (Port 6379)")]
    end

    Cloudflare --> ALB
    ALB --> IngressCtrl
    IngressCtrl --> SpringGateway
    SpringGateway --> ServiceMesh
    ServiceMesh --> AppPods
    AppPods --> KafkaBrokers
    AppPods --> AuroraDB
    AppPods --> RedisCluster
```

---

## 2. Kubernetes NetworkPolicy Rules (Default-Deny)

All namespaces in the Mediverse EKS cluster enforce default-deny ingress and egress rules. Only explicitly whitelisted pod-to-pod communications are permitted.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: mediverse-app
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-gateway-to-curriculum
  namespace: mediverse-app
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: curriculum-service
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app.kubernetes.io/name: spring-cloud-gateway
      ports:
        - protocol: TCP
          port: 8081
  policyTypes:
    - Ingress
```

---

## 3. Ingress Security & TLS Ciphers

- **Protocols Supported:** TLS 1.3 (Primary), TLS 1.2 (Fallback with strict forward secrecy). TLS 1.0 and 1.1 are unconditionally rejected at the Cloudflare edge.
- **Strict Transport Security (HSTS):** `max-age=31536000; includeSubDomains; preload` header sent on all HTTPS responses.
- **mTLS Service Mesh:** Intra-cluster communications utilize Envoy sidecar proxies with automated mutual TLS and X.509 certificate rotations via cert-manager and SPIFFE workload identities.
