import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'

import './scss/style.scss'
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const HomePage = React.lazy(() => import('./views/HomePage/Home.jsx'))
const Login = React.lazy(() => import('./views/pages/login/Login.jsx'))
const Register = React.lazy(() => import('./views/pages/registration/Registration.jsx'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const token = localStorage.getItem('access_token')
  if (!isLoggedIn || !token) {
    return <Navigate to="/login" replace />
  }
  return children
}

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Apply theme (fixed missing dependencies warning)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }
  }, [isColorModeSet, setColorMode, storedTheme])

  // Restore login status
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(!!(token && loggedInStatus))
    setIsLoading(false)
  }, [])

  // Login handler
  const handleLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
  }

  // ✅ Logout handler with homepage redirect
  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('access_token')
    localStorage.removeItem('isLoggedIn')
    window.location.hash = '/homepage' // 👈 Redirects user after logout
  }

  if (isLoading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login setIsLoggedIn={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/404" element={<Page404 />} />
              <Route path="/500" element={<Page500 />} />
              <Route path="*" element={<Navigate to="/homepage" replace />} />
            </>
          ) : (
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <DefaultLayout handleLogout={handleLogout} /> {/* 👈 Passing down handleLogout */}
                </ProtectedRoute>
              }
            />
          )}
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
