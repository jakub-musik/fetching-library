import { Action, QueryResponse } from '../client/client.types';
export declare type LoggerOptions = {
    collapse?: boolean;
    show?: boolean;
};
export declare type Logs = {
    action: Action;
    response?: QueryResponse;
};
export declare type Logger = (logs: Logs) => void;
