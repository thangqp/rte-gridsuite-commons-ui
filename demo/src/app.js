/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react'

import TopBar from '../../src/components/TopBar'

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import Login from "../../src/components/Login";
import AuthenticationRouter from "../../src/components/AuthenticationRouter";
import {UserManagerMock} from "../../src/utils/UserManagerMock";

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

    console.log(history);
    console.log(location);

    return (
            <div>
                <ThemeProvider theme={lightTheme}>
                    <TopBar appName="StudyGrid" onParametersClick={() => console.log("settings")} onLogoutClick={() => console.log("logout")} onLogoClick={() => console.log("logo")} user={{profile : {name : "John Doe"}}} />
                    <Login onLoginClick={() => console.log("onLoginClick callback")} disabled={false}/>
                    <Login onLoginClick={() => console.log("onLoginClick callback")} disabled={true}/>
                    <AuthenticationRouter userManager={{instance: new UserManagerMock({}), error : null}}
                                          signInCallbackError={null}
                                          dispatch={() => console.log('dispatch')}
                                          history={history}
                                          location={location}/>
                </ThemeProvider>
            </div>
    )
};

export default App;

