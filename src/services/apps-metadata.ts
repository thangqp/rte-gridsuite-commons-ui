/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { PredefinedProperties } from '../utils/types';

// https://github.com/gridsuite/deployment/blob/main/docker-compose/docker-compose.base.yml
// https://github.com/gridsuite/deployment/blob/main/k8s/resources/common/config/apps-metadata.json
export type MetadataJson = MetadataCommon | MetadataStudy;
export type Url = string | URL;

export function fetchEnv() {
    return fetch('env.json').then((res) => res.json());
}

export type MetadataCommon = {
    name: string;
    url: Url;
    appColor: string;
    hiddenInAppsMenu: boolean;
    defaultCountry?: string;
};

export type MetadataStudy = MetadataCommon & {
    readonly name: 'Study';
    resources?: {
        types: string[];
        path: string;
    }[];
    predefinedEquipmentProperties?: {
        [networkElementType: string]: PredefinedProperties;
    };
    defaultParametersValues?: {
        fluxConvention?: string;
        enableDeveloperMode?: string; //maybe 'true'|'false' type?
        mapManualRefresh?: string; //maybe 'true'|'false' type?
    };
};

export function fetchAppsMetadata(): Promise<MetadataJson[]> {
    console.info(`Fetching apps and urls...`);
    return fetchEnv()
        .then((env) => fetch(env.appsMetadataServerUrl + '/apps-metadata.json'))
        .then((response) => response.json());
}

const isStudyMetadata = (metadata: MetadataJson): metadata is MetadataStudy => {
    return metadata.name === 'Study';
};

export function fetchStudyMetadata(): Promise<MetadataStudy> {
    console.info(`Fetching study metadata...`);
    return fetchAppsMetadata().then((res) => {
        const studyMetadata = res.filter(isStudyMetadata);
        if (!studyMetadata) {
            return Promise.reject('Study entry could not be found in metadata');
        }
        return studyMetadata[0]; // There should be only one study metadata
    });
}
