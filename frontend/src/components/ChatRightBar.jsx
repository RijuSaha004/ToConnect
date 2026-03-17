import React, { useEffect, useRef, useState } from 'react'
import chatStyles from "../styles/chat.module.css"
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ImageComponent from './imageComponent'
import { deleteMessage, getMessage, sendMessage } from '../context/action/messageAction/messageAction'
import { socket } from '../socket/socket'
import { deleteMsgFromState, resetMessageState, setNewMessage } from '../context/reducer/messageReducer/messageReducer'

const ChatRightBar = () => {
  const userState = useSelector((state) => state.user)
  const socketState = useSelector((state) => state.socketReducer)
  const messageState = useSelector((state) => state.message)
  const dispatch = useDispatch()

  const { id } = useParams()

  const messageRef = useRef(null);

  const [chatUserDetails, setChatUserDetails] = useState({})
  const [allMessages, setAllMessages] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!id || userState.allAcceptedUserConnections.length === 0) return;

    userState.allAcceptedUserConnections.map((user) => {
      if (user._id === id) {
        setChatUserDetails(user)
      }
    })
    dispatch(resetMessageState())
    setAllMessages([])
    dispatch(getMessage({ recieverId: id }));
  }, [id, userState.allAcceptedUserConnections])

  useEffect(() => {
    setAllMessages([])

    messageState.messages?.length !== 0
      && messageState.messages?.map((message) => {
        if (message.receiverId === chatUserDetails._id || message.senderId._id === chatUserDetails._id) {

          setAllMessages((prev) => [...prev, message])
        }
      })
  }, [messageState.messages])

  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      dispatch(setNewMessage(newMessage));
    });

    socket.on("message_deleted", (msgId) => {
      console.log(msgId);
      dispatch(deleteMsgFromState(msgId));
    });

    return () => {
      socket.off("newMessage");
      socket.off("message_deleted");
    };
  }, [])

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const handleSendMessage = () => {
    const cleanedMsg = message.trim()
    if (!cleanedMsg) return;

    dispatch(sendMessage({
      recieverId: chatUserDetails._id,
      message
    }))
    setMessage("")
  }

  const handleMsgDelete = (msgId) => {
    dispatch(deleteMessage(msgId))
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className={chatStyles.chatRightBar}>
      <div className={chatStyles.chatRightBarHeader}>
        <ImageComponent url={chatUserDetails.profilePicture} classname={chatStyles.chatHeader_image} />
        <div className={chatStyles.chatUserDetails}>
          <div>
            <b>{chatUserDetails.name}</b>
            {
              socketState.onlineUsers?.includes(chatUserDetails._id) &&
              <p style={{ color: "lightGreen", width: "10px", height: "10px", borderRadius: "50%" }}>Online</p>
            }
          </div>
        </div>
      </div>

      <div className={chatStyles.messegeContainerSection} >
        {
          allMessages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={chatStyles.singleMessegeCard}
                style={{
                  backgroundColor: msg.senderId._id === userState.user._id
                    ? "rgb(84, 84, 225)" : "gray"
                }}
              >
                <div style={{ fontSize: "10px", display: "flex", width: "100%" }}>
                  <div style={{ width: "99%" }}>
                    {msg.senderId.name}
                  </div>
                  {
                    msg.senderId._id === userState.user._id &&
                    <div style={{ width: "1rem" }} onClick={() => handleMsgDelete(msg._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </div>
                  }
                </div>
                <div>{msg.message}</div>
                <div style={{ fontSize: "10px" }}>{formatTime(msg.createdAt)}</div>
              </div>
            )
          })
        }
        <div ref={messageRef}></div>
      </div>

      <div className={chatStyles.sendMessageSection}>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <div
          className={chatStyles.sendMessageBtn}
          onClick={handleSendMessage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default ChatRightBar