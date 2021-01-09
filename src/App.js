import { Switch, Redirect } from "react-router-dom";
import Default from "./pages/default/default";
import QuestionBank from "./pages/question-bank/question-bank";
import Interviews from "./pages/interviews/interviews";
import InterviewDetails from "./pages/interview-details/interview-details";
import InterviewStart from "./pages/interview-start/interview-start";
import Guides from "./pages/guides/guides";
import GuideDetails from "./pages/guide-details/guide-details";
import { useAuth0 } from "./react-auth0-spa";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/private-route/private-route";
import './App.css';

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <Spinner />;
  }

  return (
    <Switch>
      <PrivateRoute path="/" exact component={Default} />
      <PrivateRoute path="/default" render={() => <Redirect to="/" />} />
      <PrivateRoute path="/question-bank" exact component={QuestionBank} />
      <PrivateRoute path="/interviews" exact component={Interviews} />
      <PrivateRoute path="/interviews/add" exact component={InterviewDetails} />
      <PrivateRoute path="/interviews/details/:id" exact component={InterviewDetails} />
      <PrivateRoute path="/interviews/start/:id" exact component={InterviewStart} />
      <PrivateRoute path="/guides" exact component={Guides} />
      <PrivateRoute path="/guides/add/" exact component={GuideDetails} />
      <PrivateRoute path="/guides/details/:id" exact component={GuideDetails} />
    </Switch>
  );
}

export default App;
