# Getting started

__fetching-library__ -  Simple and powerful fetch API extension. Use request and response interceptors to deal with API.

[![Build Status][build-badge]][build] [![version][version-badge]][package] ![downloads][downloads-badge] [![MIT License][license-badge]][license]
 [![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc] ![Gzip badge][gzip-badge] [![codecov](https://codecov.io/gh/marcin-piela/fetching-library/branch/master/graph/badge.svg)](https://codecov.io/gh/marcin-piela/fetching-library)

✅ Zero dependencies

✅ SSR support 

✅ Uses Fetch API

✅ Request and response interceptors allows to easily customize connection with API

✅ TypeScript support 

✅ Less than 2k minizipped

✅ Simple cache provider - easily to extend

## Installation

Run the following from your project root :

```sh
npm install fetching-library
```
or
```sh
yarn add fetching-library
```

That’s it! You may now use __fetching-library__ in your application.

## Usage

To start using this library we have to create an instance of [`Client`][]:

```js
import { createClient } from 'fetching-library';

const client = createClient({
  //None of the options is required
  requestInterceptors: [],
  responseInterceptors: [],
  cacheProvider: cacheProvider,
});
```

---

# Client

Object which exposes `query` method and `cache` object. 

## How to create instance of Client

```js
import { createClient } from 'fetching-library';

const client = createClient(options);
```

## Available methods

| name      | description                | param | response
| ------------------------- | --------------------------------- | ------------- |------------- |
| query         | function which dispatch request to API | [`Action`][], skipCache flag  | Promise which resolves to [`QueryResponse`][]
| cache         | cacheProvider object when provided in client options | 

```js
import { Action } from 'fetching-library';

const action:Action= { 
  method: 'GET',
  endpoint: '/users',
};

const skipCache = false;

client.query(action, skipCache);

client.cache.get(action);

```

## Available options

| option      | description                             | required | default value |
| ------------------------- | ----------------------------------------- | ------------- | ------------- |
| requestInterceptors         | array of requestInterceptors                | no         | [requestJsonInterceptor]               |
| responseInterceptors | array of responseInterceptors | no        | [responseJsonInterceptor, responseTextInterceptor]      |
| cacheProvider                   | cache provider                    | no                   | undefined      |


## Interceptors

There are two types of interceptors: __request interceptors__ and __response interceptors__.

__Fetching-library__ provides you with three interceptors (__requestJsonInterceptor__, __responseJsonInterceptor__ and  __responseTextInterceptor__) out of the box which are used by default.

If you add your own interceptors and still want to use them, you have to add them explicitly.

```js
import { requestJsonInterceptor, 
         responseJsonInterceptor,
         responseTextInterceptor,
         createClient } from 'fetching-library';

const client = createClient({
  requestInterceptors: [requestJsonInterceptor],
  responseInterceptors: [responseJsonInterceptor, responseTextInterceptor]
});
```

---

## Request interceptors

You can intercept requests before they are handled by __Fetch__ function. Interceptor has access to [`Action`][] object.

For example, when you want to add __HOST__ address to all API requests you can create such interceptor:

```js
export const requestHostInterceptor: host => client => async action => {
  return {
    ...action,
    endpoint: `${host}${action.endpoint}`,
  };
};
```

And then you have to add it to the Client:

```js
import { createClient } from 'fetching-library';

export const client = createClient({
  requestInterceptors: [requestHostInterceptor('http://example.com/')]
});
```

## Response interceptors

You can intercept responses before they are handled by __then__. Interceptor has access to [`Action`][] and [`QueryResponse`][] objects.

For example, your API responses with such object :

```json
{
  data: {
    ...
  },
}
```

and you want to get rid of `data` key, you can create response interceptor like that:

```js
export const responseInterceptor = client => async (action, response) => {
  if (response.payload.data) {
    return {
      ...response,
      payload: response.payload.data
    };
  }

  return response;
};
```

And then you have to add it to the Client:

```js
import { createClient } from 'fetching-library';

export const client = createClient({
  responseInterceptors: [responseInterceptor]
});
```

#### Build-in interceptors

| Interceptor             | description                                             |
| ----------------------- | ------------------------------------------------------- |
| requestJsonInterceptor  | Set up headers content to JSON type and stringifys body |
| responseJsonInterceptor | Parsing body text as JSON for json content type         |
| responseTextInterceptor | Resolves response promise with text                     |

## Logger

With __request__ and __response interceptors__ you can use simple logger provided by __fetching-library__

```js
import { createLogger } from 'fetching-library';

const logger = createLogger(options);
```

#### Available options

| option      | description                               | required      | default value |
| ------------| ----------------------------------------- | ------------- | ------------- |
| collapse    | log group should be collapsed             | no            | true         |
| show        | logs should be shown                      | no            | true          |


And then add it to the Client (remember that order of interceptors matters):

```js
import { 
  createLogger, 
  createClient, 
  requestLoggerInterceptor, 
  responseLoggerInterceptor, 
  requestJsonInterceptor, 
  responseJsonInterceptor,
  responseTextInterceptor 
} from 'fetching-library';

const logger = createLogger();

export const client = createClient({
  requestInterceptors: [requestJsonInterceptor, requestLoggerInterceptor(logger)],
  responseInterceptors: [responseJsonInterceptor, responseTextInterceptor, responseInterceptor(logger)]
});
```

## Cache provider

__fetching-library__  provides simple cache which you can customize:

```js
  import { createCache } from 'fetching-library';

  const cache = createCache(isCacheable, isValid);
```

Parameters:

| option      | description                                                            | required |
| ------------------------- | ---------------------------------------------------------------------- | ------------- |
| isCacheable         | function which checks if provided [`Action`][] is cacheable, returns bool                               | yes               |
| isValid | function which checks if value stored in cache ([`QueryResponse`][] extended with timestamp property)  is valid, returns bool | yes         |

Example of __Cache__ which caching all __GET__ requests for __10__ seconds:

```js
import { createCache } from 'fetching-library';

const cache = createCache(
  (action) => {
    return action.method === 'GET';
  },
  (response) => {
    return new Date().getTime() - response.timestamp < 10000;
  },
);
```

## Own CacheProvider

You can create your own cache provider. It should implement this type:

```js
type Cache<T> = {
  add: (action: Action<any>, value: T) => void;
  remove: (action: Action<any>) => void;
  get: (action: Action<any>) => QueryResponse & { timestamp: number } | undefined;
  getItems: () => { [key: string]: QueryResponse };
  setItems: (items:{ [key: string]: QueryResponse }) => void;
};

```

where `T` is [`QueryResponse`][] 

# Action

Action is the object which describes request. 

## Example

For example GET request on `/users` endpoint will look like:

```js
const fetchUsersActions = {
  endpoint: '/users',
  method: 'GET',
}
```

## Parameters

| option      | description   | type | required |
| ------------------------- | ------------------ | ------------- | ------------- |
| endpoint         | request address       | string | yes               |
| method | HTTP method | string         | yes 
| body | body of request | any         | no 
| headers | headers of request | { [propName: string]: string }         | no 
| credentials | - | [RequestCredentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)         | no 
| cache | - | [RequestCache](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache)         | no 
| mode | - | [RequestMode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)         | no 
| referrerPolicy | - | [ReferrerPolicy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)         | no 
| referrer | - | string         | no 
| integrity | - | string         | no 
| keepalive | - | bool         | no 
| redirect | - | [RequestRedirect](https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect)         | no 
| signal | - | [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) / null         | no 
| window | - | any         | no 

---

# QueryResponse

This is the results of API query

## Properties

| key      | description   | type | always |
| ------------------------- | ------------------ | ------------- |------------- |
| status         | HTTP response status       | number | no               |
| error | error flag | bool         | yes 
| errorObject | error object | object         | no 
| payload | response object from API (format depends on configured interceptors) | any         | no 
| headers | response headers | string         | no 

## Example

Example response for `/users` request:

```json
{
  "status": 200,
  "error": false,
  "errorObject": undefined,
  "payload": [],
  "headers": Headers,
}
```

[`Client`]: #client
[`Action`]: #action
[`QueryResponse`]: #queryresponse
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/marcin-piela/fetching-library.svg?style=flat-square
[build]: https://travis-ci.org/marcin-piela/fetching-library
[version-badge]: https://img.shields.io/npm/v/fetching-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/fetching-library
[downloads-badge]: https://img.shields.io/npm/dm/fetching-library.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/fetching-library.svg?style=flat-square
[license]: https://github.com/marcin-piela/fetching-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/marcin-piela/fetching-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/marcin-piela/fetching-library.svg?style=social
[github-watch]: https://github.com/marcin-piela/fetching-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/marcin-piela/fetching-library.svg?style=social
[github-star]: https://github.com/marcin-piela/fetching-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20fetching-library%20https%3A%2F%2Fgithub.com%2Fmarcin-piela%2Ffetching-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/marcin-piela/fetching-library.svg?style=social
[gzip-badge]:https://badgen.net/bundlephobia/minzip/fetching-library
