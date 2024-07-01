import { Router, Request, Response } from 'express';
import DatabaseService from '../services/databaseService';
import Book from '../models/book';

class BookController {
    router: Router;
    db: typeof DatabaseService;

    constructor() {
        this.db = DatabaseService;

        this.router = Router();
        this.router.get('/:id', this.getBook.bind(this));

        this.router.post('/', this.createBook.bind(this));

        this.router.get('/', this.getAllBooks.bind(this));
    }

    getBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    async getAllBooks(req: Request, res: Response) {
        const data: Book[] = await this.db.executeQuery(
            'SELECT * FROM book;',
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
