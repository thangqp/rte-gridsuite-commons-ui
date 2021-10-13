/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import EquipmentSearchBar from './equipment-search-bar';
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

const EquipmentSearchDialog = (props) => {
    const classes = useStyles();

    const {
        open,
        onClose,
        onEquipmentsSearchTermChange,
        onEquipmentSearchValidation,
        equipments,
        equipmentLabelling,
    } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={false}
            aria-labelledby="dialog-title-search"
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle className={classes.title} />
            <DialogContent dividers={false}>
                <EquipmentSearchBar
                    onSearchTermChange={onEquipmentsSearchTermChange}
                    onSelectionChange={onEquipmentSearchValidation}
                    equipmentsFound={equipments}
                    equipmentLabelling={equipmentLabelling}
                />
            </DialogContent>
        </Dialog>
    );
};

EquipmentSearchDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onEquipmentsSearchTermChange: PropTypes.func.isRequired,
    onEquipmentSearchValidation: PropTypes.func.isRequired,
    equipments: PropTypes.array.isRequired,
    equipmentLabelling: PropTypes.bool.isRequired,
};

export default EquipmentSearchDialog;
