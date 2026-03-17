import React, { useEffect } from 'react'
import dashboardStyles from "../styles/dashboard.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { getAllUserPosts } from '../context/action/postAction/postAction'
import ImageComponent from '../components/imageComponent'
import { clientServer } from '../config'

const MyPosts = () => {
    const postState = useSelector((state) => state.post)
    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()


    useEffect(() => {
        const getUserPosts = async () => {
            await dispatch(getAllUserPosts())
        }
        getUserPosts()
    }, [])

    const handlePostDelete = async (post_id) => {
        const postDelete = await clientServer.post("/post/delete_post", {
            post_id
        })
        await dispatch(getAllUserPosts())
    }

    return (
        <div className={dashboardStyles.postContainer}>
            {
                postState.allUserPosts.map((post) => {
                    return (
                        <div key={post._id} className={dashboardStyles.singleCard}>
                            <div className={dashboardStyles.singleCard_profileContainer}>
                                <ImageComponent url={post.userId.profilePicture} classname={dashboardStyles.userProfileImg} />
                                <div className={dashboardStyles.profileDetails} >
                                    <div style={{ display: 'flex', gap: "1.2rem", justifyContent: 'space-between' }}>
                                        <p style={{ fontWeight: 'bold' }}>{post.userId.name}</p>
                                        {
                                            post.userId._id === userState.user._id &&
                                            <div onClick={() => handlePostDelete(post._id)}>
                                                <svg style={{ height: "1.2rem", color: "red", cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </div>
                                        }
                                    </div>
                                    <p style={{ color: 'gray' }}>{post.userId.username}</p>
                                    <p style={{ paddingTop: "1rem" }}>{post.body}</p>

                                    <div className={dashboardStyles.singleCard_image}>
                                        <img src={post.media} alt="media image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default MyPosts