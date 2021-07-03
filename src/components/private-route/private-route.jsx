import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "../../react-auth0-spa";
import { connect } from "react-redux";
import Spinner from "../spinner/spinner";
import { loadProfile, setupUser } from "../../store/user/actions";

const PrivateRoute = ({
    loadProfile,
    setupUser,
    profile,
    loadingProfile,
    component: Component,
    path,
    ...rest
}) => {
    const { loading, isAuthenticated, loginWithRedirect, user } = useAuth0();

    useEffect(() => {
        if (isAuthenticated && user != null) {
            loadProfile(user.name, user.email);
        }

        if (loading || isAuthenticated) {
            return;
        }
        const fn = async () => {
            await loginWithRedirect({
                appState: { targetUrl: path },
            });
        };
        fn();
    }, [loading, isAuthenticated, loginWithRedirect, path, loadProfile, user]);

    const render = (props) => (isAuthenticated === true ? <Component {...props} /> : null);

    return profile && !loadingProfile ? <Route path={path} render={render} {...rest} /> : <Spinner />;
};

const mapDispatch = { loadProfile, setupUser };
const mapState = (state) => {
    return {
        profile: state.user.profile,
        loadingProfile: state.user.loading,
    };
};

export default connect(mapState, mapDispatch)(PrivateRoute);
