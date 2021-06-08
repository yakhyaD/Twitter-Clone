import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './ProfileEdit.css'
import { ICON_CLOSE } from '../../../utils/Icons'
import Loader from '../../Loader/Loader'
import { updateUserDetails } from '../../../redux/actions/userActions'

const EditProfile = ({ profile, open, toggleModal }) => {
    const dispatch = useDispatch()
    const { description, location, website, name, profileImg, banner, theme, username } = profile
    const loading = useSelector(state => state.UI.loading)

    const [bio, setBio] = useState(description)
    const [newLocation, setLocation] = useState(location)
    const [newWebsite, setWebsite] = useState(website)
    const [newName, setName] = useState(name)

    const handleSubmit = (e) => {
        e.preventDefault()
        const userDetails = {
            name: newName,
            description: bio,
            location: newLocation,
            profileImg: profileImg,
            banner: banner,
            theme: theme
        }
        dispatch(updateUserDetails(username, userDetails))

        if (!loading) {
            return setTimeout(() => toggleModal(), 500)
        }
    }

    return (
        <div className="edit-wrapper" style={{display: open ? 'flex' : "none", opacity: open ? '1' : '0'}}>
            <div className="edit-header">
                <div className="close-btn" onClick={toggleModal}>
                    <ICON_CLOSE styles={{ fill: 'rgb(29, 161, 242)', width: '25px', height: '25px' }} />
                </div>
                <div className="edit-header-title">
                   Edit Profile Details
                </div>
            </div>
            <form id="editForm" className="edit-form" onSubmit={handleSubmit}>
                <div className="edit-input-content">
                    <label>Name:</label>
                    <input name="name" type="text"
                        className="edit-input"
                        value={newName}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="edit-input-content">
                    <label>Bio:</label>
                    <input name="description" type="text"
                        className="edit-input"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                    />
                </div>
                <div className="edit-input-content">
                    <label>Location:</label>
                    <input name="location" type="text"
                        className="edit-input"
                        value={newLocation}
                        onChange={e => setLocation(e.target.value)}
                    />
                </div>
                <div className="edit-input-content">
                    <label>Website:</label>
                    <input name="website" type="url"
                        className="edit-input"
                        value={newWebsite}
                        onChange={e => setWebsite(e.target.value)}
                    />
                </div>
                <button className="submit-btn" form="editForm" type="submit">
                    {loading ? <Loader />  :"Save Changes"}
                </button>
            </form>
        </div>
    )
}

export default EditProfile
