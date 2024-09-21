const { nodeEnv } = useRuntimeConfig();

export const cookieOptions = {
  signed: false,
  secure: nodeEnv === 'prod',
  path: '/',
  httpOnly: true,
};
