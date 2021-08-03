import './commentModal.css'
import React, {useRef, useState } from 'react'
import ContentEditable from 'react-contenteditable'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { commentTweet, uploadImage } from '../../redux/actions/dataActions'

import { ICON_CLOSE, ICON_EMOJI, ICON_GIF, ICON_IMGUPLOAD } from '../../helpers/Icons'
import { LOADING_GIF } from '../../config'

const CommentModal = ({ toggleModal, tweet, open }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const authenticated = useSelector(state => state.user.authenticated)
    const [tweetBody, setTweetBody] = useState("");
    const [images, setImages] = useState([])
    const [loadingImage, setLoadingImage] = useState(false)
    const [error, setError] = useState("")
    const imgInput = useRef()

    const multipleMedia = () => {
        return images.length > 1;
    }

    const handleChange = (e) => {
        if (tweetBody.trim().length <= 280 && tweet.split(/\r\n|\r|\n/).length) {
            setTweetBody(e.target.value)
        }
    }
    const addImage = () => {
        return imgInput.current.click()
    }
    const uploadImg = async (e) => {
        if (images.length > 4) {
            return
        }
        const imgFile = e.target.files[0]
        const formData = new FormData()
        formData.append('image', imgFile)
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

    const handleSubmit = () => {

        if (!authenticated) { return history.push('/login') }

        toggleModal()

        const hashtags = tweetBody.match(/#(\w+)/g)

        if (!tweetBody.length < 1 && images.length < 1) { return }

        const replyData = {
            body: tweetBody,
            image: images,
            parent: tweet._id,
            hashtags
        }
        dispatch(commentTweet(replyData))
        setTweetBody('')
    }
    return (
        <div className="modal-wrapper" style={{display: open ? 'block' : "none", opacity: open ? '1' : '0'}}>
            {error ?? window.alert(error)}
            <div className="close-btn"
                onClick={() => {
                    setTweetBody("")
                    toggleModal()
                }}>
                <ICON_CLOSE />
            </div>
            <div className="modal-body">
                <div className="user-infos">
                    <a href="/profile">
                        <img style={{borderRadius:'50%', minWidth:'49px'}} width="100%" height="49px"
                            src={user?.profileImg} alt="profileImage"
                        />
                    </a>
                </div>
                <div className="tweet-body">
                    <div className="text-section">
                        <ContentEditable
                            className="tweet-input"
                            html={tweetBody} onChange={handleChange}
                            placeholder={"What's happpening"}
                            tagName='div'
                        />
                    </div>
                    <div className="media-section">
                        {images.length > 0 && images.map((image, imageIdx) => (
                        <div key={imageIdx} className="img-container" >
                            <img src={image} alt="media" className={multipleMedia() ?  "media-multiple" : "media"} />
                        </div>
                        ))}
                        {loadingImage && (
                            <div className="img-container" >
                                <img src={LOADING_GIF} alt="media" className="multiple-media" />
                            </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="icon-container" >
                <div className="input_attach_wrapper" onClick={addImage}>
                  <ICON_IMGUPLOAD styles={{ fill: "rgb(29, 161, 242)" }} />
                </div>
                <input type="file" hidden="hindden" onChange={uploadImg} ref={imgInput}/>
                <div className="input_attach_wrapper">
                  <ICON_GIF styles={{ fill: "rgb(29, 161, 242)" }} />
                </div>
                <div className="input_attach_wrapper">
                  <ICON_EMOJI styles={{ fill: "rgb(29, 161, 242)" }} />
                </div>
            </div>
            <div
                className="send-button"
                onClick={handleSubmit}
            >
               <div>Tweet</div>
            </div>
        </div>
    )
}

export default CommentModal
