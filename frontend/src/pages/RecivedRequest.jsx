import React, { useEffect } from 'react'
import connectionStyles from "../styles/connection.module.css"
import { getRecivedConnections } from '../context/action/userAction/userAction'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ImageComponent from '../components/imageComponent'
import { clientServer } from '../config'

const RecivedRequest = () => {
  const userState = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  useEffect(() => {
    const fetchReceivedRequests = async () => {
      await dispatch(getRecivedConnections())
    }
    fetchReceivedRequests()
  }, [])

  const handleAcceptConnection = async (connectionId) => {
    const response = await clientServer.post("/user/accept_connection_request", {
      connectionId
    })
    await dispatch(getRecivedConnections())
  }

  const handleRejectConnection = async (connectionId) => {
    const response = await clientServer.post("/user/reject_connection_request", {
      connectionId
    })
    await dispatch(getRecivedConnections())
  }

  return (
    <div>
      {
        userState.receivedConnections.length === 0 && <div style={{ color: "white" }}><b>No Request Received</b></div>
      }
      {
        userState.receivedConnections.length !== 0 &&
        userState.receivedConnections.map((connection) => {
          if (connection.status_accepted === false) {
            return (
              <div onClick={() => navigate(`/dashboard/view_profile/${connection.senderId._id}`)} key={connection.senderId._id} className={connectionStyles.userCard}>
                <div className={connectionStyles.userCard_details}>
                  <ImageComponent url={connection.senderId.profilePicture} classname={connectionStyles.userCard_image} />
                  <div>
                    <p><b>{connection.senderId.name}</b></p>
                    <p>{connection.senderId.email}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: "1rem" }}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAcceptConnection(connection._id)
                    }}
                    className={connectionStyles.userCard_requestBtn}
                  >Accept</div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRejectConnection(connection._id)
                    }}
                    className={connectionStyles.userCard_requestBtn}
                  >Reject</div>
                </div>
              </div>
            )
          }
        })
      }
    </div>
  )
}

export default RecivedRequest