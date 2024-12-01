export function useVirtualKeyboardDetection (
  onDetect: (input: string, type?: 'userId' | 'device') => void,
  options: {
    userId?: {
      length?: number;
      thresholdMs?: number;
    };
    device?: { thresholdMs?: number };
  } = {},
) {
  let currentInput = '';
  const keyTimes: number[] = [];
  let start: number = 0;
  let inputType: 'userId' | 'device' | null = null;
  const deviceRegex = /^https?:\/\/[^\/]+\/devices\/\d{8}\?id=[a-fA-F0-9]+$/;

  const defaultOptions = {
    userId: { length: 7, thresholdMs: 25 },
    deviceId: { thresholdMs: 25 },
  };

  const mergedOptions = {
    userId: { ...defaultOptions.userId, ...options.userId },
    deviceId: { ...defaultOptions.deviceId, ...options.device },
  };

  const handleKeyDown = (_e: KeyboardEvent): void => {
    start = new Date().getTime();
  };

  const handleKeyUp = (e: KeyboardEvent): void => {
    const keyTime = new Date().getTime() - start;
    keyTimes.push(keyTime);
    currentInput += e.key;

    if (currentInput.length === mergedOptions.userId.length) {
      const avgKeyTime =
        keyTimes.reduce((sum, time) => sum + time, 0) / keyTimes.length;

      if (avgKeyTime < mergedOptions.userId.thresholdMs) {
        inputType = 'userId';
        onDetect(currentInput, inputType);
        cleanupListeners();
        return;
      }
    }

    if (deviceRegex.test(currentInput)) {
      const avgKeyTime =
        keyTimes.reduce((sum, time) => sum + time, 0) / keyTimes.length;

      if (avgKeyTime < mergedOptions.deviceId.thresholdMs) {
        inputType = 'device';
        onDetect(currentInput, inputType);
        cleanupListeners();
        return;
      }
    }
  };

  const setupListeners = (): void => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  };

  const cleanupListeners = (): void => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  };

  onMounted(setupListeners);
  onUnmounted(cleanupListeners);
}
