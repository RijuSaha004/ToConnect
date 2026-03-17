import React, { useEffect, useState } from 'react'
import viewProfileStyles from "../styles/viewProfile.module.css"
import { useParams } from 'react-router-dom'
import { base_url, clientServer } from '../config'
import ImageComponent from '../components/imageComponent'

const ViewProfile = () => {
  const { user_id } = useParams()


  const [userProfile, setUserProfile] = useState({})
  const [userWork, setUserWork] = useState([])
  const [userEducation, setUserEducation] = useState([])


  useEffect(() => {
    const getProfileDetails = async (user_id) => {
      const response = await clientServer.post("/user/get_profile_based_on_id", {
        userId: user_id
      })
      setUserProfile(response.data.user)
      setUserWork(response.data.work)
      setUserEducation(response.data.education)
    }
    if (user_id) {
      getProfileDetails(user_id)
    }
  }, [])

  const handleDownloadResume = async (profile_id) => {
    const response = await clientServer.get(`/user/download_resume?id=${profile_id}`)
    window.open(`${base_url}/${response.data.resumePath}`, "_blank")
  }

  return (
    <div className={viewProfileStyles.container}>
      <div className={viewProfileStyles.backDropContainer}>
        <ImageComponent url={userProfile?.profilePicture} classname={viewProfileStyles.backDrop} />
      </div>

      <div className={viewProfileStyles.profileContainer_details}>
        <div className={viewProfileStyles.upper_details_container}>
          <div style={{ flex: "0.8" }} >
            <div style={{ display: 'flex', width: "fit-content", alignItems: 'center', gap: "1.2rem" }}>
              <p><b>{userProfile?.name}</b></p>
              <p style={{ color: 'gray' }}>{userProfile?.username}</p>

              <div onClick={() => handleDownloadResume(userProfile?._id)} style={{ cursor: "pointer" }}>
                <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>

            </div>
            <div><p>{userProfile.bio}</p></div>
          </div>
        </div>
      </div>

      <div className={viewProfileStyles.historyCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p><b>Work History</b></p>
        </div>
        <div className={viewProfileStyles.historyCardContainer}>
          {
            userWork.map((work, index) => {
              return (
                <div key={index} className={viewProfileStyles.historyCardDetails}>
                  <div>
                    <p><b>Company - {work.company}</b></p>
                    <p><b>Position - {work.position}</b></p>
                    <p><b>Experience - {work.years} Years</b></p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

      <div className={viewProfileStyles.historyCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p><b>Education</b></p>
        </div>
        <div className={viewProfileStyles.historyCardContainer}>
          {
            userEducation.map((edc, index) => {
              return (
                <div key={index} className={viewProfileStyles.historyCardDetails}>
                  <div>
                    <p><b>Institution - {edc.school}</b></p>
                    <p><b>Degree - {edc.degree}</b></p>
                    <p><b>Field - {edc.fieldOfStudy} Years</b></p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default ViewProfile