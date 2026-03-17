import React, { useEffect, useState } from 'react'
import dashboardStyles from "../styles/dashboard.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { emptyMessage } from '../context/reducer/userReducer/userReducer'
import { handleSuccess } from '../utils/toast'
import { getAllComments, getAllPosts, postComment } from '../context/action/postAction/postAction'
import ImageComponent from '../components/imageComponent'
import { resetPostId } from '../context/reducer/postReducer/postReducer'
import { clientServer } from '../config'

const Dashboard = () => {
  const userState = useSelector((state) => state.user)
  const postState = useSelector((state) => state.post)
  const dispatch = useDispatch()

  const [commentText, setCommentText] = useState("")

  useEffect(() => {
    const getPosts = async () => {
      await dispatch(getAllPosts())
    }
    getPosts()
  }, [])

  useEffect(() => {
    if (userState.message !== "") {
      if (userState.loggedIn) {
        handleSuccess(userState.message)
        dispatch(emptyMessage())
      }
    }
  }, [userState.message])

  const handleResetCommentModal = () => {
    setCommentText("")
    dispatch(resetPostId())
  }

  const handleLike = async (post_id) => {
    const response = await clientServer.post("/post/increment_post_like", {
      post_id
    })
    await dispatch(getAllPosts())
  }

  const handleComments = async (post_id) => {
    await dispatch(getAllComments(post_id))
  }

  const handleSendComment = async () => {
    await dispatch(postComment({ post_id: postState.postId, body: commentText }))
    await dispatch(getAllComments(postState.postId))
    setCommentText("")
  }

  const handleDeleteComment = async (comment_id) => {
    const response = await clientServer.post("/post/delete_comment", {
      comment_id
    })
    await dispatch(getAllComments(postState.postId))
  }


  return (
    <>
      <div className={dashboardStyles.postContainer}>
        {
          postState.posts.map((post) => {
            return (
              <div key={post._id} className={dashboardStyles.singleCard}>
                <div className={dashboardStyles.singleCard_profileContainer}>
                  <ImageComponent url={post.userId.profilePicture} classname={dashboardStyles.userProfileImg} />
                  <div className={dashboardStyles.profileDetails} >
                    <div style={{ display: 'flex', gap: "1.2rem", justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: 'bold' }}>{post.userId.name}</p>
                    </div>
                    <p style={{ color: 'gray' }}>{post.userId.username}</p>
                    <p style={{ paddingTop: "1rem" }}>{post.body}</p>

                    <div className={dashboardStyles.singleCard_image}>
                      <img src={post.media} alt="media image" />
                    </div>

                    <div className={dashboardStyles.optionsContainer}>
                      <div onClick={() => handleLike(post._id)} className={dashboardStyles.singleOption_optionContainer}>
                        <svg style={{ fill: `${post.likedIds.includes(userState.user?._id) ? "gray" : ""}` }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                        </svg>
                        <p>{post.likes}</p>
                      </div>
                      <div onClick={() => handleComments(post._id)} className={dashboardStyles.singleOption_optionContainer}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      {
        postState.postId !== "" &&
        <div onClick={() => handleResetCommentModal()} className={dashboardStyles.commentsContainer}>
          <div onClick={(e) => e.stopPropagation()} className={dashboardStyles.mainCommentsContainer}>

            <div className={dashboardStyles.allComments}>
              {
                postState.comments.length === 0 && <p>No comments</p>
              }

              {
                postState.comments.length !== 0 &&
                <div>
                  {
                    postState.comments.map((comment) => {
                      return (
                        <div key={comment._id} className={dashboardStyles.singleComment}>
                          <div className={dashboardStyles.singleComment_profileContainer}>
                            <ImageComponent url={comment.userId.profilePicture} />
                            {/* <img src={comment.userId.profilePicture !== "default.png"
                                                                ? comment.userId.profilePicture
                                                                : `${base_url}/${comment.userId.profilePicture}`} alt="image"
                                                            /> */}
                            <div>
                              <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{comment.userId.name}</p>
                              <p>@{comment.userId.username}</p>
                            </div>
                          </div>
                          <p>
                            {comment.body}
                          </p>
                          {
                            comment.userId._id === userState.user._id &&
                            <div className={dashboardStyles.commentDelete}>
                              <svg
                                onClick={() => handleDeleteComment(comment._id)}
                                style={{ width: "20px", color: "red" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </div>
                          }
                        </div>
                      )
                    })
                  }
                </div>
              }
            </div>

            <div className={dashboardStyles.postCommentContainer}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)} placeholder='Share your thoughts ...'
              />
              <div
                onClick={() => handleSendComment()}
                className={dashboardStyles.postCommentContainer_commentBtn}
              >
                <p>Comment</p>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Dashboard