import { NextFunction, Request, Response } from 'express';

import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};