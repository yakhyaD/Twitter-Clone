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
    case UNLIKE_TWEET:
      let newTweet;
      let tweetIndex = state.tweets.findIndex(
        (tweet) => tweet._id === action.data
      );

      if (action.payload.msg === "Tweet Liked") {
        state.tweets[tweetIndex].likes.unshift(action.data);
      } else if (action.payload.msg === "Tweet Unliked") {
        state.tweets[tweetIndex].likes = state.tweets[tweetIndex].likes.filter(
          (tweet) => tweet._id !== action.data
        );
      }
      if (state.tweet && state.tweet._id === action.data) {
        newTweet = state.tweets[tweetIndex];
      }
      return {
        ...state,
        tweet: {
          ...state.tweet,
          ...newTweet,
        },
        loading: false,
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
