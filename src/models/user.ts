class User {
    id: number;
    first_name: string;
    surname: string;
    username: string;
    password: string;

    constructor(
        id: number,
        first_name: string,
        surname: string,
        username: string,
        password: string,
    ) {
        this.id = id;
        this.first_name = first_name;
        this.surname = surname;
        this.username = username;
        this.password = password;
    }
}
