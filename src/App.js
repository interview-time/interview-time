import "./App.less";
import React, { useEffect } from "react";
import { Switch, withRouter, Route } from "react-router-dom";
import {
    routeAccount,
    routeHome,
    routeInterviewAdd,
    routeInterviewDetails,
    routeInterviewReport,
    routeInterviews,
    routeInterviewScorecard,
    routeLibraryTemplatePreview,
    routeNews,
    routeReports,
    routeTemplateBlank,
    routeTemplateEdit,
    routeTemplateLibrary,
    routeTemplatePreview,
    routeTemplates,
    routeSharedTemplate,
    routeTeamNew,
    routeTeamSettings,
    routeTeamJoin,
} from "./components/utils/route";
import Default from "./pages/dashboard/dashboard";
import Interviews from "./pages/interviews/interviews";
import InterviewScorecard from "./pages/interview-scorecard/interview-scorecard";
import InterviewSchedule from "./pages/interview-schedule/interview-schedule";
import Templates from "./pages/templates/templates";
import TemplateEdit from "./pages/template-edit/template-edit";
import Reports from "./pages/reports/reports";
import News from "./pages/news/news";
import Account from "./pages/account/account";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
import ReactGA from "react-ga";
import TemplateNew from "./pages/template-library/template-library";
import LibraryTemplatePreview from "./pages/template-preview-library/library-template-preview";
import { useAuth0 } from "./react-auth0-spa";
import TemplatePreview from "./pages/template-preview/template-preview";
import SharedTemplate from "./pages/shared-template/shared-template";
import NewTeam from "./pages/team-new/team-new";
import TeamSettings from "./pages/team-settings/team-settings";
import JoinTeam from "./pages/team-join/team-join";
import InterviewReport from "./pages/interview-scorecard/interview-report";

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
            <PrivateRoute path={routeInterviewDetails()} exact component={InterviewSchedule} />
            <PrivateRoute path={routeInterviewScorecard()} exact component={InterviewScorecard} />
            <PrivateRoute path={routeInterviewReport()} exact component={InterviewReport} />
            <PrivateRoute path={routeTemplates()} exact component={Templates} />
            <PrivateRoute path={routeTemplateBlank()} exact component={TemplateEdit} />
            <PrivateRoute path={routeTemplateLibrary()} exact component={TemplateNew} />
            <PrivateRoute path={routeTemplateEdit()} exact component={TemplateEdit} />
            <PrivateRoute path={routeTemplatePreview()} exact component={TemplatePreview} />
            <PrivateRoute path={routeLibraryTemplatePreview()} exact component={LibraryTemplatePreview} />
            <PrivateRoute path={routeNews()} exact component={News} />
            <PrivateRoute path={routeAccount()} exact component={Account} />
            <PrivateRoute path={routeTeamNew()} exact component={NewTeam} />
            <PrivateRoute path={routeTeamSettings()} exact component={TeamSettings} />
            <Route path={routeSharedTemplate()} exact component={SharedTemplate} />
            <Route path={routeTeamJoin()} exact component={JoinTeam} />
        </Switch>
    );
}

export default withRouter(App);
