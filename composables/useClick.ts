export function useClick (elementRef: Ref<Element | null>): { isActive: Ref<boolean>, setInactive: () => void, setActive: () => void } {
  const isActive = ref(false);

  let didSomeCallbackRun = false;

  function setActive () {
    if (didSomeCallbackRun) return;
    didSomeCallbackRun = true;
    isActive.value = true;
  }

  function setInactive () {
    if (didSomeCallbackRun) return;
    didSomeCallbackRun = true;
    isActive.value = false;
  }

  function clickInsideHandler () {
    setTimeout(() => {
      if (didSomeCallbackRun) return;
      didSomeCallbackRun = true;
      isActive.value = true;
    }, 0);
  };

  function clickOutsideHandler () {
    setTimeout(() => {
      if (didSomeCallbackRun) {
        didSomeCallbackRun = false;
        return;
      }
      isActive.value = false;
    }, 0);
  };
 
  onMounted(() => document.addEventListener('click', clickOutsideHandler));
  onUnmounted(() => document.removeEventListener('click', clickOutsideHandler));
  onMounted(() => elementRef.value?.addEventListener('click', clickInsideHandler));
  onBeforeUnmount(() => elementRef.value?.removeEventListener('click', clickInsideHandler));

  return { isActive, setInactive, setActive };
}
