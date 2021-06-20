import axios from "axios";
import {
  LOADING_CONVERSATION,
  SET_CONVERSATIONS,
  GET_CONVERSATION,
} from "../type";
import { API_URL } from "../../config";

export const getConversations = () => async (dispatch) => {
  dispatch({ type: LOADING_CONVERSATION });
  try {
    const res = await axios.get(`${API_URL}/chat/conversations`);
    dispatch({ type: SET_CONVERSATIONS, payload: res.data.conversations });
  } catch (error) {
    console.log(error);
    //dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
export const getConversation = (conversation) => (dispatch) => {
  dispatch({ type: GET_CONVERSATION, payload: conversation });
};
