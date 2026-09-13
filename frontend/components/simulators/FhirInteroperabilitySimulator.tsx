"use client";

import React, { useState, useMemo } from 'react';
import {
  Server,
  Database,
  Network,
  ShieldCheck,
  Code2,
  Share2,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Key,
  Layers,
  Activity,
  Zap,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Lock,
  Search,
  Filter
} from 'lucide-react';
import {
  getClinicalPresets,
  ClinicalPreset,
  parseHl7v2ToFhir,
  simulateSmartOnFhirAuth,
  executeFhirQuery,
  generateResourceGraph,
  SmartAuthSession,
  FHIRBundle
} from '../../.gemini/skills/FhirInteroperabilityEngine';

export default function FhirInteroperabilitySimulator() {
  const presets = useMemo(() => getClinicalPresets(), []);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0].id);
  const currentPreset = useMemo(
    () => presets.find(p => p.id === selectedPresetId) || presets[0],
    [presets, selectedPresetId]
  );

  const [activeTab, setActiveTab] = useState<
    'visual-graph' | 'bundle-inspector' | 'smart-oauth' | 'hl7v2-transformer' | 'rest-console'
  >('visual-graph');

  // Graph state
  const resourceGraph = useMemo(
    () => generateResourceGraph(currentPreset.bundle),
    [currentPreset.bundle]
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // SMART on FHIR state
  const [smartClientId, setSmartClientId] = useState('mediverse-cds-client-v2');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'launch/patient',
    'openid',
    'profile',
    'patient/Patient.read',
    'patient/Observation.read',
    'patient/Condition.read'
  ]);
  const [authSession, setAuthSession] = useState<SmartAuthSession>(() =>
    simulateSmartOnFhirAuth(smartClientId, selectedScopes, currentPreset.bundle.entry[0].resource.id)
  );

  // HL7 v2 transformer state
  const [rawHl7Input, setRawHl7Input] = useState<string>(currentPreset.rawHl7v2);
  const transformedResult = useMemo(() => parseHl7v2ToFhir(rawHl7Input), [rawHl7Input]);

  // REST Console state
  const [restQuery, setRestQuery] = useState('Observation?category=vital-signs');
  const [queryResult, setQueryResult] = useState(() =>
    executeFhirQuery(currentPreset.bundle, 'Observation?category=vital-signs')
  );

  // UI toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyJson = (obj: any, label: string) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    showToast(`${label} copied to clipboard!`);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentPreset.bundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentPreset.id}-fhir-bundle.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('FHIR Bundle JSON downloaded!');
  };

  const handleScopeToggle = (scope: string) => {
    setSelectedScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  const handleGenerateSmartToken = () => {
    const session = simulateSmartOnFhirAuth(
      smartClientId,
      selectedScopes,
      currentPreset.bundle.entry[0].resource.id
    );
    setAuthSession(session);
    showToast('SMART OAuth 2.0 token issued successfully!');
  };

  const handleExecuteRestQuery = (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : restQuery;
    const res = executeFhirQuery(currentPreset.bundle, q);
    setQueryResult(res);
  };

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    const entry = currentPreset.bundle.entry.find(e => e.resource.id === selectedNodeId);
    return entry?.resource || null;
  }, [selectedNodeId, currentPreset.bundle]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl border border-emerald-400/30 flex items-center gap-2 text-sm animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          {toastMessage}
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Track C1 &bull; Health Informatics &amp; Interoperability
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                HL7 FHIR Release 4 (v4.0.1)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                US Core / USCDI Compliant
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              FHIR R4 &amp; HL7 Interoperability Gateway &amp; EHR Sandbox
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Standardized healthcare data engineering workstation. Explore clinical FHIR bundles, simulate
              SMART on FHIR OAuth 2.0 authorization, bridge legacy HL7 v2.x pipe-delimited feeds into modern JSON
              graphs, and execute real-time REST queries against LOINC, SNOMED-CT, and RxNorm ontologies.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full lg:w-auto">
            <button
              onClick={() => handleCopyJson(currentPreset.bundle, 'FHIR Bundle')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition shadow-sm"
            >
              <Copy className="w-4 h-4 text-blue-400" />
              Copy JSON
            </button>
            <button
              onClick={handleExportJson}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition"
            >
              <Download className="w-4 h-4" />
              Export Bundle
            </button>
          </div>
        </div>

        {/* Clinical Profile Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
            Select Patient Clinical Preset:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {presets.map(p => {
              const isSelected = p.id === currentPreset.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPresetId(p.id);
                    setRawHl7Input(p.rawHl7v2);
                    setSelectedNodeId(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition relative ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/70 shadow-md shadow-blue-900/20'
                      : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{p.patientName}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        p.encounterType === 'IMP'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : p.encounterType === 'EMER'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {p.encounterType === 'IMP'
                        ? 'Inpatient ICU'
                        : p.encounterType === 'EMER'
                        ? 'Emergency ED'
                        : 'Outpatient AMB'}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-300 line-clamp-1">{p.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.keyFinding}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('visual-graph')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'visual-graph'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Network className="w-4 h-4" />
          Resource Graph Network
        </button>

        <button
          onClick={() => setActiveTab('bundle-inspector')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'bundle-inspector'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileCode className="w-4 h-4" />
          FHIR R4 JSON Bundle ({currentPreset.bundle.entry.length})
        </button>

        <button
          onClick={() => setActiveTab('smart-oauth')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'smart-oauth'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Lock className="w-4 h-4" />
          SMART on FHIR OAuth 2.0
        </button>

        <button
          onClick={() => setActiveTab('hl7v2-transformer')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'hl7v2-transformer'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Terminal className="w-4 h-4" />
          HL7 v2.x to FHIR Transformer
        </button>

        <button
          onClick={() => setActiveTab('rest-console')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            activeTab === 'rest-console'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Code2 className="w-4 h-4" />
          REST API Query Console
        </button>
      </div>

      {/* Tab 1: Visual Resource Graph */}
      {activeTab === 'visual-graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white">Interactive FHIR Resource Topology</h2>
                </div>
                <span className="text-xs text-slate-400">Click any node to inspect ontology bindings</span>
              </div>

              {/* Node Legend */}
              <div className="flex flex-wrap gap-2.5 mb-5 text-[11px]">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <span className="w-2 h-2 rounded-full bg-blue-400" /> Patient
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <span className="w-2 h-2 rounded-full bg-purple-400" /> Encounter
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Condition (SNOMED)
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Observation (LOINC)
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/30">
                  <span className="w-2 h-2 rounded-full bg-pink-400" /> MedicationRequest (RxNorm)
                </span>
              </div>

              {/* Graph Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
                {resourceGraph.nodes.map(node => {
                  const isSelected = selectedNodeId === node.id;
                  let colorClasses = 'border-slate-700 bg-slate-800/40 text-slate-300';
                  if (node.resourceType === 'Patient')
                    colorClasses = isSelected
                      ? 'border-blue-500 bg-blue-950/60 text-blue-200 ring-2 ring-blue-500/50'
                      : 'border-blue-500/40 bg-blue-950/20 text-blue-300 hover:border-blue-500';
                  else if (node.resourceType === 'Encounter')
                    colorClasses = isSelected
                      ? 'border-purple-500 bg-purple-950/60 text-purple-200 ring-2 ring-purple-500/50'
                      : 'border-purple-500/40 bg-purple-950/20 text-purple-300 hover:border-purple-500';
                  else if (node.resourceType === 'Condition')
                    colorClasses = isSelected
                      ? 'border-amber-500 bg-amber-950/60 text-amber-200 ring-2 ring-amber-500/50'
                      : 'border-amber-500/40 bg-amber-950/20 text-amber-300 hover:border-amber-500';
                  else if (node.resourceType === 'Observation')
                    colorClasses = isSelected
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/50'
                      : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:border-emerald-500';
                  else if (node.resourceType === 'MedicationRequest')
                    colorClasses = isSelected
                      ? 'border-pink-500 bg-pink-950/60 text-pink-200 ring-2 ring-pink-500/50'
                      : 'border-pink-500/40 bg-pink-950/20 text-pink-300 hover:border-pink-500';

                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${colorClasses}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/60">
                          {node.label}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">#{node.id}</span>
                      </div>
                      <div className="text-xs font-medium leading-snug">{node.summary}</div>
                      <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        Reference: {node.category}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Edge Summary */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>{resourceGraph.nodes.length} FHIR Resources connected via {resourceGraph.edges.length} reference links</span>
              <span className="font-mono text-slate-400">USCDI v3 Validated</span>
            </div>
          </div>

          {/* Node Inspector Detail Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Resource Inspector
                </h3>
                {selectedNodeData && (
                  <button
                    onClick={() => handleCopyJson(selectedNodeData, selectedNodeData.resourceType)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                )}
              </div>

              {selectedNodeData ? (
                <div className="space-y-3.5">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-[11px] text-slate-400">Resource Type:</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      {selectedNodeData.resourceType}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">ID: {selectedNodeData.id}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-300">Raw Resource Payload:</div>
                    <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-blue-300 overflow-x-auto max-h-[320px] scrollbar-thin">
                      {JSON.stringify(selectedNodeData, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Network className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-sm font-medium">No resource selected</div>
                  <p className="text-xs">Click any resource node in the topology to inspect its full JSON schema and coding.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Profiles: HL7 US Core Implementation Guide (STU 5.0.1)
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bundle JSON Inspector */}
      {activeTab === 'bundle-inspector' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-400" />
                FHIR R4 Bundle Payload
              </h2>
              <div className="text-xs text-slate-400">
                Type: <span className="font-mono text-blue-400">collection</span> &bull; Total Resources:{' '}
                <span className="font-mono text-emerald-400">{currentPreset.bundle.entry.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyJson(currentPreset.bundle, 'Complete Bundle')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Full Bundle
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-[520px] leading-relaxed scrollbar-thin">
              {JSON.stringify(currentPreset.bundle, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: SMART on FHIR OAuth 2.0 Playground */}
      {activeTab === 'smart-oauth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">OAuth 2.0 / OIDC Launch Context</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">SMART Client ID:</label>
                <input
                  type="text"
                  value={smartClientId}
                  onChange={e => setSmartClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Patient Context (Launch):</label>
                <input
                  type="text"
                  disabled
                  value={currentPreset.bundle.entry[0].resource.id}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">Requested SMART Scopes:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'launch/patient',
                    'openid',
                    'profile',
                    'patient/Patient.read',
                    'patient/Observation.read',
                    'patient/Condition.read',
                    'patient/MedicationRequest.read',
                    'patient/*.read'
                  ].map(sc => {
                    const checked = selectedScopes.includes(sc);
                    return (
                      <label
                        key={sc}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                          checked
                            ? 'bg-blue-950/40 border-blue-500/60 text-blue-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleScopeToggle(sc)}
                          className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                        />
                        <span className="font-mono text-[11px]">{sc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleGenerateSmartToken}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition"
              >
                <Zap className="w-4 h-4" />
                Simulate SMART App Launch Token Exchange
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Decoded JWT Access Token &amp; Claims
              </h3>
              <button
                onClick={() => handleCopyJson(authSession, 'SMART Session')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">Bearer Token:</div>
                <div className="font-mono text-[11px] text-emerald-400 truncate">
                  Bearer {authSession.accessToken}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-300">Decoded Claims Payload:</div>
                <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto max-h-[300px] scrollbar-thin">
                  {JSON.stringify(authSession.decodedClaims, null, 2)}
                </pre>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="text-white font-medium">OAuth 2.0 Verification Details:</div>
                <div>&bull; Audience (aud): <span className="font-mono text-slate-300">https://api.mediverse.org/fhir/r4</span></div>
                <div>&bull; Scopes Granted: <span className="font-mono text-emerald-400">{authSession.scope}</span></div>
                <div>&bull; Lifetime: <span className="font-mono text-slate-300">{authSession.expiresIn} seconds</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: HL7 v2 to FHIR Transformer */}
      {activeTab === 'hl7v2-transformer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">Legacy HL7 v2.x Message Feeder</h2>
              </div>
              <button
                onClick={() => setRawHl7Input(currentPreset.rawHl7v2)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Reset to Preset
              </button>
            </div>

            <textarea
              value={rawHl7Input}
              onChange={e => setRawHl7Input(e.target.value)}
              rows={11}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-amber-200 focus:outline-none focus:border-blue-500 leading-relaxed scrollbar-thin"
              placeholder="Paste raw HL7 v2 pipe-delimited message here..."
            />

            {/* Parsed Segments Table */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Parsed Segments ({transformedResult.parsedSegments.length}):</div>
              <div className="max-h-[160px] overflow-y-auto space-y-1 pr-1">
                {transformedResult.parsedSegments.map((seg, idx) => (
                  <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono flex items-center justify-between">
                    <span className="font-bold text-amber-400">{seg.segment}</span>
                    <span className="text-slate-400 truncate max-w-[280px] sm:max-w-[400px]">
                      {seg.fields.slice(1, 5).join(' | ')}
                    </span>
                    <span className="text-slate-400">{seg.fields.length} fields</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Transformed FHIR R4 Bundle
              </h3>
              <button
                onClick={() => handleCopyJson(transformedResult.bundle, 'Transformed FHIR')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>

            {transformedResult.errors.length > 0 && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-400" /> Parsing Errors:
                </div>
                {transformedResult.errors.map((err, i) => (
                  <div key={i}>&bull; {err}</div>
                ))}
              </div>
            )}

            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[420px] scrollbar-thin">
              {JSON.stringify(transformedResult.bundle, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 5: REST API Query Console */}
      {activeTab === 'rest-console' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">FHIR RESTful Search &amp; Filter Client</h2>
          </div>

          {/* Query Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-emerald-400 font-mono">
              GET
            </div>
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">
                /fhir/r4/
              </span>
              <input
                type="text"
                value={restQuery}
                onChange={e => setRestQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExecuteRestQuery()}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-24 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                placeholder="Observation?category=vital-signs"
              />
            </div>
            <button
              onClick={() => handleExecuteRestQuery()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
            >
              Send
            </button>
          </div>

          {/* Quick Query Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">Quick Filters:</span>
            {[
              'Observation',
              'Observation?category=vital-signs',
              'Observation?category=laboratory',
              'Condition',
              'Condition?clinical-status=active',
              'MedicationRequest',
              'Patient'
            ].map(q => (
              <button
                key={q}
                onClick={() => {
                  setRestQuery(q);
                  handleExecuteRestQuery(q);
                }}
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-mono rounded-md border border-slate-700 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Response Box */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                  {queryResult.status} {queryResult.statusText}
                </span>
                <span className="text-slate-400">Latency: <span className="text-slate-300 font-mono">{queryResult.responseTimeMs} ms</span></span>
                <span className="text-slate-400">Matched Resources: <span className="text-emerald-400 font-mono">{queryResult.totalMatches}</span></span>
              </div>
              <button
                onClick={() => handleCopyJson(queryResult.resources, 'Query Results')}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Matches
              </button>
            </div>

            <pre className="font-mono text-xs text-blue-300 overflow-x-auto max-h-[380px] scrollbar-thin leading-relaxed">
              {JSON.stringify(queryResult.resources, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
