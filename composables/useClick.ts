export function useClick (elementRef: Ref<Element | null>): { isActive: Ref<boolean>, setInactive: () => void } {
  const isActive = ref(false);

  let overrideDefaultBehavior = false;
  let isInsideClicked = false;
  function clickOutsideHandler () {
    if (overrideDefaultBehavior) {
      overrideDefaultBehavior = false;
      return;
    }
    if (!isInsideClicked) isActive.value = false;
    isInsideClicked = false;
  };
  function clickInsideHandler () {
    if (overrideDefaultBehavior) return;
    isActive.value = true;
    isInsideClicked = true;
  };

  onMounted(() => document.addEventListener('click', clickOutsideHandler));
  onUnmounted(() => document.removeEventListener('click', clickOutsideHandler));
  onMounted(() => elementRef.value?.addEventListener('click', clickInsideHandler));
  onBeforeUnmount(() => elementRef.value?.removeEventListener('click', clickInsideHandler));

  function setInactive () {
    isActive.value = false;
    overrideDefaultBehavior = true;
  }

  return { isActive, setInactive };
}
