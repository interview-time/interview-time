import { Route, Switch, Redirect } from "react-router-dom";
import Default from "./pages/default/default";
import QuestionBank from "./pages/question-bank/question-bank";
import Interviews from "./pages/interviews/interviews";
import InterviewDetails from "./pages/interview-details/interview-details";
import InterviewStart from "./pages/interview-start/interview-start";
import Guides from "./pages/guides/guides";
import GuideDetails from "./pages/guide-details/guide-details";
import './App.css';

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Default} />
      <Route path="/default" render={() => <Redirect to="/" />} />
      <Route path="/question-bank" exact component={QuestionBank} />
      <Route path="/interviews" exact component={Interviews} />
      <Route path="/interviews/add" exact component={InterviewDetails} />
      <Route path="/interviews/start" exact component={InterviewStart} />
      <Route path="/guides" exact component={Guides} />
      <Route path="/guides/add/" exact component={GuideDetails} />
      <Route path="/guides/details/:id" exact component={GuideDetails} />
    </Switch>
  );
}

export default App;
