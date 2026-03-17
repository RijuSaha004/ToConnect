import React from 'react'
import chatStyles from "../styles/chat.module.css"
import { useSelector } from 'react-redux'
import ImageComponent from './imageComponent'
import { NavLink } from 'react-router-dom'

const ChatLeftBar = () => {
    const userState = useSelector((state) => state.user)
    const socketState = useSelector((state) => state.socketReducer)


    return (
        <div className={chatStyles.chatLeftBar}>
            {
                userState.allAcceptedUserConnections.length === 0
                    ? <div style={{ color: "white" }}><b>No Connection</b></div>
                    : <div style={{ marginBottom: "1rem" }}><b>All Chats</b></div>
            }
            {
                userState.allAcceptedUserConnections.length !== 0 &&
                userState.allAcceptedUserConnections.map((connection) => {
                    return (
                        <NavLink
                            key={connection._id}
                            className={chatStyles.chatUserCard}
                            to={`/dashboard/chats/${connection._id}`}
                        >
                            <ImageComponent url={connection.profilePicture} classname={chatStyles.chatCard_image} />
                            <div className={chatStyles.chatUserDetails}>
                                <div>
                                    <b>{connection.name}</b>
                                    <p>{connection.username}</p>
                                </div>
                                <div>
                                    {
                                        socketState.onlineUsers?.includes(connection._id) &&
                                        <div style={{ backgroundColor: "green", width: "10px", height: "10px", borderRadius: "50%" }}></div>
                                    }
                                </div>
                            </div>
                        </NavLink>
                    )
                })
            }
        </div>
    )
}

export default ChatLeftBar