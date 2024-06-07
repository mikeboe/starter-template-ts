import { Request, Response, NextFunction } from 'express';
import * as statusService from '../../services/status/statusService';
import Logger from '../../lib/logger';

export async function getStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await statusService.getStatus();
        res.json({ data });
    } catch (error: unknown) {
        Logger.error('Error while getting status ', (error as Error).message);
        next(error as Error);
    }
}