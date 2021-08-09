import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { startChat } from "../../redux/actions/uiActions";

import { ICON_CLOSE, ICON_SEARCH } from '../../helpers/Icons'
import "./style.css"
import { startConversation } from '../../redux/actions/chatActions';
import axios from 'axios';
import { API_URL } from '../../config';
import Spinner from '../../helpers/Spinner';

const StartChatModal = ({ open }) => {
    const dispatch = useDispatch()
    const [users, setUsers] = useState([])
    const [resultSearch, setResultSearch] = useState([])
    const [loading, setLoading] = useState(false)
    const user  = useSelector(state => state.user.user)

    const fetchUsers = useRef(() => {})

    fetchUsers.current = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${API_URL}/user`, " ")
            const result = await data.result.filter(r => user?.following.includes(r._id))
            setResultSearch(result)
            setUsers(result)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers.current()
    }, [])


    const handleSearch = (e) => {
        const query = e.target.value
        if(query.length < 1) {
            setResultSearch(users, query)
            return
        }
        let res = (users.find(user => user?.name.includes(query) || user?.username.includes(query)))
        console.log(res)
        setResultSearch(data => [res])
    }
    const closeModal = () => {
        setResultSearch([])
        setUsers([])
        dispatch(startChat())
    }
    const createChat = (userId) => {
        dispatch(startConversation({id: userId}))
    }

    return (
        <div className="chat-modal-wrapper" style={{display: open ? 'flex' : 'none'}} >
           <div className="close_section" >
               <div onClick={closeModal}>
                    <ICON_CLOSE  />
               </div>
           </div>
           <div className="search_section">
                <div className="search_icon">
                    <ICON_SEARCH  />
                </div>
                <input type="text" placeholder="Search" onChange={handleSearch} />
           </div>
            <div className="users-list-section">
                {!loading ? (!(resultSearch.length < 1) ? resultSearch.map( (user) =>
                    (<div className="user" onClick={() => createChat(user._id)}>
                        <div key={user?._id} className="user-profile">
                            <a href="/">
                            <img
                                style={{ borderRadius: "50%", minWidth: "49px" }}
                                width="100%"
                                height="49px"
                                src={user?.profileImg}
                                alt="profileImage"
                            />
                            </a>
                        </div>
                        <div className="user_infos">
                            <small className="user_msg">Following</small>
                            <div className="item_name">{user.name}</div>
                            <div className="item_details">@{user.username}</div>
                        </div>
                    </div>)) : (
                        <h3>No users followed</h3>
                    )
                    ): (
                    <Spinner size={{width: "20px", height: "20px"}}/>
                )}
            </div>
        </div>
    )
}

export default StartChatModal
