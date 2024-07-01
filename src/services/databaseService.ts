import { Connection, ConnectionConfiguration, Request } from 'tedious';

interface RowElement {
    value: any;
    metadata: {
        colName: string;
    };
}

class DatabaseService {
    private DatabaseService() {
        void 0;
    }
    public async createNewRequest(query: string) {
        const request = await new Promise<Request>((resolve, reject) => {
            const request = new Request(query, (error) => {
                if (error) {
                    reject(error);
                }
            });
            resolve(request);
        });
        return request;
    }

    static connectionConfiguration: ConnectionConfiguration = {
        authentication: {
            options: {
                userName: 'bookishUser',
                password: process.env.BookishAdminDatabasePassword,
            },
            type: 'default',
        },
        server: 'GECKO',
        options: {
            database: 'bookish',
            encrypt: true,
            trustServerCertificate: true,
            rowCollectionOnRequestCompletion: true,
        },
    };

    connection: Connection;

    public async connect() {
        this.connection = new Connection(
            DatabaseService.connectionConfiguration,
        );
        this.connection.connect();
        return new Promise<void>((resolve, reject) => {
            this.connection.on('connect', (error) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('Connected to database.');
                    resolve();
                }
            });
        });
    }

    public async executeQuery<T>(
        request: Request,
        rowParser: (queryResult: RowElement[]) => T,
    ): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const parsedRows: T[] = [];
            request.on('row', (row) => {
                parsedRows.push(rowParser(row));
            });

            request.on('requestCompleted', () => {
                resolve(parsedRows);
            });

            this.connection.execSql(request);
        });
    }
}
export default new DatabaseService();
