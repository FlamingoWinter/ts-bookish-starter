import { Router, Request, Response } from 'express';
import DatabaseService from '../services/databaseService';

class BookController {
    router: Router;
    db: DatabaseService;

    constructor() {
        this.db = DatabaseService.getInstance();

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
        const data = await this.db.executeQuery('SELECT * FROM author');

        // data.map((row) => {new Book()})

        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }
}

export default new BookController().router;
