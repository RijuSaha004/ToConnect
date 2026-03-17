import React, { useEffect } from 'react'
import connectionStyles from "../styles/connection.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllAcceptedConnections } from '../context/action/userAction/userAction'
import ImageComponent from '../components/imageComponent'
import { clientServer } from '../config'

const ConnectedRequest = () => {
  const userState = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      await dispatch(getAllAcceptedConnections())
    }
    fetchAcceptedRequests()
  }, [])

  const handleDeleteConnection = async (pairUserId) => {
    const response = await clientServer.post("/user/delete_accepted_connection", {
      pairUserId
    })
    await dispatch(getAllAcceptedConnections())
  }

  return (
    <div>
      {
        userState.allAcceptedUserConnections.length === 0 && <div style={{ color: "white" }}><b>No Connection</b></div>
      }
      {
        userState.allAcceptedUserConnections.length !== 0 &&
        userState.allAcceptedUserConnections.map((connection) => {
          return (
            <div onClick={() => navigate(`/dashboard/view_profile/${connection._id}`)} key={connection._id} className={connectionStyles.userCard}>
              <div className={connectionStyles.userCard_details}>
                <ImageComponent url={connection.profilePicture} classname={connectionStyles.userCard_image} />
                <div>
                  <p><b>{connection.name}</b></p>
                  <p>{connection.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: "1rem" }}>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteConnection(connection._id)
                  }}
                  className={connectionStyles.userCard_requestBtn}
                >Delete</div>
              </div>
            </div>
          )

        })
      }
    </div>
  )
}

export default ConnectedRequest