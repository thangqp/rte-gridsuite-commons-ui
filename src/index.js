import React from 'react'

export TopBar from './components/TopBar'
export Authentication from './components/Authentication'
export SignInCallbackHandler from './components/SignInCallbackHandler'
export SilentRenewCallbackHandler from './components/SilentRenewCallbackHandler'

export UserManagerMock from './utils/UserManagerMock'
export {initializeAuthentication, handleSilentRenewCallback, login, logout, dispatchUser, handleSigninCallback, getPreLoginPath} from './utils/AuthService'
