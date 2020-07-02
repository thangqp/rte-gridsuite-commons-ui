import React from 'react'

export TopBar from './components/TopBar'
export Login from './components/Login'
export SignInCallbackHandler from './components/SignInCallbackHandler'
export SilentRenewCallbackHandler from './components/SilentRenewCallbackHandler'
export AuthenticationRouter from './components/AuthenticationRouter'

export UserManagerMock from './utils/UserManagerMock'
export {initializeAuthentication, handleSilentRenewCallback, login, logout, dispatchUser, handleSigninCallback, getPreLoginPath} from './utils/AuthService'
