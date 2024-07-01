import { Request, Response } from 'express';
import {
    databaseService,
    Row,
} from '../../../services/database/databaseService';
import { TYPES } from 'tedious';
import { Endpoint } from './endpoint';

interface Data {
    isbn: number;
    title: string;
    first_name: string;
    surname: string;
    due: Date;
}

export default class getLoansForUserId {
    static query = `
        SELECT
            book.isbn,
            book.title,
            [user].first_name,
            [user].surname,
            loan.due
        FROM
            [user]
        INNER JOIN loan
            ON ([user].id = loan.user_id)
        INNER JOIN copy
            ON (loan.copy_id = copy.id)
        INNER JOIN book
            ON (copy.isbn = book.isbn)
        WHERE
            (
                @userId = [user].id
            OR @userId IS NULL
            )
        GROUP BY
            book.isbn, book.title, loan.due, [user].first_name, [user].surname;
    `;

    static rowParser = (row: Row): Data => {
        return {
            isbn: databaseService.getProperty(row, 'isbn'),
            title: databaseService.getProperty(row, 'title'),
            first_name: databaseService.getProperty(row, 'first_name'),
            surname: databaseService.getProperty(row, 'surname'),
            due: databaseService.getProperty(row, 'due'),
        };
    };

    static async handler(req: Request, res: Response) {
        const request = await databaseService.createNewRequest(this.query);

        request.addParameter('userId', TYPES.Int, req.params.id);

        const data: Data[] = await databaseService.executeQuery(
            request,
            this.rowParser,
        );

        return res.status(200).json(data);
    }
}
