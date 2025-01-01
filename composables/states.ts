export const useLab = () => {
  const lab = useState<{ id: string }>('lab', () => ({
    id: 'c44dbb4c-9a28-4dc7-bb5e-79f112ad8412',
  }));

  return {
    lab,
  };
};
