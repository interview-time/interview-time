import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import posthog from 'posthog-js'
import { Integrations } from "@sentry/tracing";
import { BrowserRouter } from "react-router-dom";
import "inter-ui/inter.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import Auth0ProviderWithHistory from "./auth0-provider-with-history";

Sentry.init({
    dsn: "https://8a5b19779cd84d55b20bcf766df59495@o519027.ingest.sentry.io/5628792",
    integrations: [new Integrations.BrowserTracing()],
    denyUrls: ["http://localhost:3000/"],
    tracesSampleRate: 1.0,
});

// This will initialize PostHog with your API key.
// https://posthog.com/docs/integrate/client/js
//
if (!window.location.href.includes('localhost')) {
    posthog.init('phc_vXedHxzazcCCBwwyv0P6B08m30J2iUQCTw549Nh0bQW', { 
        api_host: 'https://app.posthog.com',
        session_recording: {
            maskAllInputs: false
        }
    })
}

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Auth0ProviderWithHistory>
                    <App />
                </Auth0ProviderWithHistory>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
