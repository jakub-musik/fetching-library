declare type Cache<T> = {
    add: (action: Action<any>, value: T) => void;
    remove: (action: Action<any>) => void;
    get: (action: Action<any>) => T & {
        timestamp: number;
    } | undefined;
    getItems: () => {
        [key: string]: T;
    };
    setItems: (items: {
        [key: string]: T;
    }) => void;
};

declare type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
declare type Action<T = {}> = {
    endpoint: string;
    method: Method;
    body?: any;
    headers?: {
        [propName: string]: string;
    };
    credentials?: RequestCredentials;
    cache?: RequestCache;
    mode?: RequestMode;
    referrerPolicy?: ReferrerPolicy;
    referrer?: string;
    integrity?: string;
    keepalive?: boolean;
    redirect?: RequestRedirect;
    signal?: AbortSignal | null;
    window?: any;
    id?: string;
} & T;
declare type QueryResponse<T = any> = {
    status?: number;
    error: boolean;
    errorObject?: any;
    headers?: Headers;
    payload?: T;
};
declare type Client<R = any> = {
    query: <T>(action: Action<R>, skipCache?: boolean) => Promise<QueryResponse<T>>;
    cache?: Cache<QueryResponse>;
};
declare type ClientOptions<T> = {
    requestInterceptors?: Array<RequestInterceptor<T>>;
    responseInterceptors?: Array<ResponseInterceptor<T, any>>;
    cacheProvider?: Cache<QueryResponse>;
    customFetch?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
};
declare type RequestInterceptor<T = any> = (client: Client<T>) => (action: Action<T>) => Promise<Action<T>>;
declare type ResponseInterceptor<T = any, R = any> = (client: Client<T>) => (action: Action<T>, response: QueryResponse<R>) => Promise<QueryResponse<R>>;

declare type HandleRequestInterceptors<R> = (action: Action<R>, interceptors: Array<RequestInterceptor<R>>) => Promise<Action<R>>;
declare type HandleResponseInterceptors<R> = (action: Action<R>, response: QueryResponse<any>, interceptors: Array<ResponseInterceptor<R, any>>) => Promise<QueryResponse<any>>;
declare const createClient: <R = any>(options?: ClientOptions<R> | undefined) => {
    cache: Cache<QueryResponse<any>> | undefined;
    query: <T>(actionInit: Action<R>, skipCache?: boolean) => Promise<QueryResponse<T>>;
};

declare const convertActionToBase64: (action: any) => string;
declare const createCache: <T>(isCacheable: (action: Action<T>) => boolean, isValid: (response: T & {
    timestamp: number;
}) => boolean) => Cache<T>;

declare type LoggerOptions = {
    collapse?: boolean;
    show?: boolean;
};
declare type Logs = {
    action: Action;
    response?: QueryResponse;
};
declare type Logger = (logs: Logs) => void;

declare const createLogger: (options?: LoggerOptions | undefined) => Logger;

declare const requestJsonInterceptor: RequestInterceptor;

declare const responseJsonInterceptor: ResponseInterceptor;

declare const responseTextInterceptor: ResponseInterceptor;

declare const responseLoggerInterceptor: (logger: Logger) => ResponseInterceptor;

declare const requestLoggerInterceptor: (logger: Logger) => RequestInterceptor;

export { Action, Cache, Client, ClientOptions, HandleRequestInterceptors, HandleResponseInterceptors, Logger, QueryResponse, RequestInterceptor, ResponseInterceptor, convertActionToBase64, createCache, createClient, createLogger, requestJsonInterceptor, requestLoggerInterceptor, responseJsonInterceptor, responseLoggerInterceptor, responseTextInterceptor };
