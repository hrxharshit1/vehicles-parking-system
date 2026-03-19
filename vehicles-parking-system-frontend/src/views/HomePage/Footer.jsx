import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-text">
          © {new Date().getFullYear()}{' '}
          <span className="company-name">Navyal Softeck Solutions Pvt. Ltd.</span> — All Rights
          Reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
