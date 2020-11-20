
const CONTENT_TYPE_HEADER = 'Content-Type';
const CONTENT_TYPE = 'application/json';
const ACCEPT_HEADER = 'Accept';
const ACCEPT = 'application/json';


function request(url, options = {}) {
    let { body } = options;
    const isJsonBody = typeof body === 'object' && !(body instanceof FormData);
    const headers = options.headers || (options.headers = {});
    headers[ACCEPT_HEADER] = ACCEPT;
    headers[CONTENT_TYPE_HEADER] = CONTENT_TYPE;

    if (isJsonBody) {
        body = trimEmpty(body);
        if (options.method === 'GET') {
            url = assembleURL(url, body);
            options.body = null;
        }
        else {
            // post delete put
            options.body = JSON.stringify(body);
        }
    }
    if (isCrossDomain(url)) {
        options.credentials = 'include';
    }
    return fetch(url, options).then((r) => {
        if (r.status >= 200 && r.status < 300) {
            if (r.headers.get(CONTENT_TYPE_HEADER).indexOf(ACCEPT) === -1) {
                return r.text();
            }
            else {
                return r.json();
            }
        }
        else {
            return Promise.reject(r.status);
        }
    });
}
function serialize(body) {
    return Object.keys(body)
        .reduce((parts, b) => {
        const val = body[b];
        if (val !== null && val !== undefined) {
            parts.push(`${b}=${val}`);
        }
        return parts;
    }, [])
        .join('&');
}
function assembleURL(url, param = {}) {
    url += url.indexOf('?') === -1 ? '?' : '&';
    url += serialize(param);
    return url;
}
function isCrossDomain(url) {
    const origin = window.location.origin;
    if (url.indexOf('//') === 0) {
        const link = document.createElement('a');
        link.href = url;
        url = link.href;
    }
    return url.indexOf('http') === 0 && url.indexOf(origin) !== 0;
}
function trimEmpty(json = {}) {
    const r = {};
    Object.keys(json).forEach((key) => {
        if (json[key] !== null && json[key] !== undefined) {
            r[key] = json[key];
        }
    });
    return r;
}
// #region util
const MATCH_SNAKE = /_(\w)/g;
export function snakeToCamel(json) {
    const kebab = (Array.isArray(json) ? [] : {});
    Object.keys(json).forEach((key) => {
        const val = json[key];
        key = key.replace(MATCH_SNAKE, (_, c) => (c ? c.toUpperCase() : ''));
        kebab[key] = typeof val === 'object' ? snakeToCamel(val) : val;
    });
    return kebab;
}
const MATCH_CAMEL = /(?![^A-Z]+)([A-Z])/g;
export function camelToSnake(json) {
    const camel = (Array.isArray(json) ? [] : {});
    Object.keys(json).forEach((key) => {
        const val = json[key];
        key = key.replace(MATCH_CAMEL, (_, c) => (c ? '_' + c.toLowerCase() : ''));
        camel[key] = typeof val === 'object' ? camelToSnake(val) : val;
    });
    return camel;
}
// #endregion
export const get = (url, body = {}) => request(url, { method: 'GET', body });
export const post = (url, body = {}) => request(url, { method: 'POST', body });
export const del = (url, body = {}) => request(url, { method: 'DELETE', body });
export const put = (url, body = {}) => request(url, { method: 'PUT', body });
