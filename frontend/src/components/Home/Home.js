import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentEditable from "react-contenteditable";
import { Link } from "react-router-dom";

import { LOADING_GIF } from '../../config'
import TweetCard from "../TweetCard/TweetCard";
import { ICON_IMGUPLOAD, ICON_GIF, ICON_EMOJI } from "../../utils/Icons";
import "./home.css";
import { getAllTweets, postTweet, uploadImage } from "../../redux/actions/dataActions";
import Loader from "../Loader/Loader";


const Home = () => {
  const dispatch = useDispatch();
  const [tweetBody, setTweetBody] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("")
  const loading = useSelector((state) => state.data.loading);
  const [loadingImage, setLoadingImage] = useState(false)
  const tweets = useSelector((state) => state.data.tweets);
  const authenticated = useSelector((state) => state.user.authenticated);
  const user = useSelector((state) => state.user.user);
  const imgRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getAllTweets());
  }, [dispatch]);

  const multipleMedia = () => {
    return images.length > 1;
  }

  const handleChange = (e) => {
    setTweetBody(e.target.value);
  };
  const uploadImg = async (e) => {
    if (images.length > 4) {
      return
    }
    const imageFile = e.target.files[0];
    const formData = new FormData()
    formData.append('image', imageFile)
    setLoadingImage(true)
    try {
      const res =  await dispatch(uploadImage(formData));
      setImages(myImages => [...myImages, res])
      setLoadingImage(false)
    } catch (error) {
      setError(error);
      setLoadingImage(false)
    }
  }
  const addImage = () => {
    imgRef.current.click();
  }
  const handleSubmit = () => {
    if (tweetBody === "" && images.length < 1) {
      return;
    }

    const hashtags = tweetBody.match(/#(\w+)/g);

    const newTweet = {
      body: tweetBody,
      hashtags,
      image: images
    };
    dispatch(postTweet(newTweet));
    setTweetBody("");
    setImages([])
  };

  return (
    <div className="Home_wrapper">
      {error ?? window.alert(error)}
      <div className="Home_header_wrapper">
        <h2 className="Home_header">Home</h2>
        {!loading && !authenticated && (
          <div className="links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}
      </div>
      {!loading && authenticated && (
        <div className="Tweet_input_wrapper">
          <div className="Tweet_profile_wrapper">
            <a href={`/profile/${user?.username}`}>
              <img
                style={{ borderRadius: "50%", minWidth: "49px" }}
                width="100%"
                height="49px"
                src={user?.profileImg}
                alt="profileImage"
              />
            </a>
          </div>
          <div className="Tweet_input_side">
            <div className="inner_input_box">
              <ContentEditable
                className={tweetBody.length > 0 ? "tweet-input active" : "tweet-input"}
                html={tweetBody}
                onChange={handleChange}
                placeholder={"What's happening?"}
                tagName="div"
              />
            </div>
            <div className="Tweet_media_wrapper">
              {images.length > 0 && images.map((image, imageIdx) => (
                  <div key={imageIdx} className="img-container" >
                    <img src={image} alt="media" className={multipleMedia() ?  "media-multiple" : "media"} />
                  </div>
              ))}
              {loadingImage && (
                  <div className="img-container" >
                    <img src={LOADING_GIF} alt="media" className={multipleMedia() ?  "media-multiple" : "media"} />
                  </div>
                )
              }
            </div>
            <div className="inner_input_links">
              <div className="input_links_side">
                <div
                  style={{ marginLeft: "-10px" }}
                  className="input_attach_wrapper"
                  onClick={addImage}
                >
                  <ICON_IMGUPLOAD styles={{ fill: "rgb(29, 161, 242)" }} />
                </div>
                <input type="file" onChange={uploadImg} hidden="hindden" ref={imgRef} />
                <div className="input_attach_wrapper">
                  <ICON_GIF styles={{ fill: "rgb(29, 161, 242)" }} />
                </div>
                <div className="input_attach_wrapper">
                  <ICON_EMOJI styles={{ fill: "rgb(29, 161, 242)" }} />
                </div>
              </div>
              <div
                onClick={handleSubmit}
                className={
                  tweetBody.length > 0 || images.length > 0
                    ? "inner_btn_side inner_btn_active"
                    : "inner_btn_side"
                }
              >
                Tweet
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="Tweet_input_divider" />
      {loading && !tweets ? (
        <Loader />
      ) : (
        tweets?.map((tweet) => <TweetCard key={tweet?._id} tweet={tweet} />)
      )}
    </div>
  );
};

export default Home;
