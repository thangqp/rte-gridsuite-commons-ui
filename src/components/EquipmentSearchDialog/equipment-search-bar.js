/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import { EQUIPMENT_TYPE, getTagForEquipmentType } from '../../utils/ElementType';

const TERM_MIN_SIZE_BEFORE_SEARCH = 3;
const TYPE_TAG_MAX_SIZE = '120px';
const VL_TAG_MAX_SIZE = '80px';

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

    const createOptions = (equipmentsInfos) => {
        return equipmentsInfos.flatMap((e) =>
            e.type === 'SUBSTATION'
                ? [
                      {
                          type: e.type,
                          id: e.id,
                          name: e.name,
                      },
                  ]
                : e.voltageLevelsIds.map((vli) => {
                      return {
                          type: e.type,
                          id: e.id,
                          name: e.name,
                          voltageLevelId: vli,
                      };
                  })
        );
    };

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
            getOptionLabel={(equipment) =>
                equipmentLabelling ? `${equipment.name}` : `${equipment.id}`
            }
            getOptionSelected={(option, value) =>
                JSON.stringify(option) === JSON.stringify(value)
            }
            options={createOptions(equipments)}
            loading={loading}
            autoHighlight={true}
            renderOption={(equipment) => {
                return (
                    <div className={classes.equipmentOption}>
                        <span
                            className={clsx(
                                classes.equipmentTag,
                                classes.equipmentTypeTag
                            )}
                        >
                            {getTagForEquipmentType(equipment.type, intl)}
                        </span>
                        <div className={classes.equipmentOption}>
                            <span>
                                {equipmentLabelling
                                    ? `${equipment.name}`
                                    : `${equipment.id}`}
                            </span>

                            {equipment.type !== EQUIPMENT_TYPE.SUBSTATION &&
                                equipment.type !==
                                    EQUIPMENT_TYPE.VOLTAGE_LEVEL && (
                                    <span
                                        className={clsx(
                                            classes.equipmentTag,
                                            classes.equipmentVlTag
                                        )}
                                    >
                                        {equipment.voltageLevelId}
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
