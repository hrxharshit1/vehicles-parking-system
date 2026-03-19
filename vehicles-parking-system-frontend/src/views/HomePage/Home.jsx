import React from 'react'
import './Home.css'
import parking from './parking.jpg'
import Header from './Header'
import Footer from './Footer'

const Home = () => {
  return (
    <div className="dashboard">
      <Header />
      <section className="home-section">
        <div className="text-content">
          <h1 className="home-heading">Digitizing Every Drive-In</h1>
          <p className="home-subheading">
            Find, reserve, and manage parking spaces seamlessly with our smart system.
          </p>
          <button className="get-started-btn">Get Started</button>
        </div>
        <div className="image-content">
          <img src={parking} alt="Parking" className="parking-image" />
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Home;
