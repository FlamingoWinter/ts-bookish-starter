import { Router, Request, Response } from 'express';
import DatabaseService from '../services/databaseService';
import Book from '../models/book';
import { Request as TediousRequest, TYPES } from 'tedious';

class BookController {
    router: Router;
    db: typeof DatabaseService;

    constructor() {
        this.db = DatabaseService;

        this.router = Router();
        this.router.get('/:id', this.getBook.bind(this));

        this.router.get('/:id/loans', this.getLoansFromId.bind(this));

        // this.router.get('/:isbn/loans', this.getLoansFromIsbn.bind(this));

        this.router.post('/', this.createBook.bind(this));

        this.router.get('/', this.getAllBooks.bind(this));
    }

    getBook(req: Request, res: Response) {
        const id = req.params.id;
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    async getLoansFromId(req: Request, res: Response) {
        const query = `
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
                        UPPER(@userId) = UPPER([user].id)
                            OR @userId IS NULL
                        )
                GROUP BY
                    book.isbn, book.title, loan.due, [user].first_name, [user].surname;
                `;

        const request = await DatabaseService.createNewRequest(query);

        request.addParameter('userId', TYPES.Int, req.params.id);

        type Row = {
            isbn: number;
            title: string;
            first_name: string;
            surname: string;
            due: Date;
        };

        const data: Row[] = await this.db.executeQuery(request, (row): Row => {
            return {
                isbn: row.filter((x) => x.metadata.colName === 'isbn')[0].value,
                title: row.filter((x) => x.metadata.colName === 'title')[0]
                    .value,
                first_name: row.filter(
                    (x) => x.metadata.colName === 'first_name',
                )[0].value,
                surname: row.filter((x) => x.metadata.colName === 'surname')[0]
                    .value,
                due: row.filter((x) => x.metadata.colName === 'due')[0].value,
            };
        });

        return res.status(200).json(data);
    }
    async getloansFromIsbn(req: Request, res: Response) {
        const query = `
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
                        UPPER(@userId) = UPPER([user].id)
                            OR @userId IS NULL
                        )
                GROUP BY
                    book.isbn, book.title, loan.due, [user].first_name, [user].surname;
                `;

        const request = await DatabaseService.createNewRequest(query);

        request.addParameter('userId', TYPES.Int, req.params.id);

        type Row = {
            isbn: number;
            title: string;
            first_name: string;
            surname: string;
            due: Date;
        };

        const data: Row[] = await this.db.executeQuery(request, (row): Row => {
            return {
                isbn: row.filter((x) => x.metadata.colName === 'isbn')[0].value,
                title: row.filter((x) => x.metadata.colName === 'title')[0]
                    .value,
                first_name: row.filter(
                    (x) => x.metadata.colName === 'first_name',
                )[0].value,
                surname: row.filter((x) => x.metadata.colName === 'surname')[0]
                    .value,
                due: row.filter((x) => x.metadata.colName === 'due')[0].value,
            };
        });

        return res.status(200).json(data);
    }

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    async getAllBooks(req: Request, res: Response) {
        const query = `          
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

        const request = await DatabaseService.createNewRequest(query);

        request.addParameter('author', TYPES.NVarChar, req.query.author);
        request.addParameter('title', TYPES.NVarChar, req.query.title);

        const data: Book[] = await this.db.executeQuery(
            request,
            (row): Book => {
                return new Book(
                    row.filter((x) => x.metadata.colName === 'isbn')[0].value,
                    row.filter((x) => x.metadata.colName === 'title')[0].value,
                );
            },
        );

        return res.status(200).json(data);
    }
}

export default new BookController().router;
