/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useMemo, useCallback, useState } from 'react';
import { DEFAULT_CELL_PADDING, KeyedColumnsRowIndexer } from '../../src';
import withStyles from '@mui/styles/withStyles';

import { Box, FormControlLabel, Switch, TextField } from '@mui/material';
import MuiVirtualizedTable from '../../src/components/MuiVirtualizedTable';

const styles = (theme) => ({
    table: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
            paddingRight:
                theme.direction === 'rtl' ? '0 !important' : undefined,
        },
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.info.light,
        },
    },
    tableCell: {
        flex: 1,
        padding: DEFAULT_CELL_PADDING + 'px',
    },
    noClick: {
        cursor: 'initial',
    },
    tableCellColor: {
        color: theme.palette.primary.contrastText,
    },
    header: {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.primary.contrastText,
        fontWeight: 'bold',
    },
    rowBackgroundDark: {
        backgroundColor: theme.palette.info.dark,
    },
    rowBackgroundLight: {
        backgroundColor: theme.palette.info.main,
    },
});

const StyledVirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

export const TableTab = () => {
    const [usesCustomStyles, setUsesCustomStyles] = useState(true);

    const VirtualizedTable = usesCustomStyles
        ? StyledVirtualizedTable
        : MuiVirtualizedTable;

    const [version, setVersion] = useState(0);

    const columns = useMemo(
        () => [
            {
                label: 'header1',
                dataKey: 'key1',
            },
            {
                label: 'header2',
                dataKey: 'key2',
            },
            {
                label: 'header3 and some integers, and more, to be sure many lines are shown',
                dataKey: 'key3',
                numeric: true,
            },
            {
                label: 'floats',
                dataKey: 'key4',
                numeric: true,
                fractionDigits: 1,
            },
        ],
        []
    );

    const rows = useMemo(
        () => [
            { key1: 'group2', key2: 'val2', key3: 1, key4: 2.35 },
            { key1: 'group1', key2: 'val1', key3: 2, key4: 5.32 },
            { key1: 'group2', key2: 'val4', key3: 3, key4: 23.5 },
            { key1: 'group1', key2: 'val3', key3: 4, key4: 52.3 },
            { key1: 'group3', key2: 'val3', key3: 5, key4: 2.53 },
            { key1: 'group3', key2: 'val2', key3: 6, key4: 25.3 },
            { key1: 'group4', key2: 'val3', key3: 5, key4: 53.2 },
            { key1: 'group4', key2: 'val4', key3: 2, key4: 3.25 },
            { key1: 'group4', key2: 'val4', key3: 1, key4: 3.52 },
        ],
        []
    );

    const indexer = useMemo(() => {
        const ret = new KeyedColumnsRowIndexer(true, false, null, setVersion);
        ret.setColFilterOuterParams('key2', ['val9']);
        return ret;
    }, []);

    const [filterValue, setFilterValue] = useState('');
    const filter = useCallback(
        (row) => {
            return row.key2 && row.key2.includes(filterValue);
        },
        [filterValue]
    );

    return (
        <>
            <FormControlLabel
                control={
                    <Switch
                        checked={usesCustomStyles}
                        onChange={() => setUsesCustomStyles((was) => !was)}
                    />
                }
                labelPlacement={'start'}
                label="Custom theme"
            />
            <TextField
                style={{ marginLeft: '10px' }}
                label="header2 filter"
                size={'small'}
                onChange={(event) => setFilterValue(event.target.value)}
            />
            <Box style={{ height: '20rem' }}>
                <VirtualizedTable
                    name="Demo Virtualized Table"
                    rows={rows}
                    sortable={true}
                    columns={columns}
                    enableExportCSV={true}
                    exportCSVDataKeys={['key2', 'key3']}
                    onRowClick={(...args) => console.log('onRowClick', args)}
                    onClick={(...args) => console.log('onClick', args)}
                    onCellClick={(...args) => console.log('onCellClick', args)}
                    indexer={indexer}
                    version={version}
                    {...(filterValue && { filter })}
                />
            </Box>
            <Box style={{ height: '20rem' }}>
                <VirtualizedTable
                    rows={rows}
                    sortable={false}
                    columns={columns}
                    enableExportCSV={true}
                    exportCSVDataKeys={['key2', 'key3']}
                    onRowClick={(...args) => console.log('onRowClick', args)}
                    onClick={(...args) => console.log('onClick', args)}
                    onCellClick={(...args) => console.log('onCellClick', args)}
                    indexer={indexer}
                    version={version}
                    {...(filterValue && { filter })}
                />
            </Box>
            <Box style={{ height: '20rem' }}>
                <VirtualizedTable
                    rows={rows}
                    sortable={false}
                    columns={columns}
                    enableExportCSV={true}
                    exportCSVDataKeys={['key2', 'key3']}
                    onRowClick={(...args) => console.log('onRowClick', args)}
                    onClick={(...args) => console.log('onClick', args)}
                    onCellClick={(...args) => console.log('onCellClick', args)}
                    version={version}
                    {...(filterValue && { filter })}
                />
            </Box>
        </>
    );
};