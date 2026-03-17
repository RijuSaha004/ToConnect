import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Navbar from './components/Navbar.jsx'
import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Discover from './pages/Discover.jsx'
import Connections from './pages/Connections.jsx'
import CreatePost from './pages/CreatePost.jsx'
import MyProfile from './pages/MyProfile.jsx'
import MyPosts from './pages/MyPosts.jsx'
import ViewProfile from './pages/ViewProfile.jsx'
import ConnectedRequest from './pages/ConnectedRequest.jsx'
import PendingRequest from './pages/PendingRequest.jsx'
import RecivedRequest from './pages/RecivedRequest.jsx'
import Chats from './pages/Chats.jsx'
import ChatRightBar from './components/ChatRightBar.jsx'

function App() {


  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardLayout />} >
            <Route path="" element={<Dashboard />} />
            <Route path="chats" element={<Chats />} >
              <Route path=':id' element={<ChatRightBar />} />
            </Route>
            <Route path="posts" element={<MyPosts />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path='view_profile/:user_id' element={<ViewProfile />} />
            <Route path="discover" element={<Discover />} />
            <Route path="create_post" element={<CreatePost />} />
            <Route path="connections" element={<Connections />} >
              <Route path="" element={<ConnectedRequest />} />
              <Route path="pending" element={<PendingRequest />} />
              <Route path="recived" element={<RecivedRequest />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
