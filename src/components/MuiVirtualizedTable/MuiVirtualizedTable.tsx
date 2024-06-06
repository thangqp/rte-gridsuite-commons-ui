/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * This class has been taken from 'Virtualized Table' example at https://material-ui.com/components/tables/
 */
import {
    createRef,
    PureComponent,
    ReactNode,
    MouseEvent,
    KeyboardEvent,
    MutableRefObject,
} from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';
import memoize from 'memoize-one';
import {
    Autocomplete,
    Chip,
    IconButton,
    Popover,
    SxProps,
    TableCell,
    TextField,
} from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { styled } from '@mui/system';
import { GetApp as GetAppIcon } from '@mui/icons-material';
import {
    AutoSizer,
    Column,
    ColumnProps,
    RowMouseEventHandlerParams,
    Table,
    TableCellProps,
} from 'react-virtualized';
import CsvDownloader from 'react-csv-downloader';
import { OverflowableText } from '../OverflowableText/overflowable-text';
import {
    makeComposeClasses,
    toNestedGlobalSelectors,
} from '../../utils/styles';
import {
    ChangeWays,
    collectibleHelper,
    CustomColumnProps,
    getHelper,
    KeyedColumnsRowIndexer,
    RowProps,
} from './KeyedColumnsRowIndexer';
import { ColumnHeader } from './ColumnHeader';
import { on } from 'events';

function getTextWidth(text: any): number {
    // re-use canvas object for better performance
    const canvas =
        // @ts-ignore this is questioning
        getTextWidth.canvas ||
        // @ts-ignore this is questioning
        (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    // TODO find a better way to find Material UI style
    context.font = '14px "Roboto", "Helvetica", "Arial", sans-serif';
    const metrics = context.measureText(text);
    return metrics.width;
}

export const DEFAULT_CELL_PADDING = 16;
export const DEFAULT_HEADER_HEIGHT = 48;
export const DEFAULT_ROW_HEIGHT = 48;

// As a bunch of individual variables to try to make it easier
// to track that they are all used. Not sure, maybe group them in an object ?
const cssFlexContainer = 'flexContainer';
const cssTable = 'table';
const cssTableRow = 'tableRow';
const cssTableRowHover = 'tableRowHover';
const cssTableCell = 'tableCell';
const cssTableCellColor = 'tableCellColor';
const cssNoClick = 'noClick';
const cssHeader = 'header';
const cssRowBackgroundDark = 'rowBackgroundDark';
const cssRowBackgroundLight = 'rowBackgroundLight';

// converted to nested rules
const defaultStyles = {
    [cssFlexContainer]: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    [cssTable]: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
        },
    },
    [cssTableRow]: {
        cursor: 'pointer',
    },
    [cssTableRowHover]: {},
    [cssTableCell]: {
        flex: 1,
        padding: `${DEFAULT_CELL_PADDING}px`,
    },
    [cssTableCellColor]: {},
    [cssNoClick]: {
        cursor: 'initial',
    },
    [cssHeader]: {
        fontWeight: 'bold',
    },
    [cssRowBackgroundDark]: {},
    [cssRowBackgroundLight]: {},
};

// TODO find a better system, maybe MUI will fix/improve this ?
// Different from all others because of the poor nested sx support for portals
// requiring classname sharing/forwarding between the content and the tooltip
const defaultTooltipSx = {
    maxWidth: '1260px',
    fontSize: '0.9rem',
};

// TODO do we need to export this to clients (index.js) ?
export const generateMuiVirtualizedTableClass = (className: string) =>
    `MuiVirtualizedTable-${className}`;
const composeClasses = makeComposeClasses(generateMuiVirtualizedTableClass);

interface AmongChooserProps<T extends ReactNode> {
    options: T[];
    value?: T[];
    setValue: (values: T[]) => void;
    onDropDownVisibility: (visibility: boolean) => void;
    id: string;
}

function AmongChooser<T extends ReactNode>(
    props: Readonly<AmongChooserProps<T>>
) {
    const { options, value, setValue, id, onDropDownVisibility } = props;

    return (
        <span>
            <Autocomplete
                id={id}
                value={value}
                multiple
                onChange={(evt, newVal) => {
                    setValue(newVal);
                }}
                onClose={() => onDropDownVisibility(false)}
                onOpen={() => onDropDownVisibility(true)}
                options={options}
                renderInput={(inputProps) => (
                    <TextField autoFocus {...inputProps} />
                )}
                renderTags={(val, getTagsProps) => {
                    return val.map((code, index) => {
                        return (
                            <Chip
                                id={`chip_${code}`}
                                size="small"
                                label={code}
                                {...getTagsProps({ index })}
                            />
                        );
                    });
                }}
            />
        </span>
    );
}

function makeIndexRecord(
    viewIndexToModel: number[] | null,
    rows: Record<number, RowProps>
): {
    viewIndexToModel: number[] | null;
    rowGetter: (index: number) => RowProps;
} {
    return {
        viewIndexToModel,
        rowGetter: !viewIndexToModel
            ? (viewIndex: number) => rows[viewIndex]
            : (viewIndex: number) => {
                  if (viewIndex >= viewIndexToModel.length || viewIndex < 0) {
                      return {} as RowProps;
                  }
                  const modelIndex = viewIndexToModel[viewIndex];
                  return rows[modelIndex];
              },
    };
}

const initIndexer = (
    props: CustomColumnProps,
    versionSetter: (version: number) => void
) => {
    if (!props.sortable) {
        return null;
    }

    if (props.indexer) {
        return props.indexer;
    }

    return new KeyedColumnsRowIndexer(true, true, null, versionSetter);
};

const preFilterData = memoize(
    (
        columns,
        rows,
        filterFromProps,
        indexer,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        filterVersion // filterVersion is unused directly, used only as a workaround just to reset the memoization
    ) => {
        return indexer.preFilterRowMapping(columns, rows, filterFromProps);
    }
);

const reorderIndex = memoize(
    (
        indexer,
        indirectionVersion,
        rows,
        columns,
        filterFromProps,
        sortFromProps
    ): {
        viewIndexToModel: number[] | null;
        rowGetter: ((index: number) => RowProps) | ((index: number) => number);
    } => {
        if (!rows) {
            return {
                viewIndexToModel: [],
                rowGetter: (viewIndex: number) => viewIndex,
            };
        }

        const highestCodedColumn = !indexer
            ? 0
            : indexer.highestCodedColumn(columns);
        if (sortFromProps && highestCodedColumn) {
            const colIdx = Math.abs(highestCodedColumn) - 1;
            const reorderedIndex = sortFromProps(
                columns[colIdx].dataKey,
                highestCodedColumn > 0,
                !!columns[colIdx].numeric
            );
            return makeIndexRecord(reorderedIndex, rows);
        }
        if (sortFromProps) {
            try {
                const viewIndexToModel = sortFromProps(null, false, false);
                return makeIndexRecord(viewIndexToModel, rows);
            } catch (e) {
                // some external sort functions may expect to only be called
                // when the user has select a column. Catch their errors and ignore
                console.warn(
                    'error in external sort. consider adding support for datakey=null in your external sort function'
                );
            }
        }
        if (indexer) {
            const prefiltered = preFilterData(
                columns,
                rows,
                filterFromProps,
                indexer,
                indirectionVersion
            );
            const reorderedIndex = indexer.makeGroupAndSortIndirector(
                prefiltered,
                columns
            );
            return makeIndexRecord(reorderedIndex, rows);
        }
        if (filterFromProps) {
            const viewIndexToModel = rows
                .map((r: unknown, i: number) => [r, i])
                .filter(([r]: [unknown, number]) => filterFromProps(r))
                .map(([j]: [unknown, number]) => j);
            return makeIndexRecord(viewIndexToModel, rows);
        }

        return makeIndexRecord(null, rows);
    }
);

export interface MuiVirtualizedTableProps extends CustomColumnProps {
    headerHeight?: number;
    columns: CustomColumnProps[];
    defersFilterChanges: (() => void) | null;
    rows: RowProps[];
    filter: unknown;
    sort: unknown;
    classes?: Record<string, string>;
    onRowClick?: (event: RowMouseEventHandlerParams) => void;
    rowHeight?: number;
    onCellClick: (row: RowProps, column: ColumnProps) => void;
    tooltipSx: SxProps;
    name: string;
    exportCSVDataKeys: unknown[];
    enableExportCSV?: boolean;
}

export interface MuiVirtualizedTableState {
    headerHeight: number;
    indexer: KeyedColumnsRowIndexer | null;
    indirectionVersion: number;
    popoverAnchorEl: Element | null;
    popoverColKey: string | null;
    deferredFilterChange: null | {
        newVal: unknown[] | null;
        colKey: string | null;
    };
}

class MuiVirtualizedTable extends PureComponent<
    MuiVirtualizedTableProps,
    MuiVirtualizedTableState
> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        headerHeight: DEFAULT_HEADER_HEIGHT,
        rowHeight: DEFAULT_ROW_HEIGHT,
        enableExportCSV: false,
        classes: {},
        onRowClick: undefined,
    };

    static readonly computeDataWidth = (text: string) => {
        return getTextWidth(text || '') + 2 * DEFAULT_CELL_PADDING;
    };

    headers: MutableRefObject<any>;

    observer: IntersectionObserver;

    dropDownVisible: boolean;

    sizes = memoize((columns, rows, rowGetter) => {
        const sizes: Record<string, number> = {};
        columns.forEach((col: CustomColumnProps) => {
            if (col.width) {
                sizes[col.dataKey] = col.width;
            } else {
                /* calculate the header (and min size if exists)
                 * NB : ignores the possible icons
                 */
                let size = Math.max(
                    col.minWidth ?? 0,
                    MuiVirtualizedTable.computeDataWidth(col.label)
                );
                /* calculate for each row the width, and keep the max  */
                for (let i = 0; i < rows.length; i += 1) {
                    const gotRow = rowGetter(i);
                    const text = MuiVirtualizedTable.getDisplayValue(
                        col,
                        gotRow[col.dataKey]
                    );
                    size = Math.max(
                        size,
                        MuiVirtualizedTable.computeDataWidth(text)
                    );
                }
                if (col.maxWidth) {
                    size = Math.min(col.maxWidth, size);
                }
                sizes[col.dataKey] = Math.ceil(size);
            }
        });
        return sizes;
    });

    csvHeaders = memoize((columns, exportCSVDataKeys) => {
        const tempHeaders: { displayName: string; id: string }[] = [];
        columns.forEach((col: CustomColumnProps) => {
            if (
                exportCSVDataKeys !== undefined &&
                exportCSVDataKeys.find((el: string) => el === col.dataKey)
            ) {
                tempHeaders.push({
                    displayName: col.label,
                    id: col.dataKey,
                });
            }
        });
        return tempHeaders;
    });

    constructor(props: MuiVirtualizedTableProps, context: any) {
        super(props, context);

        this.computeHeaderSize = this.computeHeaderSize.bind(this);
        this.registerHeader = this.registerHeader.bind(this);
        this.registerObserver = this.registerObserver.bind(this);
        // we shouldn't use createRef here, just defining an object would be enough
        // We have to type RefObject to MutableRefObject to enable mutability, and TS enables that...
        this.headers = createRef();
        this.headers.current = {};
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };
        this.observer = new IntersectionObserver(
            this.computeHeaderSize,
            options
        );
        this.dropDownVisible = false;
        const { headerHeight } = this.props;
        this.state = {
            headerHeight,
            indexer: initIndexer(props, this.setVersion),
            indirectionVersion: 0,
            popoverAnchorEl: null,
            popoverColKey: null,
            deferredFilterChange: null,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.computeHeaderSize);
    }

    componentDidUpdate(oldProps: MuiVirtualizedTableProps) {
        const { indexer, sortable, headerHeight } = this.props;
        if (oldProps.indexer !== indexer || oldProps.sortable !== sortable) {
            this.setState((state) => {
                return {
                    indexer: initIndexer(this.props, this.setVersion),
                    indirectionVersion: (state?.indirectionVersion ?? 0) + 1,
                };
            });
        }
        if (oldProps.headerHeight !== headerHeight) {
            this.computeHeaderSize();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.computeHeaderSize);
        this.observer.disconnect();
    }

    handleKeyDownOnPopover = (evt: KeyboardEvent<HTMLDivElement>) => {
        if (evt.key === 'Enter' && !this.dropDownVisible) {
            this.closePopover(evt, 'enterKeyDown');
        }
    };

    onFilterParamsChange(newVal: unknown[] | null, colKey: string | null) {
        const { indexer, indirectionVersion } = this.state;
        const { defersFilterChanges } = this.props;
        const nonEmpty = newVal?.length === 0 ? null : newVal;
        if (defersFilterChanges) {
            this.setState({
                deferredFilterChange: { newVal, colKey },
            });
        } else if (indexer?.setColFilterUserParams(colKey, nonEmpty)) {
            this.setState({
                indirectionVersion: indirectionVersion + 1,
            });
        }
    }

    getCSVData = () => {
        const { rows, columns, filter, sort, exportCSVDataKeys } = this.props;
        const { indexer, indirectionVersion } = this.state;
        const reorderedIndex = reorderIndex(
            indexer,
            indirectionVersion,
            rows,
            columns,
            filter,
            sort
        );
        const rowsCount =
            reorderedIndex.viewIndexToModel?.length ?? rows.length;

        const csvData = [];
        for (let index = 0; index < rowsCount; index += 1) {
            const myobj: Record<string, any> = {};
            const sortedRow: any = reorderedIndex.rowGetter(index);
            const exportedKeys = exportCSVDataKeys;
            columns.forEach((col) => {
                if (exportedKeys?.find((el: any) => el === col.dataKey)) {
                    myobj[col.dataKey] = sortedRow[col.dataKey];
                }
            });
            csvData.push(myobj);
        }

        return Promise.resolve(csvData);
    };

    getCSVFilename = () => {
        const { name, columns } = this.props;
        if (name?.length > 0) {
            return name.replace(/\s/g, '_');
        }
        const filename = Object.entries(columns)
            .map((p) => p[1].label)
            .join('_');
        return filename;
    };

    // type check should be increased here
    static getDisplayValue(column: CustomColumnProps, cellData: any) {
        let displayedValue: any;
        if (!column.numeric) {
            displayedValue = cellData;
        } else if (Number.isNaN(cellData)) {
            displayedValue = '';
        } else if (
            column.fractionDigits === undefined ||
            column.fractionDigits === 0
        ) {
            displayedValue = Math.round(cellData);
        } else {
            displayedValue = Number(cellData).toFixed(column.fractionDigits);
        }

        if (column.unit !== undefined) {
            displayedValue += ' ';
            displayedValue += column.unit;
        }
        return displayedValue;
    }

    makeSizedTable = (
        height: number,
        width: number,
        sizes: Record<string, number>,
        reorderedIndex: number[] | null,
        rowGetter: ((index: number) => RowProps) | ((index: number) => number)
    ) => {
        const { sort, onRowClick, ...otherProps } = this.props;
        const { headerHeight } = this.state;
        return (
            <Table
                {...otherProps}
                height={height}
                width={width}
                rowHeight={otherProps.rowHeight ?? DEFAULT_ROW_HEIGHT}
                gridStyle={{ direction: 'inherit' }}
                headerHeight={headerHeight}
                className={composeClasses(otherProps.classes ?? {}, cssTable)}
                onRowClick={
                    onRowClick &&
                    /* The {...otherProps} just above would hold the slot onRowClick */
                    this.onClickableRowClick
                }
                rowCount={reorderedIndex?.length ?? otherProps.rows.length}
                rowClassName={({ index }) =>
                    this.getRowClassName({ index, rowGetter })
                }
                rowGetter={({ index }) => rowGetter(index)}
            >
                {otherProps.columns.map(({ dataKey, ...other }, index) => {
                    return (
                        <Column
                            key={dataKey}
                            headerRenderer={this.makeHeaderRenderer(
                                dataKey,
                                index
                            )}
                            className={composeClasses(
                                otherProps.classes ?? {},
                                cssFlexContainer
                            )}
                            cellRenderer={this.cellRenderer}
                            dataKey={dataKey}
                            flexGrow={1}
                            // @ts-ignore will be overwritten by ...other
                            width={sizes[dataKey]}
                            {...other}
                        />
                    );
                })}
            </Table>
        );
    };

    openPopover = (popoverTarget: Element, colKey: string) => {
        const { columns } = this.props;
        const col = columns.find((c) => c.dataKey === colKey);
        if (getHelper(col) !== collectibleHelper) {
            return;
        }

        this.dropDownVisible = false;
        this.setState({
            popoverAnchorEl: popoverTarget,
            popoverColKey: colKey,
        });
    };

    closePopover = (_: KeyboardEvent<HTMLDivElement>, reason: string) => {
        let bumpsVersion = false;
        if (reason === 'backdropClick' || reason === 'enterKeyDown') {
            bumpsVersion = this.commitFilterChange();
        }
        this.setState((state) => {
            return {
                popoverAnchorEl: null,
                popoverColKey: null,
                deferredFilterChange: null,
                indirectionVersion:
                    state.indirectionVersion + (bumpsVersion ? 1 : 0),
            };
        });
    };

    makeColumnFilterEditor = () => {
        const { columns, rows, filter, defersFilterChanges } = this.props;
        const {
            popoverColKey,
            indexer,
            deferredFilterChange,
            indirectionVersion,
        } = this.state;
        const colKey = popoverColKey;
        const outerParams = indexer?.getColFilterOuterParams(colKey);
        const userParams =
            !defersFilterChanges || !deferredFilterChange
                ? indexer?.getColFilterUserParams(colKey)
                : deferredFilterChange.newVal ?? undefined;
        const prefiltered = preFilterData(
            columns,
            rows,
            filter,
            indexer,
            indirectionVersion
        );

        const options: any[] = [];
        if (outerParams) {
            options.push(...outerParams);
        }
        // @ts-ignore colKey could be null, how to handle this ?
        const colStat = prefiltered?.colsStats?.[colKey];
        if (colStat?.seen) {
            Object.keys(colStat.seen).forEach((key) => {
                if (options.findIndex((o) => o === key) < 0) {
                    options.push(key);
                }
            });
        }
        options.sort();

        return (
            <AmongChooser
                options={options}
                value={userParams}
                id={`fielt${colKey}`}
                setValue={(newVal) => {
                    this.onFilterParamsChange(newVal, colKey);
                }}
                onDropDownVisibility={(visible) => {
                    this.dropDownVisible = visible;
                }}
            />
        );
    };

    commitFilterChange = () => {
        const { deferredFilterChange, indexer } = this.state;
        if (deferredFilterChange) {
            const { colKey } = deferredFilterChange;
            let { newVal } = deferredFilterChange;
            if (newVal?.length === 0) {
                newVal = null;
            }
            if (indexer?.setColFilterUserParams(colKey, newVal)) {
                return true;
            }
        }

        return false;
    };

    setVersion = (v: number) => {
        this.setState({ indirectionVersion: v });
    };

    sortClickHandler = (evt: MouseEvent, _: unknown, columnIndex: number) => {
        const { columns } = this.props;
        const colKey = columns[columnIndex].dataKey;

        const { indexer, indirectionVersion } = this.state;

        if (evt.altKey) {
            // @ts-ignore should be currentTarget maybe ?
            this.openPopover(evt.target, colKey);
            return;
        }

        let way = ChangeWays.SIMPLE;
        if (evt.ctrlKey && evt.shiftKey) {
            way = ChangeWays.AMEND;
        } else if (evt.ctrlKey) {
            way = ChangeWays.REMOVE;
        } else if (evt.shiftKey) {
            way = ChangeWays.TAIL;
        }

        if (indexer?.updateSortingFromUser(colKey, way)) {
            this.setState({
                indirectionVersion: indirectionVersion + 1,
            });
        }
    };

    filterClickHandler = (
        _: MouseEvent,
        target: Element | undefined,
        columnIndex: number
    ) => {
        const { columns } = this.props;
        // ColumnHeader to (header) TableCell
        const retargeted = target?.parentNode ?? target;

        const colKey = columns[columnIndex].dataKey;
        // @ts-ignore still not the good types
        this.openPopover(retargeted, colKey);
    };

    sortableHeader = ({
        label,
        columnIndex,
    }: {
        label: string;
        columnIndex: number;
    }) => {
        const { columns, rows, filter, sort } = this.props;
        const { indexer } = this.state;
        const colKey = columns[columnIndex].dataKey;
        const signedRank = indexer?.columnSortingSignedRank(colKey);
        const userParams = indexer?.getColFilterUserParams(colKey);
        const { numeric } = columns[columnIndex];

        const prefiltered = preFilterData(
            columns,
            rows,
            filter,
            indexer,
            indexer?.filterVersion
        );
        const colStat = prefiltered?.colsStats?.[colKey];
        let filterLevel = 0;
        if (userParams?.length) {
            filterLevel += 1;
            if (!colStat?.seen) {
                filterLevel += 2;
            } else if (
                userParams.filter((v: string) => !colStat.seen[v]).length
            ) {
                filterLevel += 2;
            }
        }

        // disable filtering when either:
        //  - the column is numeric, we only handle tags for string values
        //  - a cellRenderer is defined, as we have no simple way to match for chosen value(s)
        //  - using an external sort, because it would hardly know about the indexer filtering
        const onFilterClick =
            numeric || sort || columns[columnIndex].cellRenderer
                ? undefined
                : (ev: MouseEvent<SVGSVGElement>, retargeted?: Element) => {
                      this.filterClickHandler(ev, retargeted, columnIndex);
                  };
        return (
            <ColumnHeader
                label={label}
                ref={(e) => this.registerHeader(label, e)}
                sortSignedRank={signedRank}
                filterLevel={filterLevel}
                numeric={numeric ?? false}
                onSortClick={(
                    ev: MouseEvent<HTMLDivElement>,
                    name?: Element
                ) => {
                    this.sortClickHandler(ev, name, columnIndex);
                }}
                onFilterClick={onFilterClick}
            />
        );
    };

    simpleHeaderRenderer = ({ label }: { label: string }) => {
        return (
            <div
                ref={(element) => {
                    this.registerHeader(label, element);
                }}
            >
                {label}
            </div>
        );
    };

    getRowClassName = ({
        index,
        rowGetter,
    }: {
        index: number;
        rowGetter: any; // Should be ((index: number) => RowProps) | ((index: number) => number) but it's not compatible with the code reorderIndex should be fixed to return only (index: number) => RowProps
    }) => {
        const { classes, onRowClick } = this.props;
        return clsx(
            composeClasses(classes, cssTableRow),
            composeClasses(classes, cssFlexContainer),
            index % 2 === 0 && composeClasses(classes, cssRowBackgroundDark),
            index % 2 !== 0 && composeClasses(classes, cssRowBackgroundLight),
            rowGetter(index)?.notClickable === true &&
                composeClasses(classes, cssNoClick), // Allow to define a row as not clickable
            {
                [composeClasses(classes, cssTableRowHover)]:
                    index !== -1 && onRowClick != null,
            }
        );
    };

    onClickableRowClick = (event: RowMouseEventHandlerParams) => {
        const { onRowClick } = this.props;
        if (
            event.rowData?.notClickable !== true ||
            event.event?.shiftKey ||
            event.event?.ctrlKey
        ) {
            // @ts-ignore onRowClick is possibly undefined
            onRowClick(event);
        }
    };

    cellRenderer = ({ cellData, columnIndex, rowIndex }: TableCellProps) => {
        const { columns, classes, rowHeight, onCellClick, rows, tooltipSx } =
            this.props;

        const displayedValue = MuiVirtualizedTable.getDisplayValue(
            columns[columnIndex],
            cellData
        );

        return (
            <TableCell
                component="div"
                className={clsx(
                    composeClasses(classes, cssTableCell),
                    composeClasses(classes, cssFlexContainer),
                    {
                        [composeClasses(classes, cssNoClick)]:
                            displayedValue === undefined ||
                            rows[rowIndex]?.notClickable === true ||
                            onCellClick == null ||
                            columns[columnIndex].clickable === undefined ||
                            !columns[columnIndex].clickable,
                        [composeClasses(classes, cssTableCellColor)]:
                            displayedValue === undefined ||
                            (onCellClick !== null &&
                                !rows[rowIndex]?.notClickable === true &&
                                columns[columnIndex].clickable !== undefined &&
                                columns[columnIndex].clickable),
                    }
                )}
                variant="body"
                style={{ height: rowHeight, width: '100%' }}
                align={
                    (columnIndex != null && columns[columnIndex].numeric) ||
                    false
                        ? 'right'
                        : 'left'
                }
                onClick={() => {
                    if (
                        onCellClick &&
                        columns[columnIndex].clickable !== undefined &&
                        !rows[rowIndex]?.notClickable === true &&
                        columns[columnIndex].clickable
                    ) {
                        onCellClick(rows[rowIndex], columns[columnIndex]);
                    }
                }}
            >
                <OverflowableText
                    text={displayedValue}
                    // @ts-ignore not really consistent but it should be legacy
                    tooltipStyle={classes.cellTooltip}
                    tooltipSx={{ ...defaultTooltipSx, ...tooltipSx }}
                />
            </TableCell>
        );
    };

    registerHeader(label: string, header: unknown) {
        if (this.headers.current) {
            this.headers.current[label] = header;
        }
    }

    registerObserver(element: Element) {
        if (element !== null) {
            this.observer.observe(element);
        }
    }

    computeHeaderSize() {
        const { headerHeight: stateHeaderHeight } = this.state;
        const { headerHeight: propsHeaderHeight } = this.props;
        const headers = Object.values(this.headers.current);
        if (headers.length === 0) {
            return;
        }
        // for now keep 'historical' use of scrollHeight,
        // though it can not make a difference from clientHeight,
        // as overflow-y as no scroll value
        const scrollHeights = headers.map((header: any) => header.scrollHeight);
        const computedHeaderHeight = Math.max(
            Math.max(...scrollHeights) + DEFAULT_CELL_PADDING,
            propsHeaderHeight
            // hides (most often) padding override by forcing height
        );
        if (computedHeaderHeight !== stateHeaderHeight) {
            this.setState({
                headerHeight: computedHeaderHeight,
            });
        }
    }

    makeHeaderRenderer(dataKey: string, columnIndex: number) {
        const { columns, classes, sortable } = this.props;
        const { indexer, headerHeight } = this.state;
        return (headerProps: any) => {
            return (
                <TableCell
                    component="div"
                    className={clsx(
                        composeClasses(classes, cssTableCell),
                        composeClasses(classes, cssFlexContainer),
                        composeClasses(classes, cssNoClick),
                        composeClasses(classes, cssHeader)
                    )}
                    variant="head"
                    style={{ height: headerHeight }}
                    align={
                        columns[columnIndex].numeric || false ? 'right' : 'left'
                    }
                    ref={(e: Element) => this.registerObserver(e)}
                >
                    {sortable && indexer
                        ? this.sortableHeader({
                              ...headerProps,
                              columnIndex,
                              key: { dataKey },
                          })
                        : this.simpleHeaderRenderer({
                              ...headerProps,
                          })}
                    {columns[columnIndex].extra && columns[columnIndex].extra}
                </TableCell>
            );
        };
    }

    render() {
        const {
            rows,
            columns,
            filter,
            sort,
            exportCSVDataKeys,
            className,
            enableExportCSV,
        } = this.props;

        const { indexer, indirectionVersion, popoverAnchorEl } = this.state;
        const { viewIndexToModel, rowGetter } = reorderIndex(
            indexer,
            indirectionVersion,
            rows,
            columns,
            filter,
            sort
        );

        const sizes = this.sizes(columns, rows, rowGetter);
        const csvHeaders = this.csvHeaders(columns, exportCSVDataKeys);

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
                className={className}
            >
                {enableExportCSV && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    >
                        <FormattedMessage id="MuiVirtualizedTable/exportCSV" />
                        <CsvDownloader
                            datas={this.getCSVData}
                            columns={csvHeaders}
                            filename={this.getCSVFilename()}
                        >
                            <IconButton
                                aria-label="exportCSVButton"
                                size="large"
                            >
                                <GetAppIcon />
                            </IconButton>
                        </CsvDownloader>
                    </div>
                )}
                <div style={{ flexGrow: 1 }}>
                    <AutoSizer>
                        {({ height, width }) =>
                            this.makeSizedTable(
                                height,
                                width,
                                sizes,
                                viewIndexToModel,
                                rowGetter
                            )
                        }
                    </AutoSizer>
                </div>
                {popoverAnchorEl && (
                    <Popover
                        anchorEl={popoverAnchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onKeyDownCapture={this.handleKeyDownOnPopover}
                        onClose={this.closePopover}
                        open={!!popoverAnchorEl}
                        PaperProps={{ style: { minWidth: '20ex' } }}
                    >
                        {this.makeColumnFilterEditor()}
                    </Popover>
                )}
            </div>
        );
    }
}

const nestedGlobalSelectorsStyles = toNestedGlobalSelectors(
    defaultStyles,
    generateMuiVirtualizedTableClass
);

export default styled(MuiVirtualizedTable)(nestedGlobalSelectorsStyles);
