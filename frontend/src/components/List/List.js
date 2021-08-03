import React, { Fragment, useEffect } from 'react'

// Import files
import './list.css'
import { ICON_ARROWBACK, ICON_LIST, ICON_SETTINGS } from '../../helpers/Icons'
import Loader from '../Loader/Loader'

//import modules
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { getAllLists } from '../../redux/actions/dataActions'

const List = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { username } = useParams()
    const loading = useSelector(state => state.data.loading)
    const lists = useSelector(state => state.data.lists)

    useEffect(() => {
        dispatch(getAllLists())
    }, [dispatch, username])

    return (
        <Fragment>
            { loading ? (
                <Loader />
            ) : (
                <div className="list-wrapper">
                    <div className="list-header-wrapper">
                        <div className="list-header-left">
                            <div onClick={()=>window.history.back()} className="header-back-wrapper">
                                <ICON_ARROWBACK />
                            </div>
                            <div className="list-header-text">
                                <div className="list-header-title">
                                    Lists
                                </div>
                                <div className="list-header-name">
                                    @username
                                </div>
                            </div>
                        </div>
                        <div className="list-header-right">
                            <div className="list-header-add">
                                <ICON_LIST styles={{ width:'28px', height:"28px"}} />
                            </div>
                            <div className="list-header-more">
                                <ICON_SETTINGS styles={{ width:'28px', height:"28px"}} />
                            </div>
                        </div>
                    </div>
                    <div className="pinned-list">
                        <div className="pinned-list-header">
                            Pinned Lists
                        </div>
                        <div className="pinned-list-card">
                            No pinned list
                        </div>
                    </div>
                    <div className="discover-list">
                        <div className="discover-list-header">
                            Discorver new lists
                        </div>
                        <div className="discover-list-card">
                            <div className="discover-list-item">
                                <div className="item-left">
                                    <div className="item-icon">
                                    <ICON_LIST styles={{ width:'30px', height:"30px"}} />
                                    </div>
                                    <div className="item-info">
                                        <div className="item-title">
                                            List 1
                                        </div>
                                        <div className="item-author">
                                            Name. @username
                                        </div>
                                    </div>
                                </div>
                                <div className="item-right">
                                    <span>Follow</span>
                                </div>
                            </div>
                            <div className="discover-list-item">
                                <div className="item-left">
                                    <div className="item-icon">
                                    <ICON_LIST styles={{ width:'30px', height:"30px"}} />
                                    </div>
                                    <div className="item-info">
                                        <div className="item-title">
                                            List 2
                                        </div>
                                        <div className="item-author">
                                            Name. @username
                                        </div>
                                    </div>
                                </div>
                                <div className="item-right">
                                    <span>Follow</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="user-list">
                        <div className="user-list-header">
                            Your lists
                        </div>
                            {lists?.map(list => (
                            <div key={list._id} className="user-list-card">
                                    <div className="user-list-item"
                                        onClick={() => history.push(`/list/${list._id}`)}
                                    >
                                    <div className="item-left">
                                        <div className="item-icon">
                                        <ICON_LIST styles={{ width:'30px', height:"30px"}} />
                                        </div>
                                        <div className="item-info">
                                            <div className="item-title">
                                                {list.name}
                                            </div>
                                            <div className="item-author">
                                                {list.user.name}. @{list.user.username}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Fragment>
    )
}

export default List
