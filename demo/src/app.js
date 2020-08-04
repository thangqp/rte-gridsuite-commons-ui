/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {useEffect, useState} from 'react'

import TopBar from '../../src/components/TopBar'

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import AuthenticationRouter from "../../src/components/AuthenticationRouter";
import {initializeAuthenticationDev,logout} from "../../src/utils/AuthService";
import { useRouteMatch } from 'react-router';

import {
    useHistory,
    useLocation
} from "react-router-dom";

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
    }
});

const App = () => {
    const history = useHistory();
    const location = useLocation();

    const [userManager, setUserManager] = useState({instance: null, error : null});
    const [user, setUser] = useState(null);

    let matchSilentRenewCallbackUrl = useRouteMatch({
        path: '/silent-renew-callback',
        exact: true,
    });

    const dispatch = (e) => {if (e.type === 'USER' ) {setUser(e.user)}};

    useEffect(() => {
        initializeAuthenticationDev(dispatch, matchSilentRenewCallbackUrl != null)
            .then((userManager) => {
                setUserManager({ instance: userManager, error: null });
            })
            .catch(function (error) {
                setUserManager({ instance: null, error: error.message });
                console.debug('error when creating userManager');
            });
    }, []);

    return (
            <div>
                <ThemeProvider theme={lightTheme}>
                    <TopBar appName="DemoApp"
                            onParametersClick={() => console.log("settings")}
                            onLogoutClick={() =>  logout(dispatch, userManager.instance)}
                            onLogoClick={() => console.log("logo")}
                            user={user} />
                    {
                        user !== null ?
                            (<h1 style={{'marginLeft' : '45%', 'marginTop' : '10%'}}>Connected</h1>) :
                            (<AuthenticationRouter userManager={userManager}
                                              signInCallbackError={null}
                                              dispatch={dispatch}
                                              history={history}
                                              location={location}/>)
                    }
                </ThemeProvider>
            </div>
    )
};

export default App;

