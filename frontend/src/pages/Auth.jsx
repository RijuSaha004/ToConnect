import React, { useEffect, useState } from 'react'
import authStyles from "../styles/auth.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../context/action/userAction/userAction.js'
import { emptyMessage } from '../context/reducer/userReducer/userReducer.js'
import { clientServer } from '../config/index.js'

const Auth = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector((state) => state.user)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [userLoginMethod, setUserLoginMethod] = useState(false)


    useEffect(() => {
        const verifyCookie = async () => {
            try {
                const response = await clientServer.post("/user/verify", {})

                if (response.data.status === "success") {
                    navigate("/dashboard")
                }
            } catch (err) {

            }
        };

        verifyCookie();
    }, []);

    useEffect(() => {
        dispatch(emptyMessage())
    }, [userLoginMethod])

    const handleRegister = async () => {
        await dispatch(registerUser({ name, email, username, password }));

    }

    const handleLogin = async () => {
        await dispatch(loginUser({ email, password }))
        navigate("/dashboard")
    }

    return (
        <>
            <div className={authStyles.container}>
                <div className={authStyles.cardContainer}>
                    <div className={authStyles.cardContainer_left}>
                        <p className={authStyles.cardleft_heading}>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
                        <p style={{ color: userState.isError ? "red" : 'green' }}>{userState.message}</p>
                        <div className={authStyles.inputContainers}>

                            {
                                !userLoginMethod && <div className={authStyles.inputRow}>
                                    <input
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={authStyles.inputField} type="text" placeholder='UserName' />
                                    <input
                                        onChange={(e) => setName(e.target.value)}
                                        className={authStyles.inputField} type="text" placeholder='Name' />
                                </div>
                            }

                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                className={authStyles.inputField} type="text" placeholder='Email' />
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                className={authStyles.inputField} type="text" placeholder='Password' />

                            <div
                                onClick={() => {
                                    if (userLoginMethod) {
                                        handleLogin()
                                    } else {
                                        handleRegister()
                                    }
                                }}
                                className={authStyles.authButton}>
                                {userLoginMethod ? "Sign In" : "Sign Up"}
                            </div>
                        </div>
                    </div>

                    <div className={authStyles.cardContainer_right}>
                        <div>
                            <p>{userLoginMethod ? "Donst have an account?" : "Already have an account?"}</p>
                            <div
                                onClick={() => {
                                    setUserLoginMethod(!userLoginMethod)
                                }}
                                className={authStyles.authButton}
                                style={{ textAlign: "center" }}
                            >
                                {userLoginMethod ? "Sign Up" : "Sign In"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth