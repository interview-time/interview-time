import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import {
    routeCandidateAdd,
    routeCandidateProfile,
    routeCandidates,
    routeHome,
    routeInterviewReport,
    routeInterviews,
    routeInterviewScorecard,
    routeLibraryTemplatePreview,
    routeLiveCodingChallenge,
    routeProfile,
    routeReports,
    routeSharedScorecard,
    routeSharedTemplate,
    routeTakeHomeChallenge,
    routeTeamMembers,
    routeTeamNew,
    routeTeamProfile,
    routeTemplateBlank,
    routeTemplateEdit,
    routeTemplateLibrary,
    routeTemplatePreview,
    routeTemplates,
} from "./utils/route";
import Default from "./pages/dashboard/dashboard";
import Interviews from "./pages/interviews/interviews";
import InterviewScorecard from "./pages/interview-scorecard/interview-scorecard";
import Templates from "./pages/templates/templates";
import Reports from "./pages/reports/reports";
import Profile from "./pages/account/profile";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
import TemplateLibrary from "./pages/template-library/template-library";
import TemplateNew from "./pages/template-new/template-new";
import LibraryTemplatePreview from "./pages/template-preview-library/library-template-preview";
import { useAuth0 } from "./react-auth0-spa";
import TemplatePreview from "./pages/template-preview/template-preview";
import SharedTemplate from "./pages/shared-template/shared-template";
import NewTeam from "./pages/team-new/team-new";
import InterviewReport from "./pages/interview-report/interview-report";
import Candidates from "./pages/candidates/candidates";
import TeamProfile from "./pages/account/team-profile";
import TeamMembers from "./pages/account/team-members";
import LiveCodingChallenge from "./pages/challenge/live-coding/live-coding-challenge";
import InterviewReportShared from "./pages/interview-report/interview-report-shared";
import TakeHomeChallenge from "./pages/challenge/take-home/take-home-challenge";
import CandidateProfile from "./pages/candidate-profile/candidate-profile";
import { ConfigProvider } from "antd";
import { createGlobalStyle } from "styled-components";
import { Colors } from "./assets/styles/colors";
import { ThemeConfig } from "antd/es/config-provider/context";
import CandidateAdd from "./pages/candidate-add/create-candidate-page";

const GlobalStyle = createGlobalStyle`

  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5715;
  }

  h1, h2, h3, h4, h5 {
    margin-top: 0;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
  }

  img {
    border-style: none;
    vertical-align: middle;
  }

  .ant-btn {
    font-weight: 500;
  }

  // https://github.com/ant-design/ant-design/issues/38914
  .ant-table-wrapper .ant-table-thead > tr > th {
    background: ${Colors.White};
  }

  // TODO fix with styled component https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
  .ant-list .ant-list-item {
    padding: 0;
  }

  .ant-steps-item-title {
    line-height: 14px;
  }

  .assessment-question-row .not-assessed {
    opacity: 0;
  }

  .assessment-question-row:hover .not-assessed {
    opacity: 1;
  }

  .assessment-question-row .assessed {
    opacity: 1;
  }

  .ant-picker .ant-picker-input > input {
    font-size: 16px;
    font-family: 'Inter', 'system-ui';
  }

  .ant-picker:hover {
    border-color: ${Colors.Primary_500};
  }

  .ant-picker-focused {
    border-color: ${Colors.Primary_500};
  }

  .ant-select-selector .ant-select-selection-search-input {
    font-size: 16px;
    font-family: 'Inter', 'system-ui';
  }
  
  .ant-tabs-tab-btn {
    color: ${Colors.Neutral_500};
  }
  
`;

const GlobalThemeConfig: ThemeConfig = {
    token: {
        colorPrimary: Colors.Primary_500,
        colorPrimaryBgHover: Colors.Primary_50,
        colorLink: Colors.Primary_500,
        colorLinkActive: Colors.Primary_500,
        colorLinkHover: Colors.Primary_300,
        colorTextHeading: Colors.Neutral_800,
        colorTextTertiary: Colors.Neutral_500,
        colorBorder: Colors.Neutral_200,
        colorTextPlaceholder: Colors.Neutral_400,
        fontSize: 16,
        fontFamily: "Inter, system-ui",
    },
    components: {
        Input: {
            controlHeight: 40,
        },
        Select: {
            controlHeight: 40,
        },
        DatePicker: {
            controlHeight: 40,
        },
        Button: {
            controlHeight: 40,
        },
        Segmented: {
            controlHeight: 40,
        },
        Rate: {
            controlHeight: 40,
            colorFillContent: Colors.Neutral_200,
        },
        Menu: {
            colorItemTextSelected: Colors.Primary_500,
        },
        Tag: {
            colorTextLightSolid: Colors.Neutral_800,
        },
    },
};

function App() {
    const { loading } = useAuth0();

    if (loading) {
        return (
            <ConfigProvider theme={GlobalThemeConfig}>
                <Spinner />
            </ConfigProvider>
        );
    }

    return (
        <ConfigProvider theme={GlobalThemeConfig}>
            <Switch>
                <PrivateRoute path={routeHome()} exact component={Default} />
                <PrivateRoute path={routeInterviews()} exact component={Interviews} />
                <PrivateRoute path={routeReports()} exact component={Reports} />
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
                <PrivateRoute path={routeCandidates()} exact component={Candidates} />
                <PrivateRoute path={routeCandidateProfile()} exact component={CandidateProfile} />
                <PrivateRoute path={routeCandidateAdd()} exact component={CandidateAdd} />
                <Route path={routeSharedTemplate()} exact component={SharedTemplate} />
                <Route path={routeSharedScorecard()} exact component={InterviewReportShared} />
                <Route path={routeLiveCodingChallenge()} exact component={LiveCodingChallenge} />
                <Route path={routeTakeHomeChallenge()} exact component={TakeHomeChallenge} />
            </Switch>
            <GlobalStyle />
        </ConfigProvider>
    );
}

export default withRouter(App);
