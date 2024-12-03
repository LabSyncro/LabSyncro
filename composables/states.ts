export const useLab = () => {
  const lab = useState<{ id: string }>('lab', () => ({
    id: '015bd698-f8fb-4672-a43e-4e6fa64305ea',
  }));

  return {
    lab,
  };
};
