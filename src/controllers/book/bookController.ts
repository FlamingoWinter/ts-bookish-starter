import { Router, Request, Response } from 'express';
import GetLoansForUserId from './endpoints/getLoansForUserId';
import GetAllBooks from './endpoints/getAllBooks';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();

        this.router.get('/', GetAllBooks.handler.bind(this));
        this.router.get('/:id/loans', GetLoansForUserId.handler.bind(this));

        // // this.router.get('/:isbn/loans', this.getLoansFromIsbn.bind(this));
        // this.router.post('/', this.createBook.bind(this));
    }

    async getloansFromIsbn(req: Request, res: Response) {
        //TODO
    }
}

export default new BookController().router;
