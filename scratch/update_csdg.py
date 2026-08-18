import re
import os

def read_csdg():
    with open('docs/CSDG.md', 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def insert_before_end(chapter_text, addition):
    pattern = r'\n(?=##\s+Chapter|\Z)'
    m = re.search(pattern, chapter_text)
    if m:
        idx = m.start()
        return chapter_text[:idx].rstrip() + "\n\n" + addition.strip() + "\n\n" + chapter_text[idx:].lstrip()
    else:
        return chapter_text.strip() + "\n\n" + addition.strip() + "\n"

def build_chapter_29():
    return r"""# Chapter 29 — 3D WebGL, Three.js & Interactive Shader Graphics Standards

## 29.1 Overview

This chapter defines the engineering standards, memory management lifecycle rules, rendering loop conventions, and GLSL shader practices for developing 3D anatomical and physiological models in the Mediverse platform.

## 29.2 Three.js WebGL2 Architecture & Canvas Standards

### CSDG-0291: Three.js Canvas Lifecycle & Component Architecture
* **Canvas Component:** All 3D WebGL canvases must be implemented using Three.js canvas wrappers (`ThreeCanvas.tsx`) supporting WebGL2.
* **Camera & Controls:** Utilize `PerspectiveCamera` with a field of view (FOV) between $45^\circ$ and $60^\circ$ and `OrbitControls` with damping enabled (`enableDamping: true`, damping factor: `0.05`).
* **Lighting Model:** Use a calibrated three-point lighting rig (Key DirectionalLight, Fill AmbientLight, Rim PointLight) to ensure anatomical surface depth without washouts.

### CSDG-0292: Mandatory GPU VRAM Disposal & Memory Cleanup
* **Unmount Disposal:** Every React component mounting a 3D mesh, geometry, material, or texture must bind to an unmount cleanup hook (`useThreeMemoryCleanup.ts`).
* **Disposal Pattern:**
  ```typescript
  export function dispose3DObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => disposeMaterial(mat));
          } else {
            disposeMaterial(child.material);
          }
        }
      }
    });
  }

  function disposeMaterial(material: THREE.Material): void {
    Object.keys(material).forEach((prop) => {
      const val = (material as any)[prop];
      if (val && typeof val.dispose === 'function') {
        val.dispose();
      }
    });
    material.dispose();
  }
  ```

### CSDG-0293: Zero Allocation in Render Loops (useFrame / requestAnimationFrame)
* **Prohibition:** Strictly prohibit instantiating `new THREE.Vector3()`, `new THREE.Matrix4()`, `new THREE.Quaternion()`, or temporary arrays inside the `useFrame` or `requestAnimationFrame` loop.
* **Reuse Rule:** Declare module-scoped or ref-cached scratch variables:
  ```typescript
  // CORRECT: Pre-allocated scratch objects
  const _scratchVector = new THREE.Vector3();
  const _scratchMatrix = new THREE.Matrix4();

  useFrame((state, delta) => {
    _scratchVector.set(0, Math.sin(state.clock.elapsedTime), 0);
    meshRef.current.position.add(_scratchVector.multiplyScalar(delta));
  });
  ```

### CSDG-0294: GLSL Cross-Sectional Dissection Shader Standards
* **Clipping Planes:** Multi-plane dissection clipping (sagittal, coronal, transverse) must be implemented via custom GLSL shaders or standard Three.js `clippingPlanes` with stencil buffer capping (`DissectionShader.ts`).
* **Precision Qualifiers:** Always declare `precision mediump float;` for mobile cross-browser compatibility.

### CSDG-0295: WebGL Context Loss & Mobile Fallbacks
* **Context Loss Handler:** Add explicit event listeners for `webglcontextlost` (calling `event.preventDefault()` to allow WebGL restoration) and `webglcontextrestored` (re-initializing textures and mesh geometries).
"""

def main():
    text = read_csdg()

    # Split into chapters
    pattern = r'(?=\n(?:#+\s+(?:CSDG\s*[-—]\s*)?Chapter\s+\d+\b(?:\s*[-—:]\s*[^\n]+)?))'
    parts = re.split(pattern, text)
    print(f"Total parts parsed in CSDG.md: {len(parts)}")

    header = parts[0]
    chapter_map = {}

    for p in parts:
        m = re.search(r'#+\s+(?:CSDG\s*[-—]\s*)?Chapter\s+(\d+)\b', p)
        if m:
            num = int(m.group(1))
            # If duplicate, keep longer one
            if num not in chapter_map or len(p) > len(chapter_map[num]):
                chapter_map[num] = p

    # Restore missing Chapter 29
    if 29 not in chapter_map:
        print("Restoring missing Chapter 29...")
        chapter_map[29] = build_chapter_29()

    print(f"Unique chapters after deduplication and insertion: {len(chapter_map)} (expected 125)")

    # 1. Enhance Chapter 20 (Frontend Styling & Vanilla CSS Standards)
    if 20 in chapter_map:
        chap20_addition = r"""
---

# 20.10 Vanilla CSS & Scoped CSS Modules Architecture Standard

### CSDG-0205: Vanilla CSS Token Standards
* **Pure Vanilla CSS:** Styling must use pure Vanilla CSS and CSS Modules (`*.module.css`). Utility-class frameworks (Tailwind CSS) and CSS-in-JS runtimes (styled-components) are explicitly prohibited.
* **Design Token Hierarchy:** All colors, typography, spacing, border radiuses, and elevation shadows must reference centralized CSS custom properties declared in `globals.css`:
  ```css
  /* Example CSS Module usage */
  .container {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    box-shadow: var(--shadow-card);
  }
  ```
"""
        if "# 20.10 Vanilla CSS" not in chapter_map[20]:
            chapter_map[20] = insert_before_end(chapter_map[20], chap20_addition)

    # 2. Enhance Chapter 28 (Physiological Simulation Solver Standards)
    if 28 in chapter_map:
        chap28_addition = r"""
---

# 28.10 Mathematical Physiology Differential Solvers Coding Standards

### CSDG-0285: Pure Functional Simulation Architecture
* **Pure Functional Decoupling:** Solvers (`cardiacSolver.ts`, `acidBaseSolver.ts`, `renalSolver.ts`, `membraneSolver.ts`) must be pure deterministic TypeScript functions with zero React DOM dependencies.
* **Defensive Numerical Stability:** Guard against division-by-zero, `NaN`, and `Infinity` propagation in Euler integration loops.
* **Biological Bound Clamping:** Clamp all outputs to valid biological ranges (e.g. Heart Rate: $20 \le HR \le 260\text{ BPM}$, Arterial Blood pH: $6.80 \le pH \le 7.80$).
* **Performance Budget:** Execution time must not exceed $< 1.0\text{ms}$ per calculation cycle to ensure continuous 60 FPS slider reactivity.
"""
        if "# 28.10 Mathematical Physiology" not in chapter_map[28]:
            chapter_map[28] = insert_before_end(chapter_map[28], chap28_addition)

    # 3. Enhance Chapter 65 (Socratic AI Prompt Engineering Standards)
    if 65 in chapter_map:
        chap65_addition = r"""
---

# 65.10 Socratic AI Prompt Engineering & KaTeX Sanitization Standards

### CSDG-0655: Socratic AI Prompt Sandboxing & Streaming Standards
* **Prompt Sandboxing:** System prompts must strictly isolate instructions from untrusted user inputs to prevent jailbreaks.
* **Server-Sent Events (SSE) Hook Pattern:** Streaming chat must consume tokens via standardized React hooks (`useSocraticChatStream.ts`) handling buffer flushes and network disconnects.
* **KaTeX & LaTeX Sanitization:** Mathematical formulas must be rendered using `rehype-katex` and `remark-math` with DOMPurify XSS sanitization.
"""
        if "# 65.10 Socratic AI Prompt" not in chapter_map[65]:
            chapter_map[65] = insert_before_end(chapter_map[65], chap65_addition)

    # 4. Enhance Chapter 70 (TypeScript 5 Strict Config Standards)
    if 70 in chapter_map:
        chap70_addition = r"""
---

# 70.10 TypeScript 5 Strict Compiler & Code Quality Standards

### CSDG-0705: Strict TypeScript Compiler Baseline
All frontend and simulation code must compile under TypeScript 5.x with maximum strictness:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true
  }
}
```
"""
        if "# 70.10 TypeScript 5 Strict" not in chapter_map[70]:
            chapter_map[70] = insert_before_end(chapter_map[70], chap70_addition)

    # Reassemble complete CSDG.md
    output_parts = [chapter_map[i].strip() for i in sorted(chapter_map.keys())]
    final_csdg = "\n\n---\n\n".join(output_parts)

    print(f"Final CSDG.md length: {len(final_csdg)} characters across {len(output_parts)} chapters.")
    with open('docs/CSDG.md', 'w', encoding='utf-8') as f:
        f.write(final_csdg)
    print("Successfully updated docs/CSDG.md with all deduplications and coding standards!")

if __name__ == '__main__':
    main()
