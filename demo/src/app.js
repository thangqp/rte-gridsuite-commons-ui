/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {useState} from 'react'

import TopBar from '../../src/components/TopBar'

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import AuthenticationRouter from "../../src/components/AuthenticationRouter";
import {UserManagerMock} from "../../src/utils/UserManagerMock";
import {logout} from "../../src/utils/AuthService";

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

    setTimeout(() => setUserManager({instance: new UserManagerMock({}), error : null}), 2000);

    return (
            <div>
                <ThemeProvider theme={lightTheme}>
                    <TopBar appName="StudyGrid"
                            onParametersClick={() => console.log("settings")}
                            onLogoutClick={() => console.log('logout')}
                            onLogoClick={() => console.log("logo")}
                            user={{profile : {name : "John Doe"}}} />

                    {
                        user !== null ?
                            (<TopBar appName="StudyGrid"
                                     onParametersClick={() => console.log("settings")}
                                     onLogoutClick={() => setUser(null)}
                                     onLogoClick={() => console.log("logo")}
                                     user={{profile : {name : "John Doe"}}} />
                            ) :
                            (<AuthenticationRouter userManager={userManager}
                                              signInCallbackError={null}
                                              dispatch={(e) => setUser(e.user)}
                                              history={history}
                                              location={location}/>)
                    }
                </ThemeProvider>
            </div>
    )
};

export default App;

