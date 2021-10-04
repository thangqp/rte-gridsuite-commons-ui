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

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

const EquipmentSearchBar = (props) => {
    const intl = useIntl();

    const { onSelectionChange, onSelectionValidation } = props;

    const [expanded, setExpanded] = useState(false);

    const [equipmentIds, setEquipmentIds] = useState([]);

    const loading = expanded && equipmentIds.length === 0;

    useEffect(() => {
        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            setEquipmentIds([...topFilms]);
        })();
    }, [loading]);

    useEffect(() => {
        if (!expanded) {
            setEquipmentIds([]);
        }
    }, [expanded]);

    return (
        <Autocomplete
            id="equipment-search"
            open={expanded}
            onOpen={() => {
                setExpanded(true);
            }}
            onClose={() => {
                setExpanded(false);
            }}
            fullWidth
            onChange={(event, newValue) => onSelectionChange(newValue)}
            getOptionLabel={(option) => option.title}
            options={equipmentIds}
            loading={loading}
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
    onSelectionChange: PropTypes.func.isRequired,
    onSelectionValidation: PropTypes.func.isRequired,
};

export default EquipmentSearchBar;

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: 2001,
    },
    {
        title: 'Star Wars: Episode V - The Empire Strikes Back',
        year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
        title: 'The Lord of the Rings: The Two Towers',
        year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
        title: 'Star Wars: Episode IV - A New Hope',
        year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
];
