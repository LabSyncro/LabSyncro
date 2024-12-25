export const useSidebar = () => {
  const isOpen = useState<boolean>('sidebar-open', () => false);

  const openSidebar = () => {
    isOpen.value = true;
  };

  const closeSidebar = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    openSidebar,
    closeSidebar,
  };
};
