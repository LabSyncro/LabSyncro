export const useSidebar = () => {
  const activeSidebar = ref<'simple' | 'detailed'>('simple');
  const activeSection = ref<string>('');

  const toggleSidebar = () => {
    activeSidebar.value =
      activeSidebar.value === 'simple' ? 'detailed' : 'simple';
  };

  return {
    activeSidebar,
    activeSection,
    toggleSidebar,
  };
};
