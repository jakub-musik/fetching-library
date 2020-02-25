import { Logger } from "../../logger/logger.types";
import { RequestInterceptor } from "../../client/client.types";
export declare const requestLoggerInterceptor: (logger: Logger) => RequestInterceptor;
