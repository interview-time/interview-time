import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";

const Auth0ProviderWithHistory = ({ children }) => {
    const history = useHistory();

    const onRedirectCallback = (appState) => {
        console.log(appState);
        let newPath = sessionStorage.getItem("forwardUrl");
        if (newPath) {
            sessionStorage.removeItem("forwardUrl");
            history.push(newPath);
        } else {
            history.push(appState?.returnTo || window.location.pathname);
        }
    };

    useEffect(() => {
        console.log(config);
    });
    return (
        <Auth0Provider
            domain={config.domain}
            client_id={config.clientId}
            audience={config.audience}
            redirect_uri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;
