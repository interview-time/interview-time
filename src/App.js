import { Route, Switch, Redirect } from "react-router-dom";
import Default from "./pages/default/default";
import QuestionBank from "./pages/question-bank/question-bank";
import Interviews from "./pages/interviews/interviews";
import NewInterview from "./pages/new-interview/new-interview";
import InterviewDetails from "./pages/interview-details/interview-details";
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
      <Route path="/interviews/detail" exact component={InterviewDetails} />
      <Route path="/interviews/add" exact component={NewInterview} />
      <Route path="/guides" exact component={Guides} />
      <Route path="/guides/add" exact component={GuideDetails} />
    </Switch>
  );
}

export default App;
