import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ICON_LOGO } from '../../helpers/Icons'
import './login.css'
import '../../App.css'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { login } from '../../redux/actions/userActions'
import Spinner from "../../helpers/Spinner"

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()
    const { loading, errors } = useSelector(state => state.UI)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (username.length > 0 && password.length > 0) {
            const userData = { username, password }
            dispatch(login(userData, history))
        }
    }
    return (
        <div className="login-wrapper">
            <ICON_LOGO/>
            <h1 className="login-header">
                Log in to Twitter
            </h1>
            <div className="login-error-wrapper" >
                {errors && <div className="login-error">{errors?.msg ?? errors }</div>}
            </div>
            <form id="loginForm" onSubmit={(e)=>handleSubmit(e)} className="login-form">
                <div className="login-input-wrap">
                    <div className="login-input-content">
                        <label>Email or username</label>
                        <input onChange={(e)=>setUsername(e.target.value)} type="text" name="username" className="login-input"/>
                    </div>
                </div>
                <div className="login-input-wrap">
                    <div className="login-input-content">
                        <label>Password</label>
                        <input onChange={(e)=>setPassword(e.target.value)} type="password" name="password" className="login-input"/>
                    </div>
                </div>
                <button type="submit" form="loginForm"
                    className={username.length && password.length > 0 && !loading
                        ? "login-btn-wrap button-active" : "login-btn-wrap"}>
                  {loading ?  <Spinner size={{width: "20px", height:"20px", color: "#fff"}} /> : "Login"}
                </button>
            </form>
            <p className="signup-option">
                <Link to="/signup">
                    Sign up for Twitter
                </Link>
            </p>
        </div>
    )
}
export default Login
