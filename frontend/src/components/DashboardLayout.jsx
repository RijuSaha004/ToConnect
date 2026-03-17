import React, { useEffect } from 'react'
import dashboardLayoutStyles from "../styles/dashboardLayout.module.css"
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import { handleError, handleSuccess } from '../utils/toast.js';
import { ToastContainer } from 'react-toastify';
import { clientServer } from '../config/index.js';
import { userIsLoggedIn } from '../context/reducer/userReducer/userReducer.js';
import { getAboutUser } from '../context/action/userAction/userAction.js';
import { socket } from '../socket/socket.js';
import { initializeSocket } from '../context/reducer/socketReducer/socketReducer.js';

const DashboardLayout = () => {
    const userState = useSelector((state) => state.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()



    useEffect(() => {
        const verifyCookie = async () => {
            try {
                const response = await clientServer.post("/user/verify", {})

                if (response.data.status === "success") {
                    handleSuccess(`Hello ${response.data.user}`)
                    dispatch(userIsLoggedIn())
                } else {
                    throw new Error("Authentication failed");
                }
            } catch (err) {
                const message =
                    err.response?.data?.message ||
                    err.message ||
                    "Session expired";

                handleError(message)
                navigate("/auth");
            }
        };

        verifyCookie();
    }, []);

    // socket connections ------>
    useEffect(() => {
        if (!userState.user?._id) return;

        socket.connect();

        socket.on("connect", () => {
            socket.emit("user_join", userState.user._id);
            dispatch(initializeSocket(socket.id))
        });

        return () => {
            socket.off("connect");
            socket.disconnect();
        };

    }, [userState.user]);


    useEffect(() => {
        const getDetails = async () => {
            await dispatch(getAboutUser())
        }
        getDetails()
    }, [])


    return (
        <div className="container">
            <div className={dashboardLayoutStyles.dashboardContainer}>
                <div className={dashboardLayoutStyles.dashboardContainer_leftBar}>

                    <div
                        // onClick={() => navigate("/dashboard")}
                        className={dashboardLayoutStyles.sidearOption}>
                        <NavLink to="/dashboard">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <p>Home</p>
                        </NavLink>
                    </div>
                    <div
                        // onClick={() => navigate("/dashboard")}
                        className={dashboardLayoutStyles.sidearOption}>
                        <NavLink to="/dashboard/chats">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                            </svg>
                            <p>Chats</p>
                        </NavLink>
                    </div>
                    <div
                        // onClick={() => navigate("/dashboard/connections")}
                        className={dashboardLayoutStyles.sidearOption}>
                        <NavLink to="/dashboard/posts">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg>
                            <p>My Posts</p>
                        </NavLink>
                    </div>
                    <div
                        // onClick={() => navigate("/dashboard/connections")}
                        className={dashboardLayoutStyles.sidearOption}>
                        <NavLink to="/dashboard/create_post">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                            </svg>
                            <p>Create Post</p>
                        </NavLink>
                    </div>
                    <div
                        // onClick={() => navigate("/dashboard/discover")} 
                        className={dashboardLayoutStyles.sidearOption}>
                        <NavLink to="/dashboard/discover">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <p>Discover People</p>
                        </NavLink>
                    </div>
                    <div
                        // onClick={() => navigate("/dashboard/connections")}
                        className={dashboardLayoutStyles.sidearOption}>
                        <NavLink to="/dashboard/connections">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>
                            <p>My Connections</p>
                        </NavLink>
                    </div>

                </div>

                <div className={dashboardLayoutStyles.dashboardContainer_feedContainer}>
                    <Outlet />
                </div>

            </div>
        </div>
    )
}

export default DashboardLayout