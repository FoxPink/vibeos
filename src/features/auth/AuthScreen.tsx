import { useState } from 'react'
import puter from '@heyputer/puter.js'
import './AuthScreen.css'

interface AuthScreenProps {
  onAuthSuccess: () => void
}

export const AuthScreen = ({ onAuthSuccess }: AuthScreenProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Puter.js handles authentication UI
      await puter.auth.signIn()
      onAuthSuccess()
    } catch (err) {
      setError('Authentication failed. Please try again.')
      console.error('Auth error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo">
            <div className="logo-icon">V</div>
            <h1>VibeOS</h1>
          </div>
          <p className="tagline">Your AI-powered creative command center</p>
        </div>

        <div className="auth-content">
          <h2>Welcome to VibeOS</h2>
          <p className="subtitle">
            The AI-native workspace designed for indie builders, creators, and solo founders.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">AI</span>
              <span>Context-aware AI that understands your work</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">FAST</span>
              <span>Lightning-fast, modular workspace</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">BUILD</span>
              <span>Built for people building online</span>
            </div>
          </div>

          <button 
            className="auth-button"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in to get started'}
          </button>

          {error && <p className="error-message">{error}</p>}

          <p className="auth-footer">
            Free to start - No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
