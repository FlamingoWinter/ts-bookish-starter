import { Request, Response } from 'express';
import {
    databaseService,
    Row,
} from '../../../services/database/databaseService';
import { TYPES } from 'tedious';
import Book from '../../../models/book';
import { Endpoint } from './endpoint';

export default class GetAllBooks {
    static query = `          
            SELECT
                book.isbn,
                book.title
            FROM
                book
                INNER JOIN authorship
                    ON (book.isbn = authorship.book_isbn)
                INNER JOIN author
                    ON (authorship.author_id = author.id)
            WHERE
                    (
                           UPPER(@title) = UPPER(book.title)
                        OR @title IS NULL
                    )
                AND (
                           UPPER(@author) = CONCAT(UPPER(author.first_name), ' ', UPPER(author.surname))
                        OR @author IS NULL
                    )
            GROUP BY
                book.isbn,
                book.title
        `;

    static rowParser = (row: Row): Book => {
        return new Book(
            databaseService.getProperty(row, 'isbn'),
            databaseService.getProperty(row, 'title'),
        );
    };

    public static async handler(req: Request, res: Response) {
        const request = await databaseService.createNewRequest(this.query);

        request.addParameter('author', TYPES.NVarChar, req.query.author);
        request.addParameter('title', TYPES.NVarChar, req.query.title);

        const data: Book[] = await databaseService.executeQuery(
            request,
            this.rowParser,
        );

        return res.status(200).json(data);
    }
}
