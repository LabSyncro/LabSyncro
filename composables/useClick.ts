export function useClick(elementRef: Ref<Element>): { isActive: Ref<boolean> } {
  const isActive = ref(false);
  let isInsideClicked = false;
  function clickOutsideHandler () {
    if (!isInsideClicked) isActive.value = false;
    isInsideClicked = false;
  };
  function clickInsideHandler () {
    isInsideClicked = true;
  };

  onMounted(() => document.addEventListener('click', clickOutsideHandler));
  onUnmounted(() => document.removeEventListener('click', clickOutsideHandler));
  onMounted(() => elementRef.value.addEventListener('click', clickInsideHandler));
  onBeforeUnmount(() => elementRef.value.removeEventListener('click', clickInsideHandler));

  return { isActive };
}
