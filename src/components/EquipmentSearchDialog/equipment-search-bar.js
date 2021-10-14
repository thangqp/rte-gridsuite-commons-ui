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

const TERM_MIN_SIZE_BEFORE_SEARCH = 3;
const TAG_MAX_SIZE = '100px';

const useStyles = makeStyles({
    equipmentOption: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        width: '100%',
        margin: '0px',
        padding: '0px',
        alignItems: 'center',
    },
    equipmentTag: {
        width: TAG_MAX_SIZE,
        borderRadius: '10px',
        padding: '4px',
        fontSize: 'x-small',
        textAlign: 'center',
        background: 'lightblue',
    },
    equipmentVl: {
        fontStyle: 'italic',
    },
});

const MULTI_VLS_OPTIONS_FOR_EQUIPMENT_TYPES = new Set([
    'HVDC',
    'LINE',
    'TWO_WINDINGS_TRANSFORMER',
    'THREE_WINDINGS_TRANSFORMER',
]);

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

    const handleSearchTermChange = (term) => {
        if (term.length >= TERM_MIN_SIZE_BEFORE_SEARCH) {
            setLoading(true);
            onSearchTermChange(term);
        } else {
            setEquipments([]);
        }
    };

    useEffect(() => {
        setLoading(false);
        setEquipments(equipmentsFound);
    }, [equipmentsFound]);

    const createOptions = (equipmentsInfos) => {
        return equipmentsInfos.flatMap((e) =>
            e.type === 'SUBSTATION'
                ? {
                      type: e.type,
                      id: e.id,
                      name: e.name,
                  }
                : e.voltageLevelsIds.map((vlid) => {
                      return {
                          type: e.type,
                          id: e.id,
                          name: e.name,
                          voltageLevelId: vlid,
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
            options={createOptions(equipments)}
            loading={loading}
            autoHighlight={true}
            renderOption={(equipment) => {
                return (
                    <div className={classes.equipmentOption}>
                        <span className={classes.equipmentTag}>
                            {equipment.type}
                        </span>
                        <span>
                            {equipmentLabelling
                                ? `${equipment.name}`
                                : `${equipment.id}`}
                        </span>
                        {MULTI_VLS_OPTIONS_FOR_EQUIPMENT_TYPES.has(
                            equipment.type
                        ) && (
                            <div>
                                <span>&#8594;</span>
                                <span className={classes.equipmentVl}>
                                    {equipment.voltageLevelId}
                                </span>
                            </div>
                        )}
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
