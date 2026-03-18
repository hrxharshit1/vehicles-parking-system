import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user || !user.roles || !user.roles[role]) {
    return <Navigate to="/login" replace />
  }
  return children
}
export default ProtectedRoute
