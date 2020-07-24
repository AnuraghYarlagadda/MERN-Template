import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Landing from "./components/layout/Landing";

import "./App.css";
import "jquery/dist/jquery";
import "jquery.easing/jquery.easing";
import "bootstrap/dist/js/bootstrap";

//Redux
import { Provider } from "react-redux";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Landing />
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
