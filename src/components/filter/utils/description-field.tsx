/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Grid,
    Theme,
    Typography,
} from '@mui/material';
import { ExpandCircleDown, ExpandMore } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import ExpandingTextField from '../../inputs/react-hook-form/ExpandingTextField';
import { FieldConstants } from '../../../utils/field-constants';

export const styles = {
    descriptionForm: (theme: Theme) => ({
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    }),
    descriptionAccordion: {
        '&:before': {
            display: 'none',
        },
        background: 'none',
    },
    descriptionAccordionSummary: (theme: Theme) => ({
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper': {
            transform: 'rotate(-90deg)',
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(0deg)',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(0),
        },
        '& .MuiAccordionSummary-root': {
            padding: theme.spacing(0),
        },
    }),
    descriptionAccordionDetails: (theme: Theme) => ({
        paddingLeft: theme.spacing(3),
    }),
};

export function LineSeparator() {
    return (
        <Grid item xs={12} sx={styles.descriptionAccordionDetails}>
            <Divider />
        </Grid>
    );
}

export const DescriptionField = () => {
    const [showDescription, setShowDescription] = useState(false);
    const [mouseHover, setMouseHover] = useState(false);

    return (
        <Grid item xs={12} sx={styles.descriptionForm}>
            <Accordion
                sx={styles.descriptionAccordion}
                disableGutters
                elevation={0}
                expanded={showDescription}
                onChange={(event, showed) => setShowDescription(showed)}
            >
                <AccordionSummary
                    sx={styles.descriptionAccordionSummary}
                    expandIcon={
                        mouseHover ? <ExpandCircleDown /> : <ExpandMore />
                    }
                    onMouseEnter={(event) => setMouseHover(true)}
                    onMouseLeave={(event) => setMouseHover(false)}
                >
                    <Typography
                        sx={{
                            width: '50%',
                            flexShrink: 0,
                            marginLeft: '5px',
                        }}
                    >
                        <FormattedMessage id={'Description'} />
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={styles.descriptionAccordionDetails}>
                    <ExpandingTextField
                        name={FieldConstants.DESCRIPTION}
                        label={'descriptionProperty'}
                        minRows={3}
                        rows={5}
                    />
                </AccordionDetails>
            </Accordion>
            {!showDescription && <LineSeparator />}
        </Grid>
    );
};
