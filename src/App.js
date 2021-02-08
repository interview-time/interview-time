import { Switch} from "react-router-dom";
import QuestionBank from "./pages/question-bank/question-bank";
import Interviews from "./pages/interviews/interviews";
import InterviewStart from "./pages/interview-start/interview-start";
import Guides from "./pages/guides/guides";
import GuideWizard from "./pages/guide-wizard/guide-wizard";
import Account from "./pages/account/account";
import { useAuth0 } from "./react-auth0-spa";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
import './App.css';
import Quickstart from "./pages/quickstart/quickstart";
import InterviewWizard from "./pages/interview-wizard/interview-wizard";

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <Spinner />;
  }

  return (
    <Switch>
      <PrivateRoute path="/" exact component={Quickstart} />
      <PrivateRoute path="/quickstart" exact component={Quickstart} />
      <PrivateRoute path="/question-bank" exact component={QuestionBank} />
      <PrivateRoute path="/interviews" exact component={Interviews} />
      <PrivateRoute path="/interviews/add" exact component={InterviewWizard} />
      <PrivateRoute path="/interviews/details/:id" exact component={InterviewWizard} />
      <PrivateRoute path="/interviews/start/:id" exact component={InterviewStart} />
      <PrivateRoute path="/templates" exact component={Guides} />
      <PrivateRoute path="/templates/add/" exact component={GuideWizard} />
      <PrivateRoute path="/templates/details/:id" exact component={GuideWizard} />
      <PrivateRoute path="/account" exact component={Account} />
    </Switch>
  );
}

export default App;
