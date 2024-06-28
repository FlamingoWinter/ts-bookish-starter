import { Connection, ConnectionConfiguration, Request } from 'tedious';
class DatabaseService {
    static _instance: DatabaseService | null = null;

    private DatabaseService() {
        void 0;
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new DatabaseService();
        }
        return this._instance;
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

    //TODO: Refactor to have a callback function which handles the translation of the row data into the model class.
    public async executeQuery<ReturnType>(query: string) {
        return new Promise((resolve, reject) => {
            const request = new Request(query, (error) => {
                if (error) {
                    reject(error);
                }
            });

            const rows = [];
            request.on('row', (record) => {
                rows.push(
                    record.map((element) => {
                        return { [element.metadata.colName]: element.value };
                    }),
                );
            });

            request.on('requestCompleted', () => {
                if (T === rows) resolve(rows);
            });

            this.connection.execSql(request);
        });
    }
}
export default DatabaseService;
