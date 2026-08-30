# ADR-009: Adoption of Draco & KTX2 for 3D Medical Mesh Compression

```text
Status:      ACCEPTED
Date:        2026-08-29
Deciders:    3D/WebGL Architect, Frontend Lead, Principal Enterprise Architect
Context:     High-fidelity medical 3D meshes (organs, skeleton, surgical models) must load quickly over mobile networks and WebXR headsets.
```

---

## 1. Context & Problem Statement
Uncompressed 3D anatomical models average $50\text{MB} - 150\text{MB}$, causing high network latency, mobile browser crashes, and WebGL GPU out-of-memory errors on student devices.

## 2. Decision
We adopt an automated 3D processing pipeline utilizing **Google Draco geometry compression**, **Meshoptimizer vertex cache ordering**, and **KTX2 / Basis Universal GPU textures** delivered via CloudFront CDN.

## 3. Rationale
- **Bandwidth Reduction:** Achieves an average **$75\% - 85\%$ file size reduction** ($50\text{MB} \rightarrow 8\text{MB}$).
- **Direct GPU Texture Transcoding:** KTX2 textures transcode directly into native GPU formats (BC7 on Desktop, ASTC on Mobile) without CPU decompression overhead.
- **WebXR Parity:** Guarantees solid $60\text{ FPS}$ on mobile and $90\text{ FPS}$ on Meta Quest 3 WebXR headsets.

## 4. Consequences & Trade-Offs
- **Positive:** Rapid initial asset load times; zero WebGL memory crashes.
- **Negative:** Requires Draco WASM decompressor on client side (minor $120\text{KB}$ library overhead).
