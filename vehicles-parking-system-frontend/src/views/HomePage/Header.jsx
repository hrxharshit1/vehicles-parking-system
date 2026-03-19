import React, { useState } from 'react'
import './Header.css'
import logo from './logo.png'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo Left */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Parking Logo" />
          </Link>
        </div>

        {/* Menu Right */}
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
        </nav>

        {/* Hamburger Icon for Mobile */}
        <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </header>
  )
}

export default Header

// import React, { useState } from "react";
// import './Header.css';
// import logo from './logo.png';
// import { Link } from "react-router-dom";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <img src={logo} alt="Logo" />
//       </div>

//       <div className={`menu-icon ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
//         &#9776;
//       </div>

//       <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
//         <li>
//           <Link to="*">Home</Link>
//         </li>
//         <li>
//           <Link to="/login">Login</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Header;
