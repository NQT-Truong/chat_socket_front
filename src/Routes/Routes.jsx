import React from "react";

import {
    dashboard as dashboardRoutes,
    auth as authRoutes
} from "./index";

import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";

import {useSelector, shallowEqual} from "react-redux";

const childRoutes = ( routes) =>
    routes.map(({children, path: root_path, component: Component, isDashboardRaw}, index) =>
        children ? (
            // Route item with children
            children.map(({path, component: Component, noSidebar}, index) => (
                <Route
                    key={index}
                    path={root_path + path}
                    exact
                    render={props => (
                        // <Layout>
                            <Component {...props}/>
                        // </Layout>
                    )}
                />
            ))
        ) : (
            // Route item without children
            <Route
                key={index}
                path={root_path}
                exact
                render={props => (
                    // <Layout>
                        <Component {...props} />
                    // </Layout>
                )}
            />
        )
    );


const Routes = React.memo(() => {

    const user = useSelector(state => state.user, shallowEqual);

    const isLogin = Boolean(user.username );

    return (
        <Router>
            <Switch>
                {
                    isLogin ?
                        childRoutes(dashboardRoutes)
                        :
                        childRoutes(authRoutes)
                }
                <Route
                    render={() => <Redirect to={`${isLogin ? "/chat-home" : "/auth"}`}/>}
                />
            </Switch>
        </Router>
    )
})
export default Routes;


