import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

export class CorrelationIdMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = req.header('x-correlation-id') ?? randomUUID();

    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    next();
  }
}
