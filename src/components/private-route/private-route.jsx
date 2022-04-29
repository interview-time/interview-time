import React, { useEffect } from "react";
import { Route, useHistory, useLocation } from "react-router-dom";
import { useAuth0 } from "../../react-auth0-spa";
import { connect } from "react-redux";
import Spinner from "../spinner/spinner";
import { loadProfile, acceptInvite } from "../../store/user/actions";
import { getParameterByName, deleteParameterByName } from "../utils/route";

const PrivateRoute = ({ loadProfile, acceptInvite, profile, loadingProfile, component: Component, path, ...rest }) => {
    const { loading, isAuthenticated, loginWithRedirect, user, appState } = useAuth0();

    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        const inviteToken = getParameterByName("inviteToken");
        const mode = getParameterByName("mode");

        if (isAuthenticated && user != null) {
            const invite = inviteToken ?? appState?.inviteToken;
            
            loadProfile(user.name, user.email, invite);

            if (inviteToken) {
                const queryParams = new URLSearchParams(location.search);
                if (queryParams.has("inviteToken")) {
                    queryParams.delete("inviteToken");
                    history.replace({
                        search: queryParams.toString(),
                    });
                }
            }
        }

        if (loading || isAuthenticated) {
            return;
        }

        const fn = async () => {
            await loginWithRedirect({
                appState: { targetUrl: path, inviteToken: inviteToken },
                screen_hint: mode,
            });
        };
        fn();
    }, [loading, isAuthenticated, loginWithRedirect, path, loadProfile, acceptInvite, user]);

    const render = props => (isAuthenticated === true ? <Component {...props} /> : null);

    return profile && !loadingProfile ? <Route path={path} render={render} {...rest} /> : <Spinner />;
};

const mapStateToProps = state => {
    return {
        profile: state.user.profile,
        loadingProfile: state.user.loading,
    };
};

export default connect(mapStateToProps, { loadProfile, acceptInvite })(PrivateRoute);
