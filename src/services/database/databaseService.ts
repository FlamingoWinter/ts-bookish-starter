import { Connection, Request } from 'tedious';
import databaseServiceConfig from './databaseServiceConfig';

interface Cell {
    value: any;
    metadata: {
        colName: string;
    };
}

type Row = Cell[];

class DatabaseService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private DatabaseService() {}

    public async createNewRequest(query: string) {
        return await new Promise<Request>((resolve, reject) => {
            const request = new Request(query, (error) => {
                if (error) {
                    reject(error);
                }
            });
            resolve(request);
        });
    }

    connection: Connection;

    getProperty(row: Row, property: string) {
        return row.filter((x) => x.metadata.colName === property)[0].value;
    }

    public async connect() {
        this.connection = new Connection(databaseServiceConfig);
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
        rowParser: (queryResult: Row) => T,
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

const databaseService = new DatabaseService();

export { Row, databaseService };
