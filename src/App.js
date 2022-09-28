import "./App.less";
import React, { useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import {
    routeCandidateDetails,
    routeCandidates,
    routeHome,
    routeInterviewAdd,
    routeLiveCodingChallenge,
    routeInterviewDetails,
    routeInterviewReport,
    routeInterviews,
    routeInterviewScorecard,
    routeLibraryTemplatePreview,
    routeProfile,
    routeReports,
    routeSharedScorecard,
    routeSharedTemplate,
    routeSubscription,
    routeTeamBilling,
    routeTeamMembers,
    routeTeamNew,
    routeTeamProfile,
    routeTemplateBlank,
    routeTemplateEdit,
    routeTemplateLibrary,
    routeTemplatePreview,
    routeTemplates,
    routeCandidateAdd,
    routeTakeHomeChallenge,
    routeTeamIntegration,
} from "./utils/route";
import Default from "./pages/dashboard/dashboard";
import Interviews from "./pages/interviews/interviews";
import InterviewScorecard from "./pages/interview-scorecard/interview-scorecard";
import InterviewSchedule from "./pages/interview-schedule/interview-schedule";
import Templates from "./pages/templates/templates";
import Reports from "./pages/reports/reports";
import Profile from "./pages/account/profile";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
import ReactGA from "react-ga";
import TemplateLibrary from "./pages/template-library/template-library";
import TemplateNew from "./pages/template-new/template-new";
import LibraryTemplatePreview from "./pages/template-preview-library/library-template-preview";
import { useAuth0 } from "./react-auth0-spa";
import TemplatePreview from "./pages/template-preview/template-preview";
import SharedTemplate from "./pages/shared-template/shared-template";
import NewTeam from "./pages/team-new/team-new";
import InterviewReport from "./pages/interview-report/interview-report";
import Candidates from "./pages/candidates/candidates";
import CandidateDetails from "./pages/candidate-details/candidate-details";
import Subscription from "./pages/subscription/subscription";
import TeamProfile from "./pages/account/team-profile";
import TeamMembers from "./pages/account/team-members";
import TeamBilling from "./pages/account/team-billing";
import TeamIntegration from "./pages/account/team-integration";
import LiveCodingChallenge from "./pages/challenge/live-coding/live-coding-challenge";
import InterviewReportShared from "./pages/interview-report/interview-report-shared";
import TakeHomeChallenge from "./pages/challenge/take-home/take-home-challenge";
import CandidateAdd from "./pages/candidate-add/candidate-add";

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
            <PrivateRoute path={routeTemplateBlank()} exact component={TemplateNew} />
            <PrivateRoute path={routeTemplateLibrary()} exact component={TemplateLibrary} />
            <PrivateRoute path={routeTemplateEdit()} exact component={TemplateNew} />
            <PrivateRoute path={routeTemplatePreview()} exact component={TemplatePreview} />
            <PrivateRoute path={routeLibraryTemplatePreview()} exact component={LibraryTemplatePreview} />
            <PrivateRoute path={routeProfile()} exact component={Profile} />
            <PrivateRoute path={routeTeamNew()} exact component={NewTeam} />
            <PrivateRoute path={routeTeamProfile()} exact component={TeamProfile} />
            <PrivateRoute path={routeTeamMembers()} exact component={TeamMembers} />
            <PrivateRoute path={routeTeamBilling()} exact component={TeamBilling} />
            <PrivateRoute path={routeTeamIntegration()} exact component={TeamIntegration} />
            <PrivateRoute path={routeCandidates()} exact component={Candidates} />
            <PrivateRoute path={routeCandidateDetails()} exact component={CandidateDetails} />
            <PrivateRoute path={routeSubscription()} exact component={Subscription} />
            <PrivateRoute path={routeCandidateAdd()} exact component={CandidateAdd} />
            <Route path={routeSharedTemplate()} exact component={SharedTemplate} />
            <Route path={routeSharedScorecard()} exact component={InterviewReportShared} />
            <Route path={routeLiveCodingChallenge()} exact component={LiveCodingChallenge} />
            <Route path={routeTakeHomeChallenge()} exact component={TakeHomeChallenge} />
        </Switch>
    );
}

export default withRouter(App);
