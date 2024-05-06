/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import PropTypes from 'prop-types';
import { List, ListItem } from '@mui/material';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator.js';
import Divider from '@mui/material/Divider';
import { Draggable } from 'react-beautiful-dnd';
import React from 'react';
import { useMultiselect } from './use-multiselect.ts';
import { Box } from '@mui/system';
import CheckBoxItem from './check-box-item.tsx';

export const areIdsEqual = (val1, val2) => {
    return val1.id === val2.id;
};

const styles = {
    dragIcon: (theme) => ({
        padding: theme.spacing(0),
        border: theme.spacing(1),
        borderRadius: theme.spacing(0),
        zIndex: 90,
    }),
};
const CheckboxList = ({
    itemRenderer,
    values,
    onChecked,
    checkedValues,
    itemComparator = areIdsEqual,
    isAllSelected,
    setIsAllSelected,
    setIsPartiallySelected,
    getValueId = (value) => value?.id ?? value,
    getValueLabel = (value) => value?.label ?? value,
    checkboxListSx,
    labelSx,
    enableKeyboardSelection,
    isCheckBoxDraggable,
    isDragDisable,
    draggableProps,
    secondaryAction,
    enableSecondaryActionOnHover,
    ...props
}) => {
    const {
        toggleSelection,
        selectedIds,
        clearSelection,
        toggleSelectAll,
        handleShiftAndCtrlClick,
    } = useMultiselect(values.map((v) => getValueId(v)));

    const isChecked = (item) =>
        checkedValues.some((checkedItem) => itemComparator(checkedItem, item));

    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (isAllSelected === true) {
            toggleSelectAll();
        } else {
            clearSelection();
        }
    }, [isAllSelected, clearSelection, toggleSelectAll]);

    useEffect(() => {
        if (selectedIds?.length > 0) {
            if (selectedIds.length === values?.length) {
                setIsAllSelected(true);
            } else {
                setIsPartiallySelected(true);
            }
        } else {
            setIsAllSelected(false);
        }
    }, [selectedIds, values, setIsAllSelected, setIsPartiallySelected]);

    const handleCheckBoxClicked = (event, item) => {
        toggleSelection(getValueId(item));
        if (enableKeyboardSelection) {
            handleShiftAndCtrlClick(event, getValueId(item));
        }
    };

    return (
        <List {...props}>
            {values?.map((item, index) => {
                if (itemRenderer) {
                    return itemRenderer({
                        item,
                        index,
                        checked: isChecked(item),
                        toggleSelection,
                    });
                }
                return (
                    <>
                        {isCheckBoxDraggable && (
                            <Draggable
                                draggableId={getValueId(item)}
                                index={index}
                                isDragDisabled={isDragDisable}
                            >
                                {(provided) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        onMouseEnter={() => setHover(true)}
                                        onMouseLeave={() => setHover(false)}
                                        {...draggableProps}
                                    >
                                        <ListItem
                                            key={getValueId(item)}
                                            {...props}
                                            sx={checkboxListSx}
                                        >
                                            <IconButton
                                                {...provided.dragHandleProps}
                                                sx={styles.dragIcon}
                                                size={'small'}
                                                style={{
                                                    opacity:
                                                        hover && !isDragDisable
                                                            ? '1'
                                                            : '0',
                                                }}
                                            >
                                                <DragIndicatorIcon
                                                    edge="start"
                                                    spacing={0}
                                                />
                                            </IconButton>
                                            <CheckBoxItem
                                                item={item}
                                                checked={isChecked(item)}
                                                getLabel={getValueLabel(item)}
                                                onClick={handleCheckBoxClicked}
                                                secondaryAction={(item) => {
                                                    if (hover) {
                                                        return secondaryAction(
                                                            item
                                                        );
                                                    }
                                                    return undefined;
                                                }}
                                                labelSx={labelSx}
                                            />
                                        </ListItem>
                                    </Box>
                                )}
                            </Draggable>
                        )}
                        {!isCheckBoxDraggable && (
                            <CheckBoxItem
                                item={item}
                                checked={isChecked(item)}
                                getLabel={getValueLabel(item)}
                                onClick={handleCheckBoxClicked}
                            />
                        )}
                        {index !== values.length - 1 && <Divider />}
                    </>
                );
            })}
        </List>
    );
};

export default CheckboxList;

CheckboxList.propTypes = {
    itemRenderer: PropTypes.func.isRequired,
    onChecked: PropTypes.func.isRequired,
    checkedValues: PropTypes.array.isRequired,
    values: PropTypes.array,
    itemComparator: PropTypes.func,
    setIsAllSelected: PropTypes.func,
    setIsPartiallySelected: PropTypes.func,
    getValueId: PropTypes.func,
    getValueLabel: PropTypes.func,
    checkboxListSx: PropTypes.object,
    labelSx: PropTypes.object,
    enableKeyboardSelection: PropTypes.bool,
    secondaryAction: PropTypes.func,
    isCheckBoxDraggable: PropTypes.bool,
    isDragDisable: PropTypes.bool,
    draggableProps: PropTypes.object,
};
