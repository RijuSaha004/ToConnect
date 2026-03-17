import React from 'react'
import { base_url } from '../config/index.js'

const ImageComponent = ({url, classname = ""}) => {
  return (
    <img src={url !== "default.png" ? url : `${base_url}/${url}`} className={classname} alt="image" />
  )
}

export default ImageComponent