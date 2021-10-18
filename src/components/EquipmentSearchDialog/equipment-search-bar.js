/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import clsx from 'clsx';
import {
    EQUIPMENT_TYPE,
    getTagForEquipmentType,
} from '../../utils/ElementType';

const TERM_MIN_SIZE_BEFORE_SEARCH = 3;
const TYPE_TAG_MAX_SIZE = '120px';
const VL_TAG_MAX_SIZE = '65px';

const useStyles = makeStyles({
    equipmentOption: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        width: '100%',
        margin: '0px',
        padding: '0px',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    equipmentTag: {
        borderRadius: '10px',
        padding: '4px',
        fontSize: 'x-small',
        textAlign: 'center',
    },
    equipmentTypeTag: {
        width: TYPE_TAG_MAX_SIZE,
        background: 'lightblue',
    },
    equipmentVlTag: {
        width: VL_TAG_MAX_SIZE,
        background: 'lightgray',
        fontStyle: 'italic',
    },
});

const EquipmentSearchBar = (props) => {
    const intl = useIntl();
    const classes = useStyles();

    const {
        onSearchTermChange,
        onSelectionChange,
        equipmentsFound,
        equipmentLabelling,
    } = props;

    const [equipments, setEquipments] = useState([]);

    const [expanded, setExpanded] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
        setEquipments(equipmentsFound);
    }, [equipmentsFound]);

    const handleSearchTermChange = (term) => {
        if (term.length >= TERM_MIN_SIZE_BEFORE_SEARCH) {
            setLoading(true);
            onSearchTermChange(term);
        } else {
            setEquipments([]);
        }
    };

    const createOptions = useCallback(
        (equipmentsInfos) => {
            return equipmentsInfos.flatMap((e) => {
                let label = equipmentLabelling ? e.name : e.id;
                return e.type === 'SUBSTATION'
                    ? [
                          {
                              type: e.type,
                              label: label,
                          },
                      ]
                    : e.voltageLevelsIds.map((vli) => {
                          return {
                              type: e.type,
                              label: label,
                              voltageLevelId: vli,
                          };
                      });
            });
        },
        [equipmentLabelling]
    );

    return (
        <Autocomplete
            id="equipment-search"
            forcePopupIcon={false}
            open={expanded}
            onOpen={() => {
                setExpanded(true);
                setEquipments([]);
            }}
            onClose={() => {
                setExpanded(false);
            }}
            fullWidth
            onInputChange={(event, value) => handleSearchTermChange(value)}
            onChange={(event, newValue) => onSelectionChange(newValue)}
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, value) =>
                JSON.stringify(option) === JSON.stringify(value)
            }
            options={createOptions(equipments)}
            loading={loading}
            autoHighlight={true}
            renderOption={(option, { inputValue }) => {
                let matches = match(option.label, inputValue);
                let parts = parse(option.label, matches);
                return (
                    <div className={classes.equipmentOption}>
                        <span
                            className={clsx(
                                classes.equipmentTag,
                                classes.equipmentTypeTag
                            )}
                        >
                            {getTagForEquipmentType(option.type, intl)}
                        </span>
                        <div className={classes.equipmentOption}>
                            <span>
                                {parts.map((part, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            fontWeight: part.highlight
                                                ? 'bold'
                                                : 'inherit',
                                        }}
                                    >
                                        {part.text}
                                    </span>
                                ))}
                            </span>
                            {option.type !== EQUIPMENT_TYPE.SUBSTATION &&
                                option.type !==
                                    EQUIPMENT_TYPE.VOLTAGE_LEVEL && (
                                    <span
                                        className={clsx(
                                            classes.equipmentTag,
                                            classes.equipmentVlTag
                                        )}
                                    >
                                        {option.voltageLevelId}
                                    </span>
                                )}
                        </div>
                    </div>
                );
            }}
            renderInput={(params) => (
                <TextField
                    autoFocus={true}
                    {...params}
                    label={intl.formatMessage({
                        id: 'equipment_search/label',
                    })}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <React.Fragment>
                                <SearchIcon color="disabled" />
                                {params.InputProps.startAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};

EquipmentSearchBar.propTypes = {
    onSearchTermChange: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    equipmentsFound: PropTypes.array.isRequired,
    equipmentLabelling: PropTypes.bool.isRequired,
};

export default EquipmentSearchBar;
