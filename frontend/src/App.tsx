import { Redirect, Route, Switch } from "wouter";
import UserPage from "./pages/users/page";
import CreateUserPage from "./pages/users/create";
import EditUserPage from "./pages/users/edit";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Route path="/">
        <Redirect to="/users" />
      </Route>
      <Switch>
        <Route path="/users" component={UserPage} />
        <Route path="/users/create" component={CreateUserPage} />
        <Route path="/users/:id/edit" component={EditUserPage} />
      </Switch>
      <Toaster richColors />
    </>
  );
};

export default App;
