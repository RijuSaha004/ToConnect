import React from 'react'
import landingStyles from "../styles/landing.module.css"
import { useNavigate } from 'react-router-dom'

const Landing = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className={landingStyles.container}>
                <div className={landingStyles.mainContainer}>
                    <div className={landingStyles.mainContainer_left}>
                        <p>Connect with your friends</p>
                        <p>A true social media platform, with stories</p>
                        <div onClick={() => navigate("/dashboard")} className={landingStyles.homeButton}>
                            Join now
                        </div>
                    </div>
                    <div className={landingStyles.mainContainer_right}>
                        <img src="image/landingPage_image.png" alt="home_img" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Landing