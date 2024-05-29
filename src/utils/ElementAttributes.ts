/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'crypto';
import { ElementType } from './ElementType';

export type ElementAttributes = {
    elementUuid: UUID;
    elementName: string;
    type: ElementType;
    accessRights: {
        isPrivate: boolean;
    };
    owner: string;
    subdirectoriesCount: number;
    creationDate: string;
    lastModificationDate: string;
    lastModifiedBy: string;
    children: any[];
    parentUuid: null | UUID;
};
