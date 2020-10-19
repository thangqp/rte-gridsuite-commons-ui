/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle
            disableTypography
            className={classes.root}
            {...other}
            style={{ padding: '16px 24px' }}
        >
            <Typography variant="h6" style={{ fontWeight: 600 }}>
                {children}
            </Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: '16px 24px',
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: '16px 24px',
    },
}))(MuiDialogActions);

const MuiDialogButton = withStyles((theme) => ({
    label: {
        fontWeight: 600,
    },
}))(Button);

const Popup = (props) => {
    const handleClose = () => {
        props.setOpen(false);
    };

    const handleClickOpenDialog = () => {
        props.setOpen(true);
    };

    return (
        <div>
            <Button onClick={handleClickOpenDialog}>Open dialog</Button>
            <Dialog
                open={props.open}
                onClose={handleClose}
                maxWidth={props.maxWidth}
                fullWidth={props.fullWidth}
            >
                {props.showPopupTitle && (
                    <DialogTitle
                        id="customized-dialog-title"
                        onClose={handleClose}
                    >
                        {props.popupTitle}
                    </DialogTitle>
                )}
                <DialogContent>
                    <DialogContentText>{props.popupContent}</DialogContentText>
                </DialogContent>
                {props.showPopupActions && (
                    <DialogActions>
                        <MuiDialogButton
                            autoFocus
                            variant="text"
                            onClick={handleClose}
                        >
                            {props.customTextCancelBtn}
                        </MuiDialogButton>
                        <MuiDialogButton variant="outlined">
                            {props.customTextValidationBtn}
                        </MuiDialogButton>
                    </DialogActions>
                )}
            </Dialog>
        </div>
    );
};

Popup.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    maxWidth: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool.isRequired,
};

export default Popup;
