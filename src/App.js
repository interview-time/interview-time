import "./App.less";
import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import {
    routeCandidateProfile,
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
    routeTakeHomeChallenge,
    routeTeamIntegration,
} from "./utils/route";
import Default from "./pages/dashboard/dashboard";
import Interviews from "./pages/interviews/interviews";
import InterviewScorecard from "./pages/interview-scorecard/interview-scorecard";
import InterviewSchedulePage from "./pages/interview-schedule/interview-schedule-page";
import Templates from "./pages/templates/templates";
import Reports from "./pages/reports/reports";
import Profile from "./pages/account/profile";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
// import ReactGA from "react-ga";
import TemplateLibrary from "./pages/template-library/template-library";
import TemplateNew from "./pages/template-new/template-new";
import LibraryTemplatePreview from "./pages/template-preview-library/library-template-preview";
import { useAuth0 } from "./react-auth0-spa";
import TemplatePreview from "./pages/template-preview/template-preview";
import SharedTemplate from "./pages/shared-template/shared-template";
import NewTeam from "./pages/team-new/team-new";
import InterviewReport from "./pages/interview-report/interview-report";
import Candidates from "./pages/candidates/candidates";
import Subscription from "./pages/subscription/subscription";
import TeamProfile from "./pages/account/team-profile";
import TeamMembers from "./pages/account/team-members";
import TeamBilling from "./pages/account/team-billing";
import TeamIntegration from "./pages/account/team-integration";
import LiveCodingChallenge from "./pages/challenge/live-coding/live-coding-challenge";
import InterviewReportShared from "./pages/interview-report/interview-report-shared";
import TakeHomeChallenge from "./pages/challenge/take-home/take-home-challenge";
import CandidateProfile from "./pages/candidate-profile/candidate-profile";

function App() {
    // Temporary commented out to test posthog
    // useEffect(() => {
    //     if (process.env.REACT_APP_GA_TRACKING_ID) {
    //         ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
    //         ReactGA.set({ page: window.location.pathname + window.location.search });
    //         ReactGA.pageview(window.location.pathname + window.location.search);
    //     }
    //
    //     history.listen(location => {
    //         if (process.env.REACT_APP_GA_TRACKING_ID) {
    //             ReactGA.set({ page: location.pathname });
    //             ReactGA.pageview(location.pathname);
    //         }
    //     });
    // }, [history]);

    const { loading } = useAuth0();

    if (loading) {
        return <Spinner />;
    }

    return (
        <Switch>
            <PrivateRoute path={routeHome()} exact component={Default} />
            <PrivateRoute path={routeInterviews()} exact component={Interviews} />
            <PrivateRoute path={routeReports()} exact component={Reports} />
            <PrivateRoute path={routeInterviewAdd()} exact component={InterviewSchedulePage} />
            <PrivateRoute path={routeInterviewDetails()} exact component={InterviewSchedulePage} />
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
            <PrivateRoute path={routeCandidateProfile()} exact component={CandidateProfile} />
            <PrivateRoute path={routeSubscription()} exact component={Subscription} />
            <Route path={routeSharedTemplate()} exact component={SharedTemplate} />
            <Route path={routeSharedScorecard()} exact component={InterviewReportShared} />
            <Route path={routeLiveCodingChallenge()} exact component={LiveCodingChallenge} />
            <Route path={routeTakeHomeChallenge()} exact component={TakeHomeChallenge} />
        </Switch>
    );
}

export default withRouter(App);
