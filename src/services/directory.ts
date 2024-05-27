/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    backendFetch,
    backendFetchJson,
    getRequestParamFromList,
} from './utils';
import { UUID } from 'crypto';

const PREFIX_DIRECTORY_SERVER_QUERIES =
    import.meta.env.VITE_API_GATEWAY + '/directory';

function getPathUrl(elementUuid: UUID) {
    return `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/elements/${encodeURIComponent(
        elementUuid
    )}/path`;
}

export function fetchRootFolders(types: string[]) {
    console.info('Fetching Root Directories');

    // Add params to Url
    const typesParams = getRequestParamFromList(types, 'elementTypes');
    const urlSearchParams = new URLSearchParams(typesParams);

    const fetchRootFoldersUrl = `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/root-directories?${urlSearchParams}`;
    return backendFetchJson(fetchRootFoldersUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });
}

export function fetchDirectoryContent(directoryUuid: UUID, types?: string[]) {
    console.info("Fetching Folder content '%s'", directoryUuid);

    // Add params to Url
    const urlSearchParams = types
        ? getRequestParamFromList(types, 'elementTypes')
        : [];

    const fetchDirectoryContentUrl = `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/directories/${directoryUuid}/elements?${urlSearchParams}`;
    return backendFetchJson(fetchDirectoryContentUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });
}

export function fetchDirectoryElementPath(elementUuid: UUID) {
    console.info(`Fetching element '${elementUuid}' and its parents info ...`);
    const fetchPathUrl = getPathUrl(elementUuid);
    console.debug(fetchPathUrl);
    return backendFetchJson(fetchPathUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });
}

export function elementExists(
    directoryUuid: UUID,
    elementName: string,
    type: string
): Promise<boolean> {
    const existsElementUrl = `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/directories/${directoryUuid}/elements/${elementName}/types/${type}`;

    console.debug(existsElementUrl);
    return backendFetch(existsElementUrl, { method: 'head' }).then(
        (response: Response) => {
            return response.status !== 204; // HTTP 204 : No-content
        }
    );
}
