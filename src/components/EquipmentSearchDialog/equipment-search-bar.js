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

const TERM_MIN_SIZE_BEFORE_SEARCH = 3;

const EquipmentSearchBar = (props) => {
    const intl = useIntl();

    const {
        onSearchTermChange,
        onSelectionChange,
        onSelectionValidation,
        equipmentsFound,
        equipmentLabelling,
    } = props;

    const [equipments, setEquipments] = useState([]);

    const [expanded, setExpanded] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSearchTermChange = (term) => {
        if (term.length >= TERM_MIN_SIZE_BEFORE_SEARCH) {
            console.log('INPUT = ', term);
            setLoading(true);
            onSearchTermChange(term);
        } else {
            setEquipments([]);
        }
    };

    useEffect(() => {
        console.log('OPTIONS : ', equipmentsFound);
        setLoading(false);
        setEquipments(equipmentsFound);
    }, [equipmentsFound]);

    return (
        <Autocomplete
            id="equipment-search"
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
                equipmentLabelling
                    ? `${equipment.equipmentType} name: ${equipment.equipmentName}`
                    : `${equipment.equipmentType} id: ${equipment.equipmentId}`
            }
            options={equipments}
            loading={loading}
            autoHighlight={true}
            renderInput={(params) => (
                <TextField
                    autoFocus={true}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            onSelectionValidation();
                        }
                    }}
                    {...params}
                    label={intl.formatMessage({
                        id: 'equipment_search/label',
                    })}
                />
            )}
        />
    );
};

EquipmentSearchBar.propTypes = {
    onSearchTermChange: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    onSelectionValidation: PropTypes.func.isRequired,
    equipmentsFound: PropTypes.array.isRequired,
    equipmentLabelling: PropTypes.bool.isRequired,
};

export default EquipmentSearchBar;
