import "./App.css";
import React, { useEffect } from "react";
import { Redirect, Switch, withRouter } from "react-router-dom";
import {
    routeAccount,
    routeCandidates,
    routeInterviewAdd,
    routeInterviews,
    routeNews,
    routeTemplateAdd,
    routeTemplates,
} from "./components/utils/route";
import Interviews from "./pages/interviews/interviews";
import Interview from "./pages/interview-scorecard/interview-scorecard";
import Templates from "./pages/templates/templates";
import Template from "./pages/template/template-details";
import Account from "./pages/account/account";
import { useAuth0 } from "./react-auth0-spa";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
import InterviewWizard from "./pages/interview-wizard/interview-wizard";
import News from "./pages/news/news";
import Candidates from "./pages/candidates/candidates";
import InterviewCandidate from "./pages/interview-evaluation/interview-evaluation";
import ReactGA from "react-ga";

function App({ history }) {
    useEffect(() => {
        if (process.env.REACT_APP_GA_TRACKING_ID) {
            ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
            ReactGA.set({ page: window.location.pathname + window.location.search });
            ReactGA.pageview(window.location.pathname + window.location.search);
        }

        history.listen((location) => {
            if (process.env.REACT_APP_GA_TRACKING_ID) {
                ReactGA.set({ page: location.pathname });
                ReactGA.pageview(location.pathname);
            }
        });
    }, [history]);

    const { loading } = useAuth0();

    if (loading) {
        return <Spinner />;
    }

    return (
        <Switch>
            <PrivateRoute path="/" exact render={() => <Redirect to={routeTemplates()} />} />
            <PrivateRoute path={routeInterviews()} exact component={Interviews} />
            <PrivateRoute path={routeCandidates()} exact component={Candidates} />
            <PrivateRoute path={routeInterviewAdd()} exact component={InterviewWizard} />
            <PrivateRoute path="/interviews/details/:id" exact component={InterviewWizard} />
            <PrivateRoute path="/interviews/scorecard/:id" exact component={Interview} />
            <PrivateRoute path="/interviews/candidate/:id" exact component={InterviewCandidate} />
            <PrivateRoute path={routeTemplates()} exact component={Templates} />
            <PrivateRoute path={routeTemplateAdd()} exact component={Template} />
            <PrivateRoute path="/templates/details/:id" exact component={Template} />
            <PrivateRoute path={routeNews()} exact component={News} />
            <PrivateRoute path={routeAccount()} exact component={Account} />
        </Switch>
    );
}

export default withRouter(App);
