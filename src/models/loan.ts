class Loan {
    id: number;
    copy_id: number;
    user_id: number;
    due: Date;

    constructor(id: number, copy_id: number, user_id: number, due: Date) {
        this.id = id;
        this.copy_id = copy_id;
        this.user_id = user_id;
        this.due = due;
    }
}
export default Loan;
