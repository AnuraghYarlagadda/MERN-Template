import api from "../utils/api";
import { setAlert } from "./alert";
import { setOTP } from "./otp";
import { clearFormData } from "./formData";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "./types";

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
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(clearFormData());
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
      payload: res.data,
    });

    dispatch(loadUser());
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
export const logout = () => ({ type: LOGOUT });

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
    history.replace("/dashboard");
  } catch (err) {
    console.log(err);
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
    history.replace("/dashboard");
  } catch (err) {
    console.log(err);
    if (!err.response) return;
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.message, "error")));
    }
  }
};
