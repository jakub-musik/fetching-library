import { Cache } from '../cache/cache.types';
declare type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
export declare type Action<T = {}> = {
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
export declare type QueryResponse<T = any> = {
    status?: number;
    error: boolean;
    errorObject?: any;
    headers?: Headers;
    payload?: T;
};
export declare type Client<R = any> = {
    query: <T>(action: Action<R>, skipCache?: boolean) => Promise<QueryResponse<T>>;
    cache?: Cache<QueryResponse>;
};
export declare type ClientOptions<T> = {
    requestInterceptors?: Array<RequestInterceptor<T>>;
    responseInterceptors?: Array<ResponseInterceptor<T, any>>;
    cacheProvider?: Cache<QueryResponse>;
    customFetch?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
};
export declare type RequestInterceptor<T = any> = (client: Client<T>) => (action: Action<T>) => Promise<Action<T>>;
export declare type ResponseInterceptor<T = any, R = any> = (client: Client<T>) => (action: Action<T>, response: QueryResponse<R>) => Promise<QueryResponse<R>>;
export {};
