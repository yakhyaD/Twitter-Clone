import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ICON_LOGO } from '../../helpers/Icons'
import './signup.css'
import { useDispatch, useSelector } from 'react-redux'
import { signup } from '../../redux/actions/userActions'
import { useHistory } from 'react-router-dom'
import Spinner from '../../helpers/Spinner'

const Signup = () => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()
    const { loading, errors } = useSelector(state => state.UI)

    useEffect(() => {
       dispatch({type: "CLEAR_ERRORS"})
    }, [history.location.pathname, dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (username.length > 0 && password.length > 0 && name.length > 0 && email.length > 0) {
            const userData = { username, name, email, password }
            dispatch(signup(userData, history))
        } else {
            errors.field = "fill all the fields"
        }
    }
    const activeBtn = () => {
        return username.length && password.length && name.length && email.length;
    }

    return (
        <div className="signup-wrapper">
            <ICON_LOGO />
            <h1 className="signup-header">
                Sign up to Twitter
            </h1>
            <div className="signup-error-wrapper" >
                {errors && <div className="signup-error">{errors?.msg ?? errors }</div>}
            </div>
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
                <button type="submit" form="signupForm" className={activeBtn() && !loading ? "signup-btn-wrap button-active": "signup-btn-wrap"}>
                   {loading ?  <Spinner size={{width: "20px", height:"20px", color: "#fff"}} /> : "Sign Up"}
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
