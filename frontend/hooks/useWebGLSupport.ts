import { useState, useEffect } from 'react';

interface WebGLSupportResult {
  supported: boolean;
  version: 'webgl2' | 'webgl' | 'none';
  reason: string;
}

export function useWebGLSupport(): WebGLSupportResult {
  const [result, setResult] = useState<WebGLSupportResult>({
    supported: true,
    version: 'webgl2',
    reason: 'Checking...'
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const canvas = document.createElement('canvas');
      const gl2 = canvas.getContext('webgl2');
      if (gl2) {
        setResult({ supported: true, version: 'webgl2', reason: 'WebGL 2.0 supported' });
        return;
      }
      const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl1) {
        setResult({ supported: true, version: 'webgl', reason: 'WebGL 1.0 supported (limited features)' });
        return;
      }
      setResult({ supported: false, version: 'none', reason: 'WebGL not supported on this device or browser' });
    } catch (e) {
      setResult({ supported: false, version: 'none', reason: 'WebGL context creation failed' });
    }
  }, []);

  return result;
}
