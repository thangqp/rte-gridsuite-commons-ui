/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getUserToken } from '../redux/commonStore.ts';

export const backendFetch = (url: string, init: any, token?: string) => {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy);
};

export const backendFetchJson = (url: string, init: any, token?: string) => {
    return backendFetch(url, init, token).then((safeResponse) =>
        safeResponse.status === 204 ? null : safeResponse.json()
    );
};

export const backendFetchText = (url: string, init: any, token?: string) => {
    return backendFetch(url, init, token).then((safeResponse) =>
        safeResponse.text()
    );
};

export const backendFetchFile = (url: string, init: any, token?: string) => {
    return backendFetch(url, init, token).then((safeResponse) =>
        safeResponse.blob()
    );
};

const FILE_TYPE = {
    ZIP: 'ZIP',
};
export const downloadZipFile = (blob: Blob, fileName: string) => {
    downloadFile(blob, fileName, FILE_TYPE.ZIP);
};

const downloadFile = (blob: Blob, filename: string, type: string) => {
    let contentType;
    if (type === FILE_TYPE.ZIP) {
        contentType = 'application/octet-stream';
    }
    const href = window.URL.createObjectURL(
        new Blob([blob], { type: contentType })
    );
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const prepareRequest = (init: any, token?: string) => {
    if (!(typeof init === 'undefined' || typeof init === 'object')) {
        throw new TypeError(
            'First argument of prepareRequest is not an object : ' + typeof init
        );
    }
    const initCopy = Object.assign({}, init);
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token ?? getUserToken();
    initCopy.headers.append('Authorization', 'Bearer ' + tokenCopy);
    return initCopy;
};

const safeFetch = (url: string, initCopy: any) => {
    return fetch(url, initCopy).then((response) =>
        response.ok ? response : handleError(response)
    );
};

const handleError = (response: any) => {
    return response.text().then((text: string) => {
        const errorName = 'HttpResponseError : ';
        const errorJson = parseError(text);
        let customError: Error & { status?: string };
        if (
            errorJson &&
            errorJson.status &&
            errorJson.error &&
            errorJson.message
        ) {
            customError = new Error(
                errorName +
                    errorJson.status +
                    ' ' +
                    errorJson.error +
                    ', message : ' +
                    errorJson.message
            );
            customError.status = errorJson.status;
        } else {
            customError = new Error(
                errorName +
                    response.status +
                    ' ' +
                    response.statusText +
                    ', message : ' +
                    text
            );
            customError.status = response.status;
        }
        throw customError;
    });
};

const parseError = (text: string) => {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
};

export const getRequestParamFromList = (
    params: string[],
    paramName: string
) => {
    return new URLSearchParams(
        params?.length ? params.map((param) => [paramName, param]) : []
    );
};

export const getWsBase = () =>
    document.baseURI
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');

export const FetchStatus = {
    SUCCEED: 'SUCCEED',
    FAILED: 'FAILED',
    IDLE: 'IDLE',
    RUNNING: 'RUNNING',
};

export const getQueryParamsList = (params: string[], paramName: string) => {
    if (params !== undefined && params.length > 0) {
        const urlSearchParams = new URLSearchParams();
        params.forEach((id) => urlSearchParams.append(paramName, id));
        return urlSearchParams.toString();
    }
    return '';
};
