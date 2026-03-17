import React, { useEffect } from 'react'
import connectionStyles from "../styles/connection.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { getRequestedConnections } from '../context/action/userAction/userAction'
import ImageComponent from '../components/imageComponent'
import { useNavigate } from 'react-router-dom'
import { clientServer } from '../config'

const PendingRequest = () => {
    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRequestedRequests = async () => {
            await dispatch(getRequestedConnections())
        }
        fetchRequestedRequests()
    }, [])

    const handleUnsendConnection = async (connectionId) => {
        const response = await clientServer.post("/user/unsend_request", {
            connectionId
        })
        await dispatch(getRequestedConnections())
    }


    return (
        <div>
            {
                userState.requestedConnections.length === 0 && <div style={{ color: "white" }}><b>No Pending Request</b></div>
            }
            {
                userState.requestedConnections.length !== 0 &&
                userState.requestedConnections.map((connection) => {
                    if (connection.status_accepted === false) {
                        return (
                            <div onClick={() => navigate(`/dashboard/view_profile/${connection.receiverId._id}`)} key={connection.receiverId._id} className={connectionStyles.userCard}>
                                <div className={connectionStyles.userCard_details}>
                                    <ImageComponent url={connection.receiverId.profilePicture} classname={connectionStyles.userCard_image} />
                                    <div>
                                        <p><b>{connection.receiverId.name}</b></p>
                                        <p>{connection.receiverId.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnsendConnection(connection._id)
                                        }}
                                        className={connectionStyles.userCard_requestBtn}>Unsend</div>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}

export default PendingRequest