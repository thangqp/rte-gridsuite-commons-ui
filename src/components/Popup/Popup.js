/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
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

const CustomDialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle
            disableTypography
            className={classes.root}
            {...other}
            style={{ padding: '16px 48px' }}
        >
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
});

const CustomDialogContent = withStyles((theme) => ({
    root: {
        padding: '16px 48px',
    },
}))(DialogContent);

const CustomDialogActions = withStyles((theme) => ({
    root: {
        margin: '10px 24px 24px 24px',
        padding: '10px 24px 14px 24px',
        display: 'block',
    },
}))(DialogActions);

const CustomButton = withStyles((theme) => ({
    label: {
        fontWeight: 600,
    },
}))(Button);

const Popup = (props) => {
    const handleClose = () => {
        props.setOpen(false);
    };

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            maxWidth={props.maxWidth}
            fullWidth={props.fullWidth}
        >
            {props.showPopupTitle && (
                <CustomDialogTitle onClose={handleClose}>
                    {props.popupTitle}
                </CustomDialogTitle>
            )}
            <CustomDialogContent>
                <DialogContentText>{props.popupContent}</DialogContentText>
            </CustomDialogContent>
            <CustomDialogActions
                style={{
                    textAlign: props.showSingleBtnInLeft ? 'left' : 'right',
                }}
            >
                <CustomButton
                    autoFocus
                    variant={props.showSingleBtnInLeft ? 'contained' : 'text'}
                    color={props.showSingleBtnInLeft ? 'primary' : ''}
                    onClick={handleClose}
                >
                    {props.customTextCancelBtn}
                </CustomButton>
                {!props.showSingleBtn && (
                    <CustomButton variant="outlined">
                        {props.customTextValidationBtn}
                    </CustomButton>
                )}
            </CustomDialogActions>
        </Dialog>
    );
};

Popup.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.bool.isRequired,
    maxWidth: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool.isRequired,
    popupTitle: PropTypes.string.isRequired,
    popupContent: PropTypes.string.isRequired,
    showPopupTitle: PropTypes.bool.isRequired,
    customTextValidationBtn: PropTypes.string.isRequired,
    customTextCancelBtn: PropTypes.string.isRequired,
    showSingleBtn: PropTypes.bool.isRequired,
    showSingleBtnInLeft: PropTypes.bool.isRequired,
};

export default Popup;
