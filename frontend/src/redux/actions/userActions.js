import {
  LOADING_UI,
  SET_USER,
  CLEAR_ERRORS,
  SET_ERRORS,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  SET_PROFILE,
  FOLLOW_USER,
  UPDATE_PROFILE,
  GET_BOOKMARKS,
  LOADING_SUGGESTION,
  SET_FOLLOW_SUGGESTION,
  LOADING_TREND,
  SET_TRENDS,
  SEARCH_TREND_RESULTS,
  SEARCH_USER_RESULTS,
} from "../type";
import { API_URL } from "../../config";
import axios from "axios";

export const login = (userData, history) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });
    const res = await axios.post(`${API_URL}/auth/login`, userData);
    const token = await `Bearer ${res.data.token}`;
    setAuthenticated(token);
    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });
    history.push("/home");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const signup = (userData, history) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post(`${API_URL}/auth/signup`, userData);
    const token = await `Bearer ${res.data.token}`;
    setAuthenticated(token);
    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });
    history.push("/home");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const setAuthenticated = (token) => {
  localStorage.setItem("FBIdToken", token);
  axios.defaults.headers.common["Authorization"] = token;
};
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  dispatch({ type: SET_UNAUTHENTICATED });
  window.location.href = "/login";
};
export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get(`${API_URL}/auth/user`)
    .then((res) => {
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch((error) => {
      console.log(error);
      //dispatch({ type: SET_ERRORS, payload: error.response.data })
    });
};

export const getUserProfile = (username) => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const res = await axios.get(`${API_URL}/user/${username}`);
    dispatch({ type: SET_PROFILE, payload: res.data.user });
  } catch (err) {
    console.log(err);
  }
};
export const followUser = (id) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    const res = await axios.post(`${API_URL}/user/${id}/follow`);
    dispatch({ type: FOLLOW_USER, payload: res.data, data: id });
  } catch (err) {
    console.log(err);
  }
};
export const updateUserDetails = (username, userData) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    console.log(userData);
    const res = await axios.put(`${API_URL}/user/${username}`, userData);
    dispatch({ type: UPDATE_PROFILE, payload: res.msg, data: userData });
    dispatch({ type: CLEAR_ERRORS });
  } catch (err) {
    console.log(err);
  }
};
export const getBookmarks = (username) => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const res = await axios.get(`${API_URL}/user/${username}/bookmarks`);
    console.log(res.data);
    dispatch({ type: GET_BOOKMARKS, payload: res.data.bookmarks });
  } catch (err) {
    console.log(err);
  }
};

export const getFollowSuggestion = (username) => async (dispatch) => {
  dispatch({ type: LOADING_SUGGESTION });
  try {
    const res = await axios.get(`${API_URL}/user/${username}/suggestions`);
    dispatch({ type: SET_FOLLOW_SUGGESTION, payload: res.data.suggestions });
  } catch (err) {
    console.log(err);
  }
};
export const getTrendings = () => async (dispatch) => {
  dispatch({ type: LOADING_TREND });
  try {
    const res = await axios.get(`${API_URL}/trend`);
    dispatch({ type: SET_TRENDS, payload: res.data.trends });
  } catch (error) {
    console.log(error);
  }
};
export const searchUser = (query) => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const res = await axios.post(`${API_URL}/user`, query);
    dispatch({ type: SEARCH_USER_RESULTS, payload: res.data.result });
  } catch (err) {
    console.log(err);
  }
};
export const searchTrend = (query) => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  try {
    const res = await axios.post(`${API_URL}/trend`, query);
    dispatch({ type: SEARCH_TREND_RESULTS, payload: res.data.result });
  } catch (err) {
    console.log(err);
  }
};
