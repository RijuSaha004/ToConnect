import React, { useEffect } from 'react'
import chatStyles from "../styles/chat.module.css"
import { socket } from '../socket/socket.js'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { setOnlineUsers } from '../context/reducer/socketReducer/socketReducer.js'
import { getAllAcceptedConnections } from '../context/action/userAction/userAction.js'
import ChatLeftBar from '../components/ChatLeftBar.jsx'
import ChatRightBar from '../components/ChatRightBar.jsx'

const Chats = () => {
  const socketState = useSelector((state) => state.socketReducer)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    socket.emit("get_onlineUsers")
  }, [socketState.socket])

  useEffect(() => {
    socket.on("onlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers))
    })

    return () => {
      socket.off("onlineUsers");
    };
  }, [])

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      await dispatch(getAllAcceptedConnections())
    }
    fetchAcceptedRequests()
  }, [])

  return (
    <div className={chatStyles.chatMainContainer}>
      <ChatLeftBar />
      <Outlet />
    </div>
  )
}

export default Chats