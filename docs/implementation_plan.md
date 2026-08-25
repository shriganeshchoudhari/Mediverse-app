# WebXR Immersive Anatomy Viewer

This plan outlines the architecture for upgrading our existing `react-three-fiber` 3D organs into a fully immersive Spatial Computing environment supporting WebXR headsets like the Meta Quest and Apple Vision Pro.

## Proposed Changes

### 1. WebXR Dependencies
We will install the official `@react-three/xr` package which provides the `VRButton`, `ARButton`, and `<XR>` canvas wrappers.

#### [NEW] `package.json`
- Install `@react-three/xr`

### 2. The WebXR Viewer Component
We will create a specialized spatial wrapper that enhances the existing `ThreeCanvas` to support virtual reality controllers and hand-tracking.

#### [NEW] `frontend/components/3d/WebXRViewer.tsx`
- Wraps the standard `<Canvas>` with an `<XR>` provider.
- Includes `<Controllers />` and `<Hands />` components to allow students to grab, rotate, and manipulate organs (like the Heart or Brain) using physical hand gestures.
- Renders the `<VRButton />` overlay to let the user enter immersive mode from their browser.

### 3. Spatial UI Overlays
In 2D, we use HTML overlays for labels. In WebXR, standard HTML doesn't render inside the headset view. We must convert critical clinical labels and pathology markers into 3D text.

#### [MODIFY] `frontend/components/3d/AnatomyDissectionViewer.tsx`
- Conditionally render `@react-three/drei`'s `<Text>` component floating next to the organ when in XR mode, replacing the standard DOM-based tooltip overlays.
- Add spatial interaction event handlers (`onSelect`, `onSqueeze`) so clicking the trigger on an organ part brings up the pathology information.

## Verification Plan

### Manual Verification
1. Open the WebXR Viewer on a desktop browser. Ensure the "Enter VR" button is visible and the fallback 2D viewer works normally.
2. The user can use a WebXR emulator extension (or a physical Quest headset) to enter VR.
3. Verify that the controllers load and can raycast/interact with the 3D organ meshes.

## User Review Required
> [!IMPORTANT]
> To truly manipulate the organs in 3D space, we can enable **Hand Tracking** (bare hands) or **Controller Tracking** (laser pointers). I recommend enabling **Both** so the headset can default to whatever the student prefers. Let me know if you approve this plan!
