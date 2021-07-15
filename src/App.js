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
import InterviewScorecard from "./pages/interview-scorecard/interview-scorecard";
import InterviewSchedule from "./pages/interview-schedule/interview-schedule";
import InterviewEvaluation from "./pages/interview-evaluation/interview-evaluation";
import Templates from "./pages/templates/templates";
import TemplateDetails from "./pages/template-details/template-details";
import Reports from "./pages/reports/reports";
import ReportDetails from "./pages/report-details/report-details";
import News from "./pages/news/news";
import Account from "./pages/account/account";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
import ReactGA from "react-ga";
import Library from "./pages/library/library";
import { useAuth0 } from "./react-auth0-spa";

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
            <PrivateRoute path={routeReports()} exact component={Reports} />
            <PrivateRoute path={routeInterviewAdd()} exact component={InterviewSchedule} />
            <PrivateRoute path="/interviews/details/:id" exact component={InterviewSchedule} />
            <PrivateRoute path="/interviews/scorecard/:id" exact component={InterviewScorecard} />
            <PrivateRoute path="/interviews/evaluation/:id" exact component={InterviewEvaluation} />
            <PrivateRoute path="/reports/:id" exact component={ReportDetails} />
            <PrivateRoute path={routeTemplates()} exact component={Templates} />
            <PrivateRoute path={routeTemplateAdd()} exact component={TemplateDetails} />
            <PrivateRoute path="/templates/details/:id" exact component={TemplateDetails} />
            <PrivateRoute path={routeNews()} exact component={News} />
            <PrivateRoute path={routeAccount()} exact component={Account} />
            <PrivateRoute path={routeLibrary()} exact component={Library} />
        </Switch>
    );
}

export default withRouter(App);
