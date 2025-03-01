export function useVirtualKeyboardDetection (
  onDetect: (input: string, type?: 'userId' | 'device' | 'oneTimeQr') => Promise<void> | void,
  options: {
    userId?: {
      length?: number;
    };
    device?: {
      pattern?: RegExp;
    };
    oneTimeQr?: {
      pattern?: RegExp;
    };
    scannerThresholdMs?: number;
    maxInputTimeMs?: number;
  } = {},
) {
  let currentInput = '';
  let startTime: number = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  let isProcessing = false;
  const defaultDeviceRegex =
    /^https?:\/\/[^/]+\/devices\/[a-fA-F0-9]{8}\?id=[a-fA-F0-9]+$/;

  const defaultOptions = {
    userId: {
      length: 7,
    },
    device: {
      pattern: defaultDeviceRegex,
    },
    oneTimeQr: {
      pattern: /^\{"token":"[0-9]{6}","userId":"[0-9]{7}"/,
    },
    scannerThresholdMs: 100,
    maxInputTimeMs: 1000,
  };

  const mergedOptions = {
    userId: { ...defaultOptions.userId, ...options.userId },
    device: {
      pattern: options.device?.pattern || defaultOptions.device.pattern,
    },
    oneTimeQr: {
      pattern: options.oneTimeQr?.pattern || defaultOptions.oneTimeQr.pattern,
    },
    scannerThresholdMs:
      options.scannerThresholdMs ?? defaultOptions.scannerThresholdMs,
    maxInputTimeMs: options.maxInputTimeMs ?? defaultOptions.maxInputTimeMs,
  };

  const handleDetection = async (input: string, type: 'userId' | 'device' | 'oneTimeQr') => {
    if (isProcessing) return;

    try {
      isProcessing = true;
      await onDetect(input, type);
    } catch (error) {
      throw new Error(`Error in virtual keyboard detection callback: ${error}`);
    } finally {
      isProcessing = false;
    }
  };

  const handleKeyDown = (e: KeyboardEvent): void => {

    if (isProcessing) return;

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
        handleDetection(currentInput, 'device');
        resetDetection();
        return;
      }

      if (
        currentInput.length === mergedOptions.userId.length &&
        /^\d+$/.test(currentInput)
      ) {
        handleDetection(currentInput, 'userId');
        resetDetection();
        return;
      }

      if (mergedOptions.oneTimeQr.pattern.test(currentInput)) {
        handleDetection(currentInput, 'oneTimeQr');
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
