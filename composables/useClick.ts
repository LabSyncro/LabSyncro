export function useClick(elementRef: Ref<Element>): { isActive: Ref<boolean> } {
  const isActive = ref(false);
  const clickOutsideHandler = () => {
    isActive.value = false;
  };
  const clickInsideHandler = (event: Event) => {
    event.stopPropagation();
    isActive.value = true;
  };

  onMounted(() => document.addEventListener('click', clickOutsideHandler));
  onUnmounted(() => document.removeEventListener('click', clickOutsideHandler));
  onMounted(() => elementRef.value.addEventListener('click', clickInsideHandler));
  onUnmounted(() => elementRef.value.removeEventListener('click', clickInsideHandler));

  return { isActive };
}
