/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {
    useEffect,
    useState,
    MouseEvent,
    FunctionComponent,
} from 'react';
import { List, ListItem, IconButton, Divider, Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Draggable } from 'react-beautiful-dnd';
import { useMultiselect } from './use-multiselect';
import CheckBoxItem, { HasId } from './check-box-item';

interface CheckboxListProps {
    itemRenderer?: (params: {
        item: any;
        index: number;
        checked: boolean;
        toggleSelection: (id: any) => void;
    }) => React.ReactNode;
    values: any[];
    itemComparator?: (val1: any, val2: any) => boolean;
    isAllSelected: boolean;
    setIsAllSelected: (value: boolean) => void;
    setIsPartiallySelected: (value: boolean) => void;
    getValueId: (value: any) => any;
    getValueLabel?: (value: any) => string;
    checkboxListSx?: any;
    labelSx?: any;
    enableKeyboardSelection?: boolean;
    isCheckBoxDraggable?: boolean;
    isDragDisable?: boolean;
    draggableProps?: any;
    secondaryAction?: (item: HasId) => React.ReactElement;
    enableSecondaryActionOnHover?: boolean;
    [key: string]: any;
}

export const areIdsEqual = (val1: any, val2: any) => {
    return val1.id === val2.id;
};

const styles = {
    dragIcon: (theme: any) => ({
        padding: theme.spacing(0),
        border: theme.spacing(1),
        borderRadius: theme.spacing(0),
        zIndex: 90,
    }),
};

const CheckboxList: FunctionComponent<CheckboxListProps> = ({
    itemRenderer,
    values = [],
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
    enableSecondaryActionOnHover = true,
    ...props
}) => {
    const {
        toggleSelection,
        selectedIds,
        clearSelection,
        toggleSelectAll,
        handleShiftAndCtrlClick,
    } = useMultiselect(values.map((v) => getValueId(v)));

    const isChecked = (item: any) =>
        selectedIds.some((checkedItem: any) =>
            itemComparator(checkedItem, item)
        );

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

    const handleCheckBoxClicked = (
        event: MouseEvent<HTMLButtonElement>,
        item: any
    ) => {
        toggleSelection(getValueId(item));
        if (enableKeyboardSelection) {
            handleShiftAndCtrlClick(event, getValueId(item));
        }
    };

    const handleSecondaryAction = (item: any) => {
        if (!secondaryAction) {
            return undefined;
        }

        if (!enableSecondaryActionOnHover) {
            return secondaryAction(item);
        }

        if (hover) {
            return secondaryAction(item);
        }

        return undefined;
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
                    <React.Fragment key={getValueId(item)}>
                        {isCheckBoxDraggable && (
                            <Draggable
                                draggableId={String(getValueId(item))}
                                index={index}
                                isDragDisabled={isDragDisable}
                            >
                                {(provided: any) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        onMouseEnter={() => setHover(true)}
                                        onMouseLeave={() => setHover(false)}
                                        {...draggableProps}
                                    >
                                        <ListItem
                                            {...props}
                                            sx={checkboxListSx}
                                        >
                                            <IconButton
                                                {...provided.dragHandleProps}
                                                sx={styles.dragIcon}
                                                size="small"
                                                style={{
                                                    opacity:
                                                        hover && !isDragDisable
                                                            ? '1'
                                                            : '0',
                                                }}
                                            >
                                                <DragIndicatorIcon />
                                            </IconButton>
                                            <CheckBoxItem
                                                item={item}
                                                checked={isChecked(item)}
                                                getLabel={getValueLabel(item)}
                                                onClick={(
                                                    e: MouseEvent<HTMLButtonElement>
                                                ) =>
                                                    handleCheckBoxClicked(
                                                        e,
                                                        item
                                                    )
                                                }
                                                secondaryAction={handleSecondaryAction(
                                                    item
                                                )}
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
                                onClick={(e: MouseEvent<HTMLButtonElement>) =>
                                    handleCheckBoxClicked(e, item)
                                }
                                secondaryAction={handleSecondaryAction(item)}
                                labelSx={labelSx}
                            />
                        )}
                        {index !== values.length - 1 && <Divider />}
                    </React.Fragment>
                );
            })}
        </List>
    );
};

export default CheckboxList;
