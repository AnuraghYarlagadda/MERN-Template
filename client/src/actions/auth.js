import api from "../utils/api";
import { setAlert } from "./alert";
import { setOTP } from "./otp";
import { clearFormData } from "./formData";
import {
  ACCOUNT_DELETED,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_FORMDATA,
} from "./types";

import Swal from "sweetalert2/dist/sweetalert2.all.min.js";
import "sweetalert2/src/sweetalert2.scss";

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get("/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/user", formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: { token: res.data.token },
    });
    dispatch(loadUser());
    dispatch(clearFormData());
    Swal.fire({
      icon: "success",
      title: "Hello " + res.data.name,
      text: "Welcome to the Project😃",
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, "error")));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = ({ email, password }) => async (dispatch) => {
  const body = { email, password };

  try {
    const res = await api.post("/auth", body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token: res.data.token },
    });
    dispatch(loadUser());
    dispatch(clearFormData());
    Swal.fire({
      icon: "success",
      title: "Hello " + res.data.name,
      text: "Welcome to the Project😃",
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, "error")));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  Swal.fire({
    icon: "info",
    title: "Log-Out Successfull!",
    text: "Visit us Back 😃",
  });
};

// Verify Email
export const verifyEmail = (formData, history) => async (dispatch) => {
  try {
    const res = await api.post("/verify", formData);
    dispatch(setOTP(res.data));
    history.replace("/verify");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, "error")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
    dispatch({ type: CLEAR_FORMDATA });
  }
};

// Change Password
export const changePassword = (
  { current_password, password },
  history
) => async (dispatch) => {
  const body = { current_password, password };

  try {
    if (current_password === password) {
      dispatch(
        setAlert("Reset Password can't be same as Current Password", "")
      );
      return;
    }
    const res = await api.put("/auth/changePassword", body);
    dispatch(setAlert(res.data.message, "dark"));
    dispatch(loadUser());
    history.replace("/");
  } catch (err) {
    if (!err.response) return;
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, "error")));
    }
  }
};

// Edit Profile
export const editProfile = ({ password, name }, history) => async (
  dispatch
) => {
  const body = { password, name };

  try {
    const res = await api.put("/auth/editProfile", body);
    dispatch(setAlert(res.data.message, "dark"));
    dispatch(loadUser());
    history.replace("/");
  } catch (err) {
    if (!err.response) return;
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, "error")));
    }
  }
};

//Delete Account
export const deleteAccount = () => async (dispatch) => {
  try {
    const res = await api.delete("/user");
    dispatch({ type: ACCOUNT_DELETED });
    dispatch(setAlert(res.data.message, ""));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, "error")));
    }
  }
};

// Reset Password when "Forgot"
export const resetPassword = ({ email }, { password }, history) => async (
  dispatch
) => {
  const body = { email, password };

  try {
    const res = await api.put("/auth/resetPassword", body);
    dispatch(setAlert(res.data.message, "info"));
    dispatch(clearFormData());
    history.replace("/login");
  } catch (err) {
    if (!err.response) return;
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, "error")));
    }
  }
};
