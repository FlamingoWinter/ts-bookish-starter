import { Request, Response } from 'express';
import { Row } from '../../../services/database/databaseService';

export interface Endpoint<T> {
    query: string;
    rowParser(row: Row): T;
    handler(req: Request, res: Response): ExpressResponse;
}

type ExpressResponse = Promise<Response<any, Record<string, any>>>;
