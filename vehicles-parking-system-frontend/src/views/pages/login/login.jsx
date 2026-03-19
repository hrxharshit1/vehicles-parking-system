import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../../apiConfig'
import './Login.css'
import Header from '../../HomePage/Header'
import Footer from '../../HomePage/Footer'

const Login = ({ setIsLoggedIn, setUserRole }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, formData)

      const access_token = response.data.access_token
      if (access_token) {
        console.log('Token received', access_token)
        localStorage.setItem('access_token', access_token)
        setIsLoggedIn(true)
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error during login', error)
      if (error.response) {
        setError(error.response.data.message || 'Invalid credentials')
      } else {
        setError('An error occurred. Please try again later')
      }
    }
  }

  return (
    <>
      <div className="page-container">
        <Header />
        <div className="main-content">
          <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="email"
                name="username"
                placeholder="Email or Mobile"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="register-link">
              {error && <p className="error-message">{error}</p>}
              <p className="register-link">If you do not have an account, click here</p>
              <Link className="register" to="/register">
                Register Now!
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Login
