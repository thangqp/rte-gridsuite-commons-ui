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
import SearchIcon from '@material-ui/icons/Search';

const TERM_MIN_SIZE_BEFORE_SEARCH = 3;

const ElementSearchBar = (props) => {
    const {
        searchingLabel,
        onSearchTermChange,
        onSelectionChange,
        elementsFound,
        renderElements,
    } = props;

    const [elements, setElements] = useState([]);

    const [expanded, setExpanded] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
        setElements(elementsFound);
    }, [elementsFound]);

    const handleSearchTermChange = (term) => {
        if (term.length >= TERM_MIN_SIZE_BEFORE_SEARCH) {
            setLoading(true);
            onSearchTermChange(term);
        } else {
            setElements([]);
        }
    };

    return (
        <Autocomplete
            id="element-search"
            forcePopupIcon={false}
            open={expanded}
            onOpen={() => {
                setExpanded(true);
                setElements([]);
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
            options={elements}
            loading={loading}
            autoHighlight={true}
            renderOption={renderElements}
            renderInput={(params) => (
                <TextField
                    autoFocus={true}
                    {...params}
                    label={searchingLabel}
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

ElementSearchBar.propTypes = {
    onSearchTermChange: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    elementsFound: PropTypes.array.isRequired,
    renderElements: PropTypes.func.isRequired,
};

export default ElementSearchBar;
