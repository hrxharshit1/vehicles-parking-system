import React, { useState } from 'react'
import './Registration.css'
import { Link, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../../apiConfig'
import Footer from '../../HomePage/Footer'
import Header from '../../HomePage/Header'

const Register = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    address: '',
    email: '',
    password: '',
    gstNo: '',
    companyName: '',
    verified: false,
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Optional: check if verified is checked before proceeding
    if (!formData.verified) {
      setError('You must agree to continue.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      setError('')
      setSuccess('Registration successful! Please log in.')

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Header />
      <div className="register-container">
        <h2 className="title">Create Your Account</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="GSRIN"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
          {/* Checkbox */}
          <div className="checkbox">
            <input
              type="checkbox"
              id="agree"
              checked={formData.verified}
              onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
            />
            <label htmlFor="agree">Remember me</label>
          </div>

          <button type="submit" className="create-button">
            Create
          </button>
        </form>

        {/* Error or success message */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <p className="login-text">If you have already account, login</p>
        <Link to="/login" className="login-link">
          Login Now
        </Link>
      </div>
      <Footer />
    </>
  )
}

export default Register
