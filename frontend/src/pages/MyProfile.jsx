import React, { useEffect, useState } from 'react'
import myProfileStyle from "../styles/myProfile.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addNewEducation, addNewWork, getAboutUser, getAllUserEducation, getAllUserWork, updateUserData } from '../context/action/userAction/userAction'
import ImageComponent from '../components/imageComponent'
import { handleError, handleSuccess } from '../utils/toast'
import { emptyMessage } from '../context/reducer/userReducer/userReducer'
import { clientServer } from '../config'

const MyProfile = () => {
  const userState = useSelector((state) => state.user)
  const postState = useSelector((state) => state.post)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [currentPost, setCurrentPost] = useState("")

  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [experience, setExperience] = useState("")

  const [school, setSchool] = useState("")
  const [degree, setDegree] = useState("")
  const [fieldOfStudy, setFieldOfStudy] = useState("")



  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false)
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false)

  useEffect(() => {
    const getUserDetails = async () => {
      dispatch(emptyMessage())
      await dispatch(getAboutUser())
      await dispatch(getAllUserWork())
      await dispatch(getAllUserEducation())
    }
    getUserDetails()
  }, [])

  useEffect(() => {

    if (userState.user !== undefined) {
      setName(userState.user.name)
      setUsername(userState.user.username)
      setBio(userState.user.bio)
      setCurrentPost(userState.user.currentPost)
    }
  }, [userState.user])

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


  const handleProfileModalReset = () => {
    setName(userState.user.name)
    setUsername(userState.user.username)
    setBio(userState.user.bio)
    setCurrentPost(userState.user.currentPost)
    setIsProfileModalOpen(false)
  }

  const handleWorkModalReset = () => {
    setCompany("")
    setPosition("")
    setExperience("")
    setIsWorkModalOpen(false)
  }

  const handleEducationModalReset = () => {
    setSchool("")
    setDegree("")
    setFieldOfStudy("")
    setIsEducationModalOpen(false)
  }

  const handleUpdateUserData = async () => {
    await dispatch(updateUserData({ name, username, currentPost, bio }))
    await dispatch(getAboutUser())
    setIsProfileModalOpen(false)
  }

  const handleAddWorkData = async () => {
    await dispatch(addNewWork({ company, position, experience: Number(experience) }))
    await dispatch(getAllUserWork())
    handleWorkModalReset()
  }

  const handleAddEducationData = async () => {
    await dispatch(addNewEducation({ school, degree, fieldOfStudy }))
    await dispatch(getAllUserEducation())
    handleEducationModalReset()

  }

  const handleDeleteWork = async (workId) => {
    const response = await clientServer.post("/user/delete_work", {
      workId
    })
    await dispatch(getAllUserWork())
  }

  const handleDeleteEducation = async (educationId) => {
    const response = await clientServer.post("/user/delete_education", {
      educationId
    })
    await dispatch(getAllUserEducation())
  }

  const uploadProfilePicture = async (file) => {
    const formData = new FormData()
    formData.append("profile_picture", file)

    const response = await clientServer.post("/user/update_profile_picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    await dispatch(getAboutUser())
  }


  return (
    <div className={myProfileStyle.profile_container}>
      {
        userState.user &&
        <div className={myProfileStyle.container}>
          <div className={myProfileStyle.backDropContainer}>
            <label htmlFor='profilePictureUpload' className={myProfileStyle.backDrop_overLay}><p>Edit</p></label>
            <input onChange={
              (e) => uploadProfilePicture(e.target.files[0])
            } type="file" id='profilePictureUpload' hidden />
            <ImageComponent url={userState.user?.profilePicture} classname={myProfileStyle.backDrop} />
          </div>

          <div className={myProfileStyle.profileContainer_details}>
            <div className={myProfileStyle.upper_details_container}>
              <div style={{ flex: "0.8" }} >
                <div style={{ display: 'flex', width: "fit-content", alignItems: 'center', gap: "1.2rem" }}>
                  <p><b>{userState.user?.name}</b></p>
                  <p style={{ color: 'gray' }}>{userState.user?.username}</p>
                  <div className={myProfileStyle.editBtn} onClick={() => setIsProfileModalOpen(true)}>Edit Profile</div>
                </div>

                <div><p>{userState.user?.bio}</p></div>
              </div>

            </div>
          </div>

          <div className={myProfileStyle.historyCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p><b>Work History</b></p>
              <div onClick={() => setIsWorkModalOpen(true)} className={myProfileStyle.openModalBtn}><b>Add WorkExperiece</b></div>
            </div>
            <div className={myProfileStyle.historyCardContainer}>
              {
                userState.allUserWork?.map((work, index) => {
                  return (
                    <div key={index} className={myProfileStyle.historyCardDetails}>
                      <div>
                        <p><b>Company - {work.company}</b></p>
                        <p><b>Position - {work.position}</b></p>
                        <p><b>Experience - {work.years} Years</b></p>
                      </div>
                      <div
                        onClick={() => handleDeleteWork(work._id)}
                        style={{ display: 'flex', flex: "0.2", height: "1.5rem", width: "100%" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>

          <div className={myProfileStyle.historyCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p><b>Education</b></p>
              <div onClick={() => setIsEducationModalOpen(true)} className={myProfileStyle.openModalBtn}><b>Add Education</b></div>
            </div>
            <div className={myProfileStyle.historyCardContainer}>
              {
                userState.allUserEducation?.map((edc, index) => {
                  return (
                    <div key={index} className={myProfileStyle.historyCardDetails}>
                      <div>
                        <p><b>Institution - {edc.school}</b></p>
                        <p><b>Degree - {edc.degree}</b></p>
                        <p><b>Field - {edc.fieldOfStudy} Years</b></p>
                      </div>
                      <div
                        onClick={() => handleDeleteEducation(edc._id)}
                        style={{ display: 'flex', flex: "0.2", height: "1.5rem", width: "100%" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>

          {
            isProfileModalOpen &&
            <div onClick={() => handleProfileModalReset()} className={myProfileStyle.modalContainer}>
              <div onClick={(e) => e.stopPropagation()} className={myProfileStyle.modal}>
                <div className={myProfileStyle.inputContainer}>
                  <div>
                    <p>Enter your Name</p>
                    <input onChange={(e) => { setName(e.target.value) }} type="text" name='' value={name} placeholder='Enter your name ...' />
                  </div>
                  <div>
                    <p>Enter your Username</p>
                    <input onChange={(e) => { setUsername(e.target.value) }} type="text" name='' value={username} placeholder='Enter your username ...' />
                  </div>
                  <div>
                    <p>Enter your CurrentPost</p>
                    <input onChange={(e) => { setCurrentPost(e.target.value) }} type="text" name='' value={currentPost} placeholder='Enter your current post in job' />
                  </div>
                  <div>
                    <p>Enter your Bio</p>
                    <input onChange={(e) => { setBio(e.target.value) }} type="text" name='' value={bio} placeholder='Enter your bio' />
                  </div>
                </div>
                <div className={myProfileStyle.buttonContainer}>
                  <div onClick={() => handleUpdateUserData()} className={myProfileStyle.updateBtn}>
                    UPDATE
                  </div>
                </div>
              </div>
            </div>
          }

          {
            isWorkModalOpen &&
            <div onClick={() => handleWorkModalReset()} className={myProfileStyle.modalContainer}>
              <div onClick={(e) => e.stopPropagation()} className={myProfileStyle.modal}>
                <div><b>All Fields Are Required</b></div>
                <div className={myProfileStyle.inputContainer}>
                  <div>
                    <p>Enter your Company name</p>
                    <input onChange={(e) => { setCompany(e.target.value) }} type="text" name='' value={company} placeholder='Enter your company name ...' />
                  </div>
                  <div>
                    <p>Enter your position</p>
                    <input onChange={(e) => { setPosition(e.target.value) }} type="text" name='' value={position} placeholder='Enter your position in company ...' />
                  </div>
                  <div>
                    <p>Enter your years of experience</p>
                    <input onChange={(e) => { setExperience(e.target.value) }} type="text" name='' value={experience} placeholder='Enter your years of experience ...' />
                  </div>
                </div>
                <div className={myProfileStyle.buttonContainer}>
                  <div onClick={() => handleAddWorkData()} className={myProfileStyle.updateBtn}>
                    Add Work
                  </div>
                </div>
              </div>
            </div>
          }

          {
            isEducationModalOpen &&
            <div onClick={() => handleEducationModalReset()} className={myProfileStyle.modalContainer}>
              <div onClick={(e) => e.stopPropagation()} className={myProfileStyle.modal}>
                <div><b>All Fields Are Required</b></div>
                <div className={myProfileStyle.inputContainer}>
                  <div>
                    <p>Enter your School / Collage name</p>
                    <input onChange={(e) => { setSchool(e.target.value) }} type="text" name='' value={school} placeholder='Enter your school / collage name ...' />
                  </div>
                  <div>
                    <p>Enter your Degree</p>
                    <input onChange={(e) => { setDegree(e.target.value) }} type="text" name='' value={degree} placeholder='Enter your degree name ...' />
                  </div>
                  <div>
                    <p>Enter your Field of Study</p>
                    <input onChange={(e) => { setFieldOfStudy(e.target.value) }} type="text" name='' value={fieldOfStudy} placeholder='Enter your field of study ...' />
                  </div>
                </div>
                <div className={myProfileStyle.buttonContainer}>
                  <div onClick={() => handleAddEducationData()} className={myProfileStyle.updateBtn}>
                    Add Education
                  </div>
                </div>
              </div>
            </div>
          }

        </div>
      }
    </div>
  )
}

export default MyProfile
