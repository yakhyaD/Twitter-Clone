import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'


const AuthRoute = ({ component: Component, ...rest }) => {

    const authenticated = useSelector(state => state.user.authenticated)

    // handle request to auth when already authenticated
    const authPage = ["/login", "/signup"]
    if (authPage.includes(rest.path)) {
        return (
        <Route
            {...rest}
            render={(props) => authenticated ? <Redirect to='/home'/> : <Component {...props} /> }
        />
    )
    }
    return (
        <Route
            {...rest}
            render={(props) => !authenticated ? <Redirect to='/login'/> : <Component {...props} /> }
        />
    )
}

export default AuthRoute
