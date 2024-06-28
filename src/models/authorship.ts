class Authorship {
    id: number;
    author_id: number;
    book_isbn: string;

    constructor(id: number, author_id: number, book_isbn: string) {
        this.id = id;
        this.author_id = author_id;
        this.book_isbn = book_isbn;
    }
}
