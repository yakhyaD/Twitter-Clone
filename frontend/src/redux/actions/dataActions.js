import {
  LOADING_DATA,
  SET_TWEETS,
  LIKE_TWEET,
  SET_TWEET,
  ADD_TWEET,
  COMMENT_TWEET,
  SET_ERRORS,
  SET_LISTS,
  SET_LIST_DETAILS,
  FOLLOW_LIST,
  DELETE_TWEET,
  SET_BOOKMARKS,
  UNLIKE_TWEET,
} from "../type";

import { API_URL } from "../../config";
import axios from "axios";

export const getAllTweets = () => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get(`${API_URL}/tweet`);
    dispatch({ type: SET_TWEETS, payload: res.data.tweets });
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: "Check your connection" });
  }
};
export const getOneTweet = (id) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get(`${API_URL}/tweet/${id}`);
    dispatch({ type: SET_TWEET, payload: res.data.tweet });
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};
export const likeTweet = (id) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/tweet/${id}/like`);
    dispatch({ type: LIKE_TWEET, payload: id });
  } catch (err) {
    console.log(err);
    dispatch({ type: SET_ERRORS, payload: err });
  }
};
export const unlikeTweet = (id) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/tweet/${id}/like`);
    dispatch({ type: UNLIKE_TWEET, payload: id });
  } catch (err) {
    console.log(err);
    dispatch({ type: SET_ERRORS, payload: err });
  }
};
export const postTweet = (newTweet) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/tweet/create`, newTweet);
    dispatch({ type: ADD_TWEET, payload: res.tweet });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const commentTweet = (replyData) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.post(`${API_URL}/tweet/create`, replyData);
    dispatch({ type: COMMENT_TWEET, payload: res.data });
  } catch (err) {
    //console.log(err);
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};

export const getAllLists = () => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get(`${API_URL}/list`);
    dispatch({ type: SET_LISTS, payload: res.data });
  } catch (err) {
    //console.log(err);
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};
export const getListDetails = (id) => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    const res = await axios.get(`${API_URL}/list/${id}`);
    dispatch({ type: SET_LIST_DETAILS, payload: res.data });
  } catch (err) {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};
export const followList = (username, id, userId) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/list/${username}/${id}`);
    dispatch({ type: FOLLOW_LIST, payload: res.data, data: userId });
  } catch (err) {
    //console.log(err);
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  }
};
export const deleteTweet = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TWEET, payload: id });
    await axios.delete(`${API_URL}/tweet/${id}`);
  } catch (err) {
    //dispatch({ type: SET_ERRORS, payload: err.response.data})
  }
};
export const addBookmarks = (tweetId) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/tweet/${tweetId}/bookmarks`);
    dispatch({ type: SET_BOOKMARKS, payload: res.data, data: tweetId });
  } catch (err) {
    console.log(err);
  }
};

export const uploadImage = (data) => async () => {
  try {
    const res = await axios.post(`${API_URL}/upload`, data);
    return res.data.url;
  } catch (err) {
    throw new Error(err.response.data)
  }
}
