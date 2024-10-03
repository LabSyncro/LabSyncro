export function useClick (refName: string) {
  const isActive = ref(false);
  const eventListener = ref(undefined);

  const elementRef = useTemplateRef(refName);

  function toggleActive (event: MouseEvent) {
    isActive.value = !isActive.value;
    event.stopPropagation();
  }
  
  function resetActive () {
    isActive.value = false;
  }

  onMounted(
    () => {
      eventListener.value = (elementRef.value as any)?.addEventListener('click', toggleActive);
      document.addEventListener('click', resetActive);
    },
  );
  onBeforeUnmount(
    () => {
      (elementRef.value as any).removeEventListener('click', toggleActive);
      document.removeEventListener('click', resetActive);
    },
  );

  return { isActive };
}
