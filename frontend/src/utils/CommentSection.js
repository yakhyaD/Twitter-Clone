import React, {useState } from 'react'
import ContentEditable from 'react-contenteditable'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { commentTweet } from '../redux/actions/dataActions'

import { ICON_CLOSE } from './Icons'
import '../components/Home/home.css'

const CommentSection = ({ toggleModal, tweet, open }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const authenticated = useSelector(state => state.user.authenticated)
    const [comment, setComment] = useState('')
    const [info, setInfo] = useState('')

    const handleChange = (e) => {
        if (comment.trim().length <= 280 && comment.split(/\r\n|\r|\n/).length) {
            setInfo('')
            setComment(e.target.value)
        }
    }
    const handleSubmit = () => {

        if (!authenticated) { return history.push('/login') }

        toggleModal()

        const hashtags = comment.match(/#(\w+)/g)

        if (!comment.length) { return }

        const replyData = {
            body: comment,
            images: [],
            parent: tweet._id,
            hashtags
        }
        dispatch(commentTweet(replyData))
        setInfo('')
        setComment('')
    }
    return (
        <div className="inner_comment_box" style={{display: open ? 'block' : "none", opacity: open ? '1' : '0'}}>
            <div className="close_btn"
                onClick={() => {
                    setComment('')
                    toggleModal()
                }}>
                <ICON_CLOSE styles={{ fill: 'rgb(29, 161, 242)', width: '25px', height: '25px' }} />
            </div>
            <div className="inner_tweet_parent">
                <div className="card_user_ProfileImage">
                    <a href="/">
                        <img
                            style={{ borderRadius: '50%', minWidth: '49px' }} width="100%" height="49px"
                            src={tweet.user.profileImg} alt="profileImage"
                        />
                    </a>
                </div>
                <div className="card_content_header">
                    <div className="card_header_details">
                        <span className="card_header_user">{tweet.user.name}</span>
                        <span className="card_header_username">@{tweet.user.username}</span>
                        <span className="card_header_date">1h</span>
                    </div>
                    <div className="card_content_body">{tweet.body}</div>
                    <div className="card_content_infos">Replying to @{tweet.user.username}</div>
                </div>
            </div>
            <div className="inner_tweet_replie">
                <div className="inner_replie_profile">
                    <a href="/profile">
                        <img style={{borderRadius:'50%', minWidth:'49px'}} width="100%" height="49px"
                            src={user.profileImg} alt="profileImage"
                        />
                    </a>
                </div>
                <div className="replie_input_side">
                    <div className="replie_input_box">
                        <ContentEditable
                            className={comment.length > 0 ? 'tweet_input_active' : null}
                            html={comment} onChange={handleChange}
                            placeholder={"Reply here"}
                        />
                    </div>
                    <div className="replie_info">{info ??  null}</div>
                </div>
            </div>
            <div
                className={comment.length ? 'reply_btn_side reply_btn_active' : 'reply_btn_side'}
                onClick={handleSubmit}
            >
                Tweet
            </div>
        </div>
    )
}

export default CommentSection
