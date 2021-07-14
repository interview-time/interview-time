import "./App.css";
import React, { useEffect } from "react";
import { Switch, withRouter } from "react-router-dom";
import {
    routeHome,
    routeAccount,
    routeReports,
    routeInterviewAdd,
    routeInterviews,
    routeNews,
    routeTemplateAdd,
    routeTemplates,
    routeLibrary,
} from "./components/utils/route";
import Default from "./pages/default/default";
import Interviews from "./pages/interviews/interviews";
import Interview from "./pages/interview-scorecard/interview-scorecard";
import Templates from "./pages/templates/templates";
import Template from "./pages/template/template-details";
import Account from "./pages/account/account";
import { useAuth0 } from "./react-auth0-spa";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
import ScheduleInterview from "./pages/interview/schedule-interview";
import News from "./pages/news/news";
import Candidates from "./pages/candidates/candidates";
import InterviewEvaluation from "./pages/interview-evaluation/interview-evaluation";
import InterviewReport from "./pages/interview-report/interview-report";
import ReactGA from "react-ga";
import Library from "./pages/library/library";

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
            <PrivateRoute path={routeHome()} exact component={Default} />
            <PrivateRoute path={routeInterviews()} exact component={Interviews} />
            <PrivateRoute path={routeReports()} exact component={Candidates} />
            <PrivateRoute path={routeInterviewAdd()} exact component={ScheduleInterview} />
            <PrivateRoute path="/interviews/details/:id" exact component={ScheduleInterview} />
            <PrivateRoute path="/interviews/scorecard/:id" exact component={Interview} />
            <PrivateRoute path="/interviews/evaluation/:id" exact component={InterviewEvaluation} />
            <PrivateRoute path="/reports/:id" exact component={InterviewReport} />
            <PrivateRoute path={routeTemplates()} exact component={Templates} />
            <PrivateRoute path={routeTemplateAdd()} exact component={Template} />
            <PrivateRoute path="/templates/details/:id" exact component={Template} />
            <PrivateRoute path={routeNews()} exact component={News} />
            <PrivateRoute path={routeAccount()} exact component={Account} />
            <PrivateRoute path={routeLibrary()} exact component={Library} />
        </Switch>
    );
}

export default withRouter(App);
