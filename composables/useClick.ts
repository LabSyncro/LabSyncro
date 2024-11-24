export function useClick (elementRef: Ref<Element>): { isActive: Ref<boolean>, setInactive: () => void } {
  const isActive = ref(false);
  let isInsideClicked = false;
  function clickOutsideHandler () {
    if (!isInsideClicked) isActive.value = false;
    isInsideClicked = false;
  };
  function clickInsideHandler () {
    isActive.value = true;
    isInsideClicked = true;
  };

  onMounted(() => document.addEventListener('click', clickOutsideHandler));
  onUnmounted(() => document.removeEventListener('click', clickOutsideHandler));
  onMounted(() => elementRef.value.addEventListener('click', clickInsideHandler));
  onBeforeUnmount(() => elementRef.value.removeEventListener('click', clickInsideHandler));

  function setInactive () {
    isActive.value = false;
  }

  return { isActive, setInactive };
}
