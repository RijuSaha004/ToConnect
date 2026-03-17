import React, { useEffect, useState } from 'react'
import discoverStyles from "../styles/discover.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllUser, getRequestedConnections, sendConnectionRequest } from '../context/action/userAction/userAction'
import ImageComponent from '../components/imageComponent'
import { handleError, handleSuccess } from '../utils/toast'
import { emptyMessage } from '../context/reducer/userReducer/userReducer'

const Discover = () => {
  const userState = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const getDetails = async () => {
      await dispatch(getAllUser())

    }
    getDetails()
  }, [])

  useEffect(() => {
    if (userState.message !== "") {
      if (userState.isProcessSuccess) {
        handleSuccess(userState.message)
        dispatch(emptyMessage())
      } else {
        handleError(userState.message)
        dispatch(emptyMessage())
      }
    }
  }, [userState.message])

  const handleSendRequest = async (user_id) => {
    await dispatch(sendConnectionRequest({ user_id }))
    await dispatch(getAllUser())
  }


  return (
    <>
      <div className={discoverStyles.allUserProfile}>
        <p><b>Divscover People</b></p>
        {
          userState.all_profiles_fetched && userState.all_users.map((user) => {
            return (
              <div onClick={() => navigate(`/dashboard/view_profile/${user._id}`)} key={user._id} className={discoverStyles.userCard}>
                <div className={discoverStyles.userCard_details}>
                  <ImageComponent url={user?.profilePicture} classname={discoverStyles.userCard_image} />
                  <div>
                    <p><b>{user?.name}</b></p>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSendRequest(user._id)
                    }}
                    className={discoverStyles.userCard_requestBtn}>Send Request</div>
                </div>
              </div>
            )

          })
        }
      </div>
    </>
  )
}

export default Discover