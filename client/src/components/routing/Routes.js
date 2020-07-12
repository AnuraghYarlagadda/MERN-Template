import React from "react";
import { Route, Switch } from "react-router-dom";
import Register from "../auth/Register";
import VerifyOTP from "../auth/VerifyOTP";
import Login from "../auth/Login";
import Alert from "../layout/Alert";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "../layout/NotFound";
import PrivateRoute from "./PrivateRoute";
const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/verify" component={VerifyOTP} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
