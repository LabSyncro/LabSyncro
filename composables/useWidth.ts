export function useWidth (elemRef: Ref<HTMLDivElement | null>): Ref<number | null> {
  const width = ref<number | null>(null);
  function updateWidth () {
    if (!elemRef.value) {
      width.value = null;
      return;
    }
    width.value = elemRef.value!.offsetWidth;
  }
  onMounted(() => updateWidth());
  onMounted(() => document.defaultView!.addEventListener('resize', updateWidth));
  onUnmounted(() => document.defaultView!.removeEventListener('resize', updateWidth));

  return width;
}
