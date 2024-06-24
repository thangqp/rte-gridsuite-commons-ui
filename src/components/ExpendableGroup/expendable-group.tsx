/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Theme,
    Typography,
} from '@mui/material';
import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { ExpandCircleDown, ExpandMore } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

export const styles = {
    accordion: (theme: Theme) => ({
        '&:before': {
            display: 'none',
        },
        background: 'none',
    }),
    accordionSummary: (theme: Theme) => ({
        flexDirection: 'row-reverse', // place icon at the left
        padding: 0, // reset default left right space in summary
        '.MuiAccordionSummary-content': {
            paddingLeft: 1, // align text label
        },
        '&:not(.Mui-expanded)': {
            // show a fake divider at the bottom of summary
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
        },

        '& .MuiAccordionSummary-expandIconWrapper': {
            transform: 'rotate(-90deg)',
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(0deg)',
        },
    }),
    accordionDetails: (theme: Theme) => ({
        padding: 0, // reset default left right space in details
    }),
};

interface ExpandableGroupProps extends PropsWithChildren {
    renderHeader: ReactNode;
}

const ExpendableGroup = ({ renderHeader, children }: ExpandableGroupProps) => {
    const [mouseHover, setMouseHover] = useState(false);

    return (
        <Accordion sx={styles.accordion} disableGutters elevation={0}>
            <AccordionSummary
                sx={styles.accordionSummary}
                expandIcon={mouseHover ? <ExpandCircleDown /> : <ExpandMore />}
                onMouseEnter={(event) => setMouseHover(true)}
                onMouseLeave={(event) => setMouseHover(false)}
            >
                {typeof renderHeader === 'string' ? (
                    <Typography>
                        <FormattedMessage id={renderHeader} />
                    </Typography>
                ) : (
                    renderHeader
                )}
            </AccordionSummary>
            <AccordionDetails sx={styles.accordionDetails}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
};

export default ExpendableGroup;
