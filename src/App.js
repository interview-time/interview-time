import "./App.less";
import React, { useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import {
    routeProfile,
    routeCandidateDetails,
    routeCandidates,
    routeHome,
    routeInterviewAdd,
    routeInterviewDetails,
    routeInterviewReport,
    routeInterviews,
    routeInterviewScorecard,
    routeLibraryTemplatePreview,
    routeReports,
    routeSharedTemplate,
    routeSharedScorecard,
    routeTeamNew,
    routeTeamSettings,
    routeTemplateBlank,
    routeTemplateEdit,
    routeTemplateLibrary,
    routeTemplatePreview,
    routeTemplates,
} from "./components/utils/route";
import Default from "./pages/dashboard/dashboard";
import Interviews from "./pages/interviews/interviews";
import InterviewScorecard from "./pages/interview-scorecard/interview-scorecard";
import InterviewSchedule from "./pages/interview-schedule/interview-schedule";
import Templates from "./pages/templates/templates";
import TemplateEdit from "./pages/template-edit/template-edit";
import Reports from "./pages/reports/reports";
import Profile from "./pages/account/profile";
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
import InterviewReport from "./pages/interview-scorecard/interview-report";
import Candidates from "./pages/candidates/candidates";
import CandidateDetails from "./pages/candidate-details/candidate-details";
import SharedScorecard from "./pages/shared-scorecard/shared-scorecard";

function App({ history }) {
    useEffect(() => {
        if (process.env.REACT_APP_GA_TRACKING_ID) {
            ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
            ReactGA.set({ page: window.location.pathname + window.location.search });
            ReactGA.pageview(window.location.pathname + window.location.search);
        }

        history.listen(location => {
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
            <PrivateRoute path={routeProfile()} exact component={Profile} />
            <PrivateRoute path={routeTeamNew()} exact component={NewTeam} />
            <PrivateRoute path={routeTeamSettings()} exact component={TeamSettings} />
            <PrivateRoute path={routeCandidates()} exact component={Candidates} />
            <PrivateRoute path={routeCandidateDetails()} exact component={CandidateDetails} />
            <Route path={routeSharedTemplate()} exact component={SharedTemplate} />
            <Route path={routeSharedScorecard()} exact component={SharedScorecard} />
        </Switch>
    );
}

export default withRouter(App);
