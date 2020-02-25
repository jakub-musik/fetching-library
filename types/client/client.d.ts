import { Action, ClientOptions, QueryResponse, RequestInterceptor, ResponseInterceptor } from './client.types';
export declare type HandleRequestInterceptors<R> = (action: Action<R>, interceptors: Array<RequestInterceptor<R>>) => Promise<Action<R>>;
export declare type HandleResponseInterceptors<R> = (action: Action<R>, response: QueryResponse<any>, interceptors: Array<ResponseInterceptor<R, any>>) => Promise<QueryResponse<any>>;
export declare const createClient: <R = any>(options?: ClientOptions<R> | undefined) => {
    cache: import("..").Cache<QueryResponse<any>> | undefined;
    query: <T>(actionInit: Action<R>, skipCache?: boolean) => Promise<QueryResponse<T>>;
};
