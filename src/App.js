import { Route, Switch, Redirect } from "react-router-dom";
import Default from "./pages/default/default";
import QuestionBank from "./pages/question-bank/question-bank";
import Interviews from "./pages/interviews/interviews";
import './App.css';

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Default} />
      <Route path="/default" render={() => <Redirect to="/" />} />
      <Route path="/question-bank" exact component={QuestionBank} />
      <Route path="/interviews" exact component={Interviews} />
    </Switch>
  );
}

export default App;
