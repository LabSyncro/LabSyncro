export function useVirtualKeyboardDetection (
  onDetect: (input: string, type?: 'userId' | 'device') => void,
  options: {
    userId?: {
      length?: number;
    };
    device?: {
      pattern?: RegExp;
    };
    scannerThresholdMs?: number;
    maxInputTimeMs?: number;
  } = {},
) {
  let currentInput = '';
  let startTime: number = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  const defaultDeviceRegex =
    /^https?:\/\/[^/]+\/devices\/\d{8}\?id=[a-fA-F0-9]+$/;

  const defaultOptions = {
    userId: {
      length: 7,
    },
    device: {
      pattern: defaultDeviceRegex,
    },
    scannerThresholdMs: 100,
    maxInputTimeMs: 1000,
  };

  const mergedOptions = {
    userId: { ...defaultOptions.userId, ...options.userId },
    device: {
      pattern: options.device?.pattern || defaultOptions.device.pattern,
    },
    scannerThresholdMs:
      options.scannerThresholdMs ?? defaultOptions.scannerThresholdMs,
    maxInputTimeMs: options.maxInputTimeMs ?? defaultOptions.maxInputTimeMs,
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (currentInput.length === 0) {
      startTime = new Date().getTime();
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (e.key.length === 1) {
      currentInput += e.key;
    }

    timeoutId = setTimeout(() => {
      const totalTime = new Date().getTime() - startTime;

      if (totalTime > mergedOptions.maxInputTimeMs) {
        resetDetection();
        return;
      }

      if (mergedOptions.device.pattern.test(currentInput)) {
        onDetect(currentInput, 'device');
        resetDetection();
        return;
      }

      if (
        currentInput.length === mergedOptions.userId.length &&
        /^\d+$/.test(currentInput)
      ) {
        onDetect(currentInput, 'userId');
        resetDetection();
        return;
      }

      resetDetection();
    }, mergedOptions.scannerThresholdMs);
  };

  const resetDetection = (): void => {
    currentInput = '';
    startTime = 0;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const setupListeners = (): void => {
    document.addEventListener('keydown', handleKeyDown);
  };

  const cleanupListeners = (): void => {
    document.removeEventListener('keydown', handleKeyDown);
    resetDetection();
  };

  onMounted(setupListeners);
  onUnmounted(cleanupListeners);

  return {
    cleanup: cleanupListeners,
  };
}
