export const useLab = () => {
  const lab = useState<{ id: string }>('lab', () => ({
    id: '16824ad6-5ffd-4c90-80d2-a1d70f068cf1',
  }));

  return {
    lab,
  };
};
