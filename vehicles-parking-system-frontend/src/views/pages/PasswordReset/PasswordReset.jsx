import React, { useState } from 'react'
import './PasswordReset.css'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Password reset link sent to:', email)
    setSubmitted(true)
  }

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Reset Password</h2>
        {submitted ? (
          <p className="success-msg">A reset link has been sent to your email.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <span className="email-icon">@</span>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Send Reset Link</button>
          </form>
        )}
        <div className="back-to-login">
          <a href="/login">← Back to login</a>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
