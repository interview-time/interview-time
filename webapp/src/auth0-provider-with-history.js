import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "./react-auth0-spa";
import { log } from "./utils/log";

const Auth0ProviderWithHistory = ({ children }) => {
    const history = useHistory();

    const onRedirectCallback = appState => {
        log(appState);
        let newPath = sessionStorage.getItem("forwardUrl");
        if (newPath) {
            sessionStorage.removeItem("forwardUrl");
            history.push(newPath);
        } else {
            history.push(appState?.returnTo || window.location.pathname);
        }
    };

    return (
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
            audience={process.env.REACT_APP_AUTH0_AUDIENCE}
            redirect_uri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;
