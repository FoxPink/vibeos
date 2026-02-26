import { useState } from 'react'
import puter from '@heyputer/puter.js'
import { Sparkles, Zap, Rocket } from 'lucide-react'
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
      <div className="auth-background">
        <div className="gradient-blur gradient-blur-1"></div>
        <div className="gradient-blur gradient-blur-2"></div>
      </div>

      <div className="auth-container">
        <a href="/" className="auth-logo">
          <div className="logo-icon">V</div>
          <span className="logo-text">VibeOS</span>
        </a>

        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome to VibeOS</h1>
            <p>Your AI-native workspace for building amazing things</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Sparkles size={24} />
              </div>
              <h3>AI-Powered</h3>
              <p>Context-aware assistant that understands your work</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={24} />
              </div>
              <h3>Lightning Fast</h3>
              <p>Modular workspace built for speed</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Rocket size={24} />
              </div>
              <h3>Built for Builders</h3>
              <p>Perfect for indie makers and creators</p>
            </div>
          </div>

          <button 
            className="btn-auth"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in to get started'}
          </button>

          {error && <p className="error-message">{error}</p>}

          <p className="auth-note">
            Free to start • No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
