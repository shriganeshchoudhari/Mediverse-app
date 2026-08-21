import { renderHook } from '@testing-library/react';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';

describe('useWebGLSupport Hook', () => {
  const originalCreateElement = document.createElement.bind(document);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns supported: true and version: "webgl2" when webgl2 context is available', () => {
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      if (tagName.toLowerCase() === 'canvas') {
        return {
          getContext: jest.fn((contextType: string) => {
            if (contextType === 'webgl2') {
              return { isContextLost: () => false };
            }
            return null;
          }),
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName, options);
    });

    const { result } = renderHook(() => useWebGLSupport());

    expect(result.current.supported).toBe(true);
    expect(result.current.version).toBe('webgl2');
    expect(result.current.reason).toBe('WebGL 2.0 supported');
  });

  test('returns supported: true and version: "webgl" when only webgl1 context is available', () => {
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      if (tagName.toLowerCase() === 'canvas') {
        return {
          getContext: jest.fn((contextType: string) => {
            if (contextType === 'webgl' || contextType === 'experimental-webgl') {
              return { isContextLost: () => false };
            }
            return null;
          }),
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName, options);
    });

    const { result } = renderHook(() => useWebGLSupport());

    expect(result.current.supported).toBe(true);
    expect(result.current.version).toBe('webgl');
    expect(result.current.reason).toBe('WebGL 1.0 supported (limited features)');
  });

  test('returns supported: false and version: "none" when canvas.getContext returns null', () => {
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      if (tagName.toLowerCase() === 'canvas') {
        return {
          getContext: jest.fn(() => null),
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName, options);
    });

    const { result } = renderHook(() => useWebGLSupport());

    expect(result.current.supported).toBe(false);
    expect(result.current.version).toBe('none');
    expect(result.current.reason).toBe('WebGL not supported on this device or browser');
  });

  test('returns supported: false and catches exception when context creation fails', () => {
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      if (tagName.toLowerCase() === 'canvas') {
        return {
          getContext: jest.fn(() => {
            throw new Error('GPU process crashed');
          }),
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName, options);
    });

    const { result } = renderHook(() => useWebGLSupport());

    expect(result.current.supported).toBe(false);
    expect(result.current.version).toBe('none');
    expect(result.current.reason).toBe('WebGL context creation failed');
  });
});
