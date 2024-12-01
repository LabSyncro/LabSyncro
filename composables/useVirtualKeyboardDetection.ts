export function useVirtualKeyboardDetection (
  onDetect: (input: string) => void,
  inputLength = 7,
  thresholdMs = 25,
) {
  let currentInput = '';
  const keyTimes: number[] = [];
  let start: number = 0;

  const handleKeyDown = (_e: KeyboardEvent): void => {
    start = new Date().getTime();
  };

  const handleKeyUp = (e: KeyboardEvent): void => {
    const keyTime = new Date().getTime() - start;
    keyTimes.push(keyTime);
    currentInput += e.key;

    if (currentInput.length === inputLength) {
      const avgKeyTime =
        keyTimes.reduce((sum, time) => sum + time, 0) / keyTimes.length;

      if (avgKeyTime < thresholdMs) {
        onDetect(currentInput);
        cleanupListeners();
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
