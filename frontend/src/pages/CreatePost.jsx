import React, { useEffect, useState } from 'react'
import createPostStyles from "../styles/createPost.module.css"
import ImageComponent from '../components/imageComponent'
import { useDispatch, useSelector } from 'react-redux'
import { createPost } from '../context/action/postAction/postAction'
import { handleError, handleSuccess } from '../utils/toast'

const CreatePost = () => {
  const userState = useSelector((state) => state.user)
  const postState = useSelector((state) => state.post)

  const dispatch = useDispatch()

  const [postContent, setPostContent] = useState("")
  const [fileContent, setFileContent] = useState()
  const [isPostContentEmpty, setIsPostContentEmpty] = useState(false)

  const handleUpload = async () => {
    const isPostContentAvailable = postContent.trim()
    if (!isPostContentAvailable) {
      setIsPostContentEmpty(true)
      return;
    }

    await dispatch(createPost({ file: fileContent, body: postContent }))
    setPostContent("")
    setFileContent(null)
    setIsPostContentEmpty(false)

  }

  useEffect(() => {
    if (postState.postUploadSuccess) {
      handleSuccess(postState.message)
    } else {
      if (postState.message !== "") {
        handleError(postState.message)

      }
    }
  }, [postState.message])

  return (
    <div className={createPostStyles.outerCreatePostContainer}>
      <div className={createPostStyles.createPostContainer}>
        <ImageComponent url={userState.user?.profilePicture} classname={createPostStyles.userProfileImg} />
        <textarea
          onChange={(e) => setPostContent(e.target.value)}
          value={postContent}
          name="" id="" placeholder='Write something about your post ...'
        ></textarea>
        <label htmlFor="fileUpload">
          <div className={createPostStyles.actionButton}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p>image</p>
          </div>
        </label>
        <input onChange={(e) => setFileContent(e.target.files[0])} type="file" name="" id="fileUpload" hidden />

      </div>
      <div>
        {isPostContentEmpty && <p>Post content should not be empty</p>}
      </div>
      <div>
        <div onClick={() => handleUpload()} className={createPostStyles.uploadButton}>Post</div>
      </div>
    </div>
  )
}

export default CreatePost