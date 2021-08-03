import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ICON_LOGO } from '../../helpers/Icons'
import './signup.css'
import { useDispatch, useSelector } from 'react-redux'
import { signup } from '../../redux/actions/userActions'
import { useHistory } from 'react-router-dom'

const Signup = () => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()
    const { loading, errors } = useSelector(state => state.UI)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (username.length > 0 && password.length > 0 && name.length > 0 && email.length > 0) {
            const userData = { username, name, email, password }
            dispatch(signup(userData, history))
        } else {
            errors.field = "fill all the fields"
        }
    }

    return (
        <div className="signup-wrapper">
            <ICON_LOGO />
            <h1 className="signup-header">
                Sign up to Twitter
            </h1>
            <form id="signupForm" onSubmit={(e)=>handleSubmit(e)} className="signup-form">
                <div className="signup-input-wrap">
                    <div className="signup-input-content">
                        <label>Name</label>
                        <input onChange={(e)=>setName(e.target.value)} name="name" type="text" className="signup-input"/>
                    </div>
                </div>
                <div className="signup-input-wrap">
                    <div className="signup-input-content">
                        <label>Username</label>
                        <input onChange={(e)=>setUsername(e.target.value)} name="username" type="text" className="signup-input"/>
                    </div>
                </div>
                <div className="signup-input-wrap">
                    <div className="signup-input-content">
                        <label>Email</label>
                        <input onChange={(e)=>setEmail(e.target.value)} name="email" type="email" className="signup-input"/>
                    </div>
                </div>
                <div className="signup-input-wrap">
                    <div className="signup-input-content">
                        <label>Password</label>
                        <input onChange={(e)=>setPassword(e.target.value)} name="password" type="password" className="signup-input"/>
                    </div>
                </div>
                {errors.msg && <h1 className="error-alert">{errors.msg}</h1>}
                {errors.fiels && <h1 className="error-alert">{errors.fiels}</h1>}
                <button type="submit" form="signupForm" className={username.length && password.length && name.length && email.length && !loading ? "signup-btn-wrap button-active": "signup-btn-wrap"}>
                    Sign up
                </button>
            </form>
            <p className="signup-option">
                <Link to="/login">
                    Log in to Twitter
                </Link>
            </p>
        </div>
    )
}

export default Signup
