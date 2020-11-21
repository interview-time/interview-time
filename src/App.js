import { Route, Switch, Redirect } from "react-router-dom";
import Default from "./pages/default/default";
import QuestionBank from "./pages/question-bank/question-bank";
import './App.css';

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Default} />
      <Route path="/default" render={() => <Redirect to="/" />} />
      <Route path="/question-bank" exact component={QuestionBank} />
    </Switch>
  );
}

export default App;
