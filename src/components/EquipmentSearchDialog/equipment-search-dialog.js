/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import EquipmentSearchBar from './equipment-search-bar';
import SearchIcon from '@material-ui/icons/Search';
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
    searchButton: {
        padding: '0px',
    },
    searchIcon: {
        cursor: 'pointer',
        disabled: 'true',
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

    const [selectedEquipment, setSelectedEquipment] = useState(null);

    const handleSelectionChange = (equipmentId) => {
        setSelectedEquipment(equipmentId);
    };

    useEffect(() => {
        if (!open) {
            setSelectedEquipment(null);
        }
    }, [open]);

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
            <DialogContent dividers={false} className={classes.content}>
                <EquipmentSearchBar
                    onSearchTermChange={onEquipmentsSearchTermChange}
                    onSelectionChange={handleSelectionChange}
                    onSelectionValidation={() =>
                        onEquipmentSearchValidation(selectedEquipment)
                    }
                    equipmentsFound={equipments}
                    equipmentLabelling={equipmentLabelling}
                />
                <Button
                    className={classes.searchButton}
                    onClick={() =>
                        onEquipmentSearchValidation(selectedEquipment)
                    }
                    disabled={selectedEquipment == null}
                >
                    <SearchIcon className={classes.searchIcon} />
                </Button>
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
