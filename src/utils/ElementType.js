/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import DescriptionIcon from '@material-ui/icons/Description';
import PanToolIcon from '@material-ui/icons/PanTool';
import FilterListIcon from '@material-ui/icons/FilterList';
import FilterIcon from '@material-ui/icons/Filter';
import React from 'react';

export const elementType = {
    DIRECTORY: 'DIRECTORY',
    STUDY: 'STUDY',
    FILTER: 'FILTER',
    SCRIPT: 'SCRIPT',
    SCRIPT_CONTINGENCY_LIST: 'SCRIPT_CONTINGENCY_LIST',
    FILTERS_CONTINGENCY_LIST: 'FILTERS_CONTINGENCY_LIST',
};

// Must be the same as the back
export const EQUIPMENT_TYPE = {
    BREAKER: 'BREAKER',
    DISCONNECTOR: 'DISCONNECTOR',
    LOAD_BREAK_SWITCH: 'LOAD_BREAK_SWITCH',
    BUSBAR_SECTION: 'BUSBAR_SECTION',
    LINE: 'LINE',
    TWO_WINDINGS_TRANSFORMER: 'TWO_WINDINGS_TRANSFORMER',
    THREE_WINDINGS_TRANSFORMER: 'THREE_WINDINGS_TRANSFORMER',
    GENERATOR: 'GENERATOR',
    BATTERY: 'BATTERY',
    LOAD: 'LOAD',
    SHUNT_COMPENSATOR: 'SHUNT_COMPENSATOR',
    DANGLING_LINE: 'DANGLING_LINE',
    STATIC_VAR_COMPENSATOR: 'STATIC_VAR_COMPENSATOR',
    HVDC_CONVERTER_STATION: 'HVDC_CONVERTER_STATION',
    HVDC: 'HVDC',
    SUBSTATION: 'SUBSTATION',
    VOLTAGE_LEVEL: 'VOLTAGE_LEVEL',
};

export const getTagForEquipmentType = (type, intl) => {
    switch (type) {
        case EQUIPMENT_TYPE.BREAKER:
        case EQUIPMENT_TYPE.DISCONNECTOR:
        case EQUIPMENT_TYPE.LOAD_BREAK_SWITCH:
            return intl.formatMessage({ id: 'equipment_search/switchTag' });
        case EQUIPMENT_TYPE.BUSBAR_SECTION:
            return intl.formatMessage({
                id: 'equipment_search/busbarSectionTag',
            });
        case EQUIPMENT_TYPE.LINE:
        case EQUIPMENT_TYPE.DANGLING_LINE:
            return intl.formatMessage({ id: 'equipment_search/lineTag' });
        case EQUIPMENT_TYPE.TWO_WINDINGS_TRANSFORMER:
            return intl.formatMessage({ id: 'equipment_search/2wtTag' });
        case EQUIPMENT_TYPE.THREE_WINDINGS_TRANSFORMER:
            return intl.formatMessage({ id: 'equipment_search/3wtTag' });
        case EQUIPMENT_TYPE.GENERATOR:
            return intl.formatMessage({
                id: 'equipment_search/generatorTag',
            });
        case EQUIPMENT_TYPE.BATTERY:
            return intl.formatMessage({
                id: 'equipment_search/batteryTag',
            });
        case EQUIPMENT_TYPE.LOAD:
            return intl.formatMessage({
                id: 'equipment_search/loadTag',
            });
        case EQUIPMENT_TYPE.SHUNT_COMPENSATOR:
            return intl.formatMessage({
                id: 'equipment_search/shuntTag',
            });
        case EQUIPMENT_TYPE.STATIC_VAR_COMPENSATOR:
            return intl.formatMessage({
                id: 'equipment_search/svcTag',
            });
        case EQUIPMENT_TYPE.HVDC:
            return intl.formatMessage({
                id: 'equipment_search/hvdcLinkTag',
            });
        case EQUIPMENT_TYPE.HVDC_CONVERTER_STATION:
            return intl.formatMessage({
                id: 'equipment_search/hvdcStationTag',
            });
        case EQUIPMENT_TYPE.VOLTAGE_LEVEL:
            return intl.formatMessage({
                id: 'equipment_search/voltageLevelTag',
            });
        case EQUIPMENT_TYPE.SUBSTATION:
            return intl.formatMessage({
                id: 'equipment_search/substationTag',
            });
        default:
            throw new Error(`Unknown equipment type : ${type}`);
    }
};

export function getFileIcon(type, theme) {
    switch (type) {
        case elementType.STUDY:
            return <LibraryBooksOutlinedIcon className={theme} />;
        case elementType.SCRIPT_CONTINGENCY_LIST:
            return <DescriptionIcon className={theme} />;
        case elementType.FILTERS_CONTINGENCY_LIST:
            return <PanToolIcon className={theme} />;
        case elementType.FILTER:
            return <FilterListIcon className={theme} />;
        case elementType.SCRIPT:
            return <FilterIcon className={theme} />;
        case elementType.DIRECTORY:
            // to easily use in TreeView we do not give icons for directories
            return;
        default:
            console.warn('unknown type [' + type + ']');
    }
}
