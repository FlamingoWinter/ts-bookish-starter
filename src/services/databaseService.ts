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

    static connectionConfiguration: ConnectionConfiguration = {
        authentication: {
            options: {
                userName: 'bookishUser',
                password: 'bookish_pwd',
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
        query: string,
        rowParser: (queryResult: RowElement[]) => T,
    ): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const request = new Request(query, (error) => {
                if (error) {
                    reject(error);
                }
            });

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
