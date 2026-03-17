import React from 'react'
import navbarStyles from "../styles/navbar.module.css"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ImageComponent from './imageComponent'
import { userIsNotLoggedIn, userReset } from '../context/reducer/userReducer/userReducer'
import { clientServer } from '../config'

const Navbar = () => {
    const userState = useSelector((state) => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = async () => {
        console.log("logout");
        
        const response = await clientServer.post("/user/logout", {})
        await dispatch(userIsNotLoggedIn())
        await dispatch(userReset())
        navigate("/auth")
    }

    return (
        <div className={navbarStyles.container}>
            <nav className={navbarStyles.navBar}>
                <h1 onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>ToConnect</h1>
                <div className={navbarStyles.navBarOptionContainer}>

                    {
                        userState.loggedIn && <div>
                            <p>hey, {userState?.user?.name.split(" ")[0]} </p>

                            <div onClick={() => navigate("/dashboard/profile")} className={navbarStyles.profileContainer}>
                                <ImageComponent url={userState?.user?.profilePicture} classname={navbarStyles.profilePicture} />
                                <p style={{ fontWeight: "bold", cursor: "pointer" }}>Profile</p>
                            </div>

                            <p onClick={() => handleLogout()} style={{ fontWeight: "bold", cursor: "pointer" }}>Logout</p>
                        </div>
                    }

                    {
                        !userState.loggedIn && <div
                        onClick={() => navigate("/auth")}
                        className={navbarStyles.joinButton}
                    >
                        <b>Login / Signup</b>
                    </div>
                    }

                </div>
            </nav>
        </div>
    )
}

export default Navbar