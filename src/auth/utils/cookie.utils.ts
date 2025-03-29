import { Response } from 'express';

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/auth/refresh',
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refresh_token', token, REFRESH_TOKEN_COOKIE_OPTIONS);
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refresh_token', { path: '/auth/refresh' });
};
