/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';

import TopBar from '../../src/components/TopBar';
import Popup from '../../src/components/Popup';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AuthenticationRouter from '../../src/components/AuthenticationRouter';
import {
    initializeAuthenticationDev,
    logout,
} from '../../src/utils/AuthService';
import { useRouteMatch } from 'react-router';
import { IntlProvider } from 'react-intl';

import { BrowserRouter, useHistory, useLocation } from 'react-router-dom';

import { top_bar_en, top_bar_fr, login_fr, login_en } from '../../src/index';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import PowsyblLogo from '-!@svgr/webpack!../images/powsybl_logo.svg';
import Button from '@material-ui/core/Button';

const messages = {
    en: { ...login_en, ...top_bar_en },
    fr: { ...login_fr, ...top_bar_fr },
};

const language = navigator.language.split(/[-_]/)[0]; // language without region code

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

const AppContent = () => {
    const history = useHistory();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const [userManager, setUserManager] = useState({
        instance: null,
        error: null,
    });
    const [user, setUser] = useState(null);

    const matchSilentRenewCallbackUrl = useRouteMatch({
        path: '/silent-renew-callback',
        exact: true,
    });

    // Get the routeMatch at page load, so we ignore the exhaustive deps check
    const initialMatchSilentRenewCallbackUrl = useCallback(
        () => matchSilentRenewCallbackUrl,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )();

    const dispatch = (e) => {
        if (e.type === 'USER') {
            setUser(e.user);
        }
    };

    const apps = [
        { name: 'App1', url: '/app1', appColor: 'red' },
        { name: 'App2', url: '/app2' },
    ];

    const handleClickOpenDialog = () => {
        setOpen(true);
    };

    useEffect(() => {
        initializeAuthenticationDev(
            dispatch,
            initialMatchSilentRenewCallbackUrl != null
        )
            .then((userManager) => {
                setUserManager({ instance: userManager, error: null });
                userManager.signinSilent();
            })
            .catch(function (error) {
                setUserManager({ instance: null, error: error.message });
                console.debug('error when creating userManager');
            });
        // Note: initialMatchSilentRenewCallbackUrl doesn't change
    }, [initialMatchSilentRenewCallbackUrl]);

    return (
        <IntlProvider locale={language} messages={messages[language]}>
            <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <TopBar
                    appName="Demo"
                    appColor="#808080"
                    appLogo=<PowsyblLogo />
                    onParametersClick={() => console.log('settings')}
                    onLogoutClick={() => logout(dispatch, userManager.instance)}
                    onLogoClick={() => console.log('logo')}
                    user={user}
                    appsAndUrls={apps}
                />
                {user !== null ? (
                    <Box mt={20}>
                        <Typography
                            variant="h3"
                            color="textPrimary"
                            align="center"
                        >
                            Connected
                        </Typography>
                        <Button onClick={handleClickOpenDialog}>
                            Open dialog
                        </Button>
                        <Popup
                            open={open}
                            setOpen={setOpen}
                            maxWidth={'xs'}
                            fullWidth={true}
                            popupTitle={'Popup title here'} // Add text of title here
                            popupContent={'Popup content here'} // Add content of popup here
                            showPopupTitle={true} // If you need to show title set it to true
                            customTextValidationBtn={'Create'} // Customize the text of validation button
                            customTextCancelBtn={'Cancel'} // Customize the text of cancellation button
                            showSingleBtn={true} // Show single button action
                            showSingleBtnInLeft={true} // Show single button in left with custom design
                        ></Popup>
                    </Box>
                ) : (
                    <AuthenticationRouter
                        userManager={userManager}
                        signInCallbackError={null}
                        dispatch={dispatch}
                        history={history}
                        location={location}
                    />
                )}
            </ThemeProvider>
        </IntlProvider>
    );
};

const App = () => {
    return (
        <BrowserRouter basename={'/'}>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
