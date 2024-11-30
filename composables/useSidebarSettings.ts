export const useSidebarSettings = () => {
  const activeSidebar = useState<'simple' | 'detailed'>(
    'sidebar-active',
    () => 'simple',
  );
  const activeSection = useState<string>('sidebar-section', () => '');

  return {
    activeSidebar,
    activeSection,
  };
};
