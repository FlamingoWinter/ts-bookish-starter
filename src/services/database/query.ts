import { DataType } from 'tedious/lib/data-type';
import * as queryString from 'node:querystring';
class Parameter {
    name: string;
    type: DataType;
    value: any;
}
class Query {
    queryString: string;

    constructor(queryString: string, parameters: Parameter[]) {
        this.queryString = queryString;
        this.parameters = parameters;
    }

    parameters: Parameter[];
}
