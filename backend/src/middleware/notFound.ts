import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/types';

export const notFound = (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
};
