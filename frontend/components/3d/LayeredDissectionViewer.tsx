'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Layers, Eye, EyeOff, Scissors, Sparkles, Compass, BookOpen } from 'lucide-react';

export interface AnatomicalLayer {
  id: string;
  name: string;
  depthMm: number;
  color: string;
  opacity: number;
  visible: boolean;
  structures: string[];
  clinicalSignificance: string;
}

export const ANATOMICAL_LAYERS: AnatomicalLayer[] = [
  {
    id: 'layer-skin',
    name: '1. Integumentary (Skin & Epidermis)',
    depthMm: 2,
    color: '#E0AC69',
    opacity: 0.85,
    visible: true,
    structures: ['Stratum corneum', 'Dermis', 'Langerhans lines', 'Sebaceous units'],
    clinicalSignificance: 'Incisions placed along Langer lines minimize scar tension and keloid formation.',
  },
  {
    id: 'layer-fascia',
    name: '2. Superficial Fascia & Subcutaneous Fat',
    depthMm: 8,
    color: '#FDE047',
    opacity: 0.7,
    visible: true,
    structures: ['Campers fascia', 'Scarpas fascia', 'Cutaneous nerves', 'Superficial veins'],
    clinicalSignificance: 'Contains superficial neurovascular arborization; key plane for liposuction and flap elevation.',
  },
  {
    id: 'layer-muscle',
    name: '3. Deep Fascia & Muscular Compartment',
    depthMm: 25,
    color: '#EF4444',
    opacity: 0.9,
    visible: true,
    structures: ['Epimysium', 'Striated muscle bellies', 'Tendon insertions', 'Myotendinous junctions'],
    clinicalSignificance: 'Compartment syndrome risk: Intracompartmental pressure > 30 mmHg requires emergency fasciotomy.',
  },
  {
    id: 'layer-neurovascular',
    name: '4. Deep Neurovascular Bundles',
    depthMm: 35,
    color: '#3B82F6',
    opacity: 1.0,
    visible: true,
    structures: ['Main arterial trunks', 'Venae comitantes', 'Peripheral nerve trunks', 'Deep lymphatics'],
    clinicalSignificance: 'Careful preservation prevents iatrogenic nerve palsy (e.g., recurrent laryngeal, radial nerve) during surgery.',
  },
  {
    id: 'layer-bone',
    name: '5. Periosteum & Skeletal Architecture',
    depthMm: 50,
    color: '#F8FAFC',
    opacity: 1.0,
    visible: true,
    structures: ['Cortical bone', 'Trabecular cancellous bone', 'Periosteal cambium layer', 'Marrow cavity'],
    clinicalSignificance: 'Periosteum provides vascular supply for primary fracture callus healing and bone remodeling.',
  },
];

export default function LayeredDissectionViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<AnatomicalLayer[]>(ANATOMICAL_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-muscle');
  const [dissectionDepth, setDissectionDepth] = useState<number>(3); // 1 to 5
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);

  const activeLayer = layers.find((l) => l.id === selectedLayerId) || layers[2];

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Ambient and directional lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Build concentric layered anatomy cylinder / torus
    const meshGroup = new THREE.Group();

    layers.forEach((layer, idx) => {
      if (idx + 1 > dissectionDepth) return;
      if (!layer.visible) return;

      const radius = 2.4 - idx * 0.35;
      const geometry = new THREE.CylinderGeometry(radius, radius, 3.8, 32, 16, true);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(layer.color),
        transparent: true,
        opacity: layer.opacity,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide,
        wireframe: wireframeMode,
      });

      const mesh = new THREE.Mesh(geometry, material);
      meshGroup.add(mesh);
    });

    // Central bone core
    if (dissectionDepth >= 5) {
      const boneGeo = new THREE.CylinderGeometry(0.6, 0.6, 4.4, 32);
      const boneMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.2,
      });
      const boneMesh = new THREE.Mesh(boneGeo, boneMat);
      meshGroup.add(boneMesh);
    }

    scene.add(meshGroup);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      meshGroup.rotation.y += 0.003;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [layers, dissectionDepth, wireframeMode]);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              WebGL 3D Dissection
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Interactive Layer Peeling
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Multi-Layer Anatomical Dissection &amp; Plane Correlator</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Layers size={14} /> {wireframeMode ? 'Solid Surfaces' : 'Wireframe Meshes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D WebGL Canvas (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            ref={containerRef}
            className="w-full h-[480px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-inner"
          />

          {/* Dissection Depth Slider */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Scissors size={14} className="text-purple-400" /> Surgical Dissection Depth:
              </span>
              <span className="text-purple-400 font-mono">Layer {dissectionDepth} of 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={dissectionDepth}
              onChange={(e) => setDissectionDepth(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Epidermis (Superficial)</span>
              <span>Muscular</span>
              <span>Periosteum (Deep)</span>
            </div>
          </div>
        </div>

        {/* Layer Selector & Clinical Significance (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Anatomical Tissue Strata</h3>
            {layers.map((layer) => (
              <div
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  selectedLayerId === layer.id
                    ? 'bg-purple-950/40 border-purple-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="font-semibold">{layer.name}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
            ))}
          </div>

          {/* Active Layer Clinical Correlation Card */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <BookOpen size={14} /> Selected Layer Detail
            </div>
            <h4 className="text-sm font-bold text-white">{activeLayer.name}</h4>
            <div className="text-xs text-slate-300">
              <strong>Key Structures:</strong> {activeLayer.structures.join(', ')}
            </div>
            <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 leading-relaxed">
              <strong>Clinical &amp; Surgical Pearl:</strong> {activeLayer.clinicalSignificance}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
