import { Action } from '../client/client.types';
import { Cache } from './cache.types';
export declare const convertActionToBase64: (action: any) => string;
export declare const createCache: <T>(isCacheable: (action: Action<T>) => boolean, isValid: (response: T & {
    timestamp: number;
}) => boolean) => Cache<T>;
