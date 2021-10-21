/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import ElementSearchBar from './element-search-bar';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    title: {
        padding: '0px',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'end',
        padding: '20px',
        paddingRight: '0px',
    },
});

const ElementSearchDialog = (props) => {
    const classes = useStyles();

    const {
        open,
        onClose,
        searchingLabel,
        onElementsSearchTermChange,
        onElementSearchValidation,
        elements,
        renderElements,
    } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="dialog-title-search"
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle className={classes.title} />
            <DialogContent>
                <ElementSearchBar
                    searchingLabel={searchingLabel}
                    onSearchTermChange={onElementsSearchTermChange}
                    onSelectionChange={onElementSearchValidation}
                    elementsFound={elements}
                    renderElements={renderElements}
                />
            </DialogContent>
        </Dialog>
    );
};

ElementSearchDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onElementsSearchTermChange: PropTypes.func.isRequired,
    onElementSearchValidation: PropTypes.func.isRequired,
    elements: PropTypes.array.isRequired,
    renderElements: PropTypes.func.isRequired,
};

export default ElementSearchDialog;
