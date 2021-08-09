import axios from "axios";
import {
  LOADING_CONVERSATION,
  SET_CONVERSATIONS,
  START_CONVERSATION,
  GET_CONVERSATION,
  SEND_MESSAGE,
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
export const sendMessage = (message) => (dispatch) => {
  dispatch({ type: SEND_MESSAGE, payload: message });
};
export const startConversation = (body) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/chat/conversation`, body);
    console.log(res.data.newConversations);
    dispatch({ type: START_CONVERSATION, payload: res.data.newConversations });
  } catch (error) {
    console.log(error);
    //dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
}
