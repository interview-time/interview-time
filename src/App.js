import { Route, Switch, Redirect } from "react-router-dom";
import Default from "./pages/default/default";
import './App.css';

function App() {
  return (
    <Switch>
        <Route path="/" exact component={Default} />
        <Route path="/default" render={() => <Redirect to="/" />} />      
      </Switch>
  );
}

export default App;
