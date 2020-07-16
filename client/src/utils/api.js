import axios from "axios";
import store from "../store";
import { LOGOUT } from "../actions/types";
import { setAlert } from "../actions/alert";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired
 logout the user if the token has expired
**/

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.data.message === "Token is invalid") {
      store.dispatch({ type: LOGOUT });
      store.dispatch(setAlert("Session Timed Out!", "error"));
    }
    return Promise.reject(err);
  }
);

export default api;
