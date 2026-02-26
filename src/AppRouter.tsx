import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import puter from '@heyputer/puter.js'
import { LandingPage } from './pages/landing/LandingPage'
import { AuthScreen } from './features/auth/AuthScreen'
import { MainApp } from './features/app/MainApp'
import { DocsPage } from './pages/docs/DocsPage'

export const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await puter.os.user()
      if (user && user.username) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.log('Not authenticated')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  // Set body class based on route
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/' || path.startsWith('/landing')) {
      document.body.className = 'landing'
    } else {
      document.body.className = 'app'
    }
  }, [])

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading VibeOS...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page - public */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Documentation - public */}
        <Route path="/docs" element={<DocsPage />} />
        
        {/* Auth - redirect if already authenticated */}
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <AuthScreen onAuthSuccess={handleAuthSuccess} />
            )
          } 
        />
        
        {/* App - protected */}
        <Route 
          path="/app" 
          element={
            isAuthenticated ? (
              <MainApp />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}
