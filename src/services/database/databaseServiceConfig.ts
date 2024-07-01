import { ConnectionConfiguration } from 'tedious';

const connectionConfiguration: ConnectionConfiguration = {
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

export default connectionConfiguration;
