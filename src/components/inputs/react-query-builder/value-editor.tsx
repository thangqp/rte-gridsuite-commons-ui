/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import React, { useCallback } from 'react';
import { MaterialValueEditor } from '@react-querybuilder/material';
import Box from '@mui/material/Box';
import { useFormContext } from 'react-hook-form';
import CountryValueEditor from './country-value-editor';
import TranslatedValueEditor from './translated-value-editor';
import TextValueEditor from './text-value-editor';

import {
    DataType,
    FieldType,
    OperatorType,
} from '../../filter/expert/expert-filter.type';
import { Substation, VoltageLevel } from '../../../utils/equipment-types';
import ElementValueEditor from './element-value-editor';
import { ElementType } from '../../../utils/ElementType';
import PropertyValueEditor from './property-value-editor';
import { FilterType } from '../../filter/constants/filter-constants';
import FieldConstants from '../../../utils/field-constants';

const styles = {
    noArrows: {
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
            {
                display: 'none',
            },
        '& input[type=number]': {
            MozAppearance: 'textfield',
        },
    },
};

function ValueEditor(props: Readonly<ValueEditorProps>) {
    const { field, operator, value, rule, handleOnChange, inputType } = props;
    const formContext = useFormContext();
    const { getValues } = formContext;
    const itemFilter = useCallback(
        (filterValue: any) => {
            if (filterValue?.type === ElementType.FILTER) {
                return (
                    // we do not authorize to use an expert filter in the rules of
                    // another expert filter, to prevent potential cycle problems
                    filterValue?.specificMetadata?.type !==
                        FilterType.EXPERT.id &&
                    ((field === FieldType.ID &&
                        filterValue?.specificMetadata?.equipmentType ===
                            getValues(FieldConstants.EQUIPMENT_TYPE)) ||
                        ((field === FieldType.VOLTAGE_LEVEL_ID ||
                            field === FieldType.VOLTAGE_LEVEL_ID_1 ||
                            field === FieldType.VOLTAGE_LEVEL_ID_2) &&
                            filterValue?.specificMetadata?.equipmentType ===
                                VoltageLevel.type))
                );
            }
            return true;
        },
        [field, getValues]
    );

    if (
        operator === OperatorType.EXISTS ||
        operator === OperatorType.NOT_EXISTS
    ) {
        // No value needed for these operators
        return null;
    }
    if (
        [FieldType.COUNTRY, FieldType.COUNTRY_1, FieldType.COUNTRY_2].includes(
            field as FieldType
        )
    ) {
        return <CountryValueEditor {...props} />;
    }
    if (
        field === FieldType.ENERGY_SOURCE ||
        field === FieldType.SHUNT_COMPENSATOR_TYPE ||
        field === FieldType.LOAD_TYPE ||
        field === FieldType.RATIO_REGULATION_MODE ||
        field === FieldType.PHASE_REGULATION_MODE
    ) {
        return <TranslatedValueEditor {...props} />;
    }
    if (
        operator === OperatorType.IS_PART_OF ||
        operator === OperatorType.IS_NOT_PART_OF
    ) {
        let equipmentTypes;
        if (
            field === FieldType.VOLTAGE_LEVEL_ID ||
            field === FieldType.VOLTAGE_LEVEL_ID_1 ||
            field === FieldType.VOLTAGE_LEVEL_ID_2
        ) {
            equipmentTypes = [VoltageLevel.type];
        } else if (field === FieldType.ID) {
            equipmentTypes = [getValues(FieldConstants.EQUIPMENT_TYPE)];
        }

        return (
            <ElementValueEditor
                name={DataType.FILTER_UUID + rule.id}
                elementType={ElementType.FILTER}
                equipmentTypes={equipmentTypes}
                titleId="selectFilterDialogTitle"
                hideErrorMessage
                onChange={(e: any) => {
                    handleOnChange(e.map((v: any) => v.id));
                }}
                itemFilter={itemFilter}
                defaultValue={value}
            />
        );
    }
    if (
        field === FieldType.ID ||
        field === FieldType.NAME ||
        field === FieldType.VOLTAGE_LEVEL_ID ||
        field === FieldType.VOLTAGE_LEVEL_ID_1 ||
        field === FieldType.VOLTAGE_LEVEL_ID_2
    ) {
        return <TextValueEditor {...props} />;
    }
    if (
        field === FieldType.PROPERTY ||
        field === FieldType.SUBSTATION_PROPERTY ||
        field === FieldType.SUBSTATION_PROPERTY_1 ||
        field === FieldType.SUBSTATION_PROPERTY_2 ||
        field === FieldType.VOLTAGE_LEVEL_PROPERTY ||
        field === FieldType.VOLTAGE_LEVEL_PROPERTY_1 ||
        field === FieldType.VOLTAGE_LEVEL_PROPERTY_2
    ) {
        let equipmentType;
        if (
            field === FieldType.SUBSTATION_PROPERTY ||
            field === FieldType.SUBSTATION_PROPERTY_1 ||
            field === FieldType.SUBSTATION_PROPERTY_2
        ) {
            equipmentType = Substation.type;
        } else if (
            field === FieldType.VOLTAGE_LEVEL_PROPERTY ||
            field === FieldType.VOLTAGE_LEVEL_PROPERTY_1 ||
            field === FieldType.VOLTAGE_LEVEL_PROPERTY_2
        ) {
            equipmentType = VoltageLevel.type;
        } else {
            equipmentType = getValues(FieldConstants.EQUIPMENT_TYPE);
        }

        return (
            <PropertyValueEditor
                equipmentType={equipmentType}
                valueEditorProps={props}
            />
        );
    }
    return (
        <Box sx={inputType === 'number' ? styles.noArrows : undefined}>
            <MaterialValueEditor
                {...props}
                title={undefined} // disable the tooltip
            />
        </Box>
    );
}
export default ValueEditor;
