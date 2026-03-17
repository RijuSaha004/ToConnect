import React from 'react'
import connectionStyles from "../styles/connection.module.css"
import { NavLink, Outlet } from 'react-router-dom'

const Connections = () => {
  return (
    <div className={connectionStyles.main_container}>
      <div className={connectionStyles.header_container}>
        <p><b>Check your Connections</b></p>
        <div className={connectionStyles.options_container}>
          <NavLink to={"/dashboard/connections"} >Connected</NavLink>
          <NavLink to={"/dashboard/connections/pending"} >Pending</NavLink>
          <NavLink to={"/dashboard/connections/recived"} >Recived</NavLink>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default Connections