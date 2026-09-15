# ADR-013: Capacitor Hybrid Mobile Strategy vs. Native iOS/Android

**Date**: September 2026  
**Status**: Accepted  
**Deciders**: Mobile Architecture Team, Product Lead  

## Context

Mediverse provides over 160 interactive 3D anatomy and physiology simulation workstations built with Three.js, React Three Fiber, and WebGL. Medical students, interns, and faculty require mobile access on clinical rounds and hospital wards across iPads, Android tablets, and smartphones.

Developing parallel native codebases (Swift/SwiftUI for iOS and Kotlin/Jetpack Compose for Android) would require reimplementing the 3D scene graphs, mathematical solvers, and WebGL shader pipelines, effectively tripling engineering surface area and maintenance cost.

## Decision

We adopt **Capacitor** (`@capacitor/core`, `@capacitor/android`, `@capacitor/ios`) as the platform runtime for mobile deployments:
- The Next.js production build (`next build`) is packaged and synchronized directly into native iOS and Android shells via `npx cap sync`.
- Hardware features (haptic feedback during palpation simulation, offline network status, secure preference storage, and status bar color syncing) are consumed via standard Capacitor plugins.
- WebGL 3D meshes run inside the high-performance native WebView with hardware GPU acceleration.
- Android builds are maintained in the repository (`android/` project folder); iOS generation (`npx cap add ios`) is documented for macOS build runners.

## Consequences

- **Positive**: 100% code reuse across Web, Android, and iOS; simultaneous feature releases for all 164 3D simulators.
- **Negative**: Requires careful WebView memory management on low-end Android mobile devices with under 3GB RAM.
