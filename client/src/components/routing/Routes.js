import React from "react";
import { Route, Switch } from "react-router-dom";
import Register from "../auth/Register";
import VerifyOTP from "../auth/VerifyOTP";
import Login from "../auth/Login";
import ChangePassword from "../auth/ChangePassword";
import EditProfile from "../auth/EditProfile";
import Alert from "../layout/Alert";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "../layout/NotFound";
import PrivateRoute from "./PrivateRoute";
import FileUpload from "../dashboard/FileUpload";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/verify" component={VerifyOTP} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route exact path="/resetPassword" component={ResetPassword} />
        <PrivateRoute exact path="/changePassword" component={ChangePassword} />
        <PrivateRoute exact path="/editProfile" component={EditProfile} />
        <PrivateRoute exact path="/fileUpload" component={FileUpload} />
        <PrivateRoute component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
