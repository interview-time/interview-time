import './App.css';
import { Redirect, Switch } from "react-router-dom";
import QuestionBank from "./pages/question-bank/question-bank";
import Interviews from "./pages/interviews/interviews";
import Interview from "./pages/interview/interview";
import Templates from "./pages/templates/templates";
import TemplateWizard from "./pages/template-wizard/template-wizard";
import Account from "./pages/account/account";
import { useAuth0 } from "./react-auth0-spa";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
import InterviewWizard from "./pages/interview-wizard/interview-wizard";
import Community from "./pages/community/community";
import {
    routeAccount,
    routeCommunity,
    routeInterviewAdd,
    routeInterviews,
    routeNews,
    routeQuestionBank,
    routeTemplateAdd,
    routeTemplates
} from "./components/utils/route";
import News from "./pages/news/news";

function App() {
    const { loading } = useAuth0();

    if (loading) {
        return <Spinner />;
    }

    return (
        <Switch>
            <PrivateRoute path="/" exact render={() => <Redirect to={routeQuestionBank()} />} />
            <PrivateRoute path={routeQuestionBank()} exact component={QuestionBank} />
            <PrivateRoute path={routeInterviews()} exact component={Interviews} />
            <PrivateRoute path={routeInterviewAdd()} exact component={InterviewWizard} />
            <PrivateRoute path="/interviews/details/:id" exact component={InterviewWizard} />
            <PrivateRoute path="/interviews/start/:id" exact component={Interview} />
            <PrivateRoute path={routeTemplates()} exact component={Templates} />
            <PrivateRoute path={routeTemplateAdd()} exact component={TemplateWizard} />
            <PrivateRoute path="/templates/details/:id" exact component={TemplateWizard} />
            <PrivateRoute path={routeCommunity()} exact component={Community} />
            <PrivateRoute path={routeNews()} exact component={News} />
            <PrivateRoute path={routeAccount()} exact component={Account} />
        </Switch>
    );
}

export default App;
