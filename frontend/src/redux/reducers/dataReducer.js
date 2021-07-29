import {
  SET_TWEETS,
  SET_TWEET,
  LOADING_DATA,
  LIKE_TWEET,
  UNLIKE_TWEET,
  ADD_TWEET,
  COMMENT_TWEET,
  SET_LISTS,
  SET_LIST_DETAILS,
  FOLLOW_LIST,
  DELETE_TWEET,
} from "../type";

const initialState = {
  tweets: null,
  tweet: null,
  loading: false,
  lists: [],
  list: null,
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_TWEETS:
      return {
        ...state,
        tweets: action.payload,
        loading: false,
      };
    case SET_TWEET:
      return {
        ...state,
        tweet: action.payload,
        loading: false,
      };
    case LIKE_TWEET:
      if (state.tweets) {
        let index = state.tweets.findIndex(
          (tweet) => tweet._id === action.payload
        );
        state.tweets[index].likes.unshift(action.payload);
      }
      if (state.tweet && state.tweet._id === action.payload) {
        state.tweet.likes.unshift(action.payload);
      }
      return {
        ...state,
      };
    case UNLIKE_TWEET:
      if (state.tweets) {
        let index1 = state.tweets.findIndex(
          (tweet) => tweet._id === action.payload
        );
        state.tweets[index1].likes = state.tweets[index1].likes.filter(
          (like) => like !== action.payload
        );
      }

      if (state.tweet && state.tweet._id === action.payload) {
        state.tweet.likes = state.tweet.likes.filter(
          (like) => like !== action.payload
        );
      }
      return {
        ...state,
      };
    case ADD_TWEET:
      return {
        ...state,
        tweets: [action.payload, ...state.tweets],
        loading: false,
      };
    case COMMENT_TWEET:
      state.tweets.unshift(action.payload.tweet);
      if (state.tweet && state.tweet._id === action.payload.tweet._id) {
        state.tweet.replies.unshift(action.payload.tweet);
      }
      return {
        ...state,
        loading: false,
      };
    case DELETE_TWEET:
      const indexTweet = state.tweets.findIndex(
        (tweet) => tweet._id === action.payload
      );
      state.tweets.splice(indexTweet, 1);

      return {
        ...state,
        loading: false,
      };
    case SET_LISTS:
      return {
        ...state,
        lists: action.payload.lists,
        loading: false,
      };
    case SET_LIST_DETAILS:
      return {
        ...state,
        list: {
          ...action.payload.list,
          tweets: action.payload.listTweets,
        },
        loading: false,
      };
    case FOLLOW_LIST:
      let newList = state.list;
      let userId = action.data;
      let msg = action.payload.msg;
      if (msg.includes("removed")) {
        newList.users = state.list.users.filter((id) => id !== userId);
      } else if (msg.includes("joined")) {
        newList.users.unshift(userId);
      }
      return {
        ...state,
        list: {
          ...state.list,
          ...newList,
        },
        loading: false,
      };
    default:
      return state;
  }
};
export default dataReducer;
