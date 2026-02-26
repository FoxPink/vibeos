import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import puter from '@heyputer/puter.js'
import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { Features } from './sections/Features'
import { HowItWorks } from './sections/HowItWorks'
import { CTA } from './sections/CTA'
import { Footer } from './sections/Footer'
import { AIChat } from '../../features/ai/AIChat'
import './LandingPage.css'

gsap.registerPlugin(ScrollTrigger)

export const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showChatBubble, setShowChatBubble] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    document.body.className = 'landing'
    checkAuth()
    
    return () => {
      document.body.className = ''
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  const checkAuth = async () => {
    try {
      const user = await puter.os.user()
      if (user && user.username) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.log('Not authenticated')
    }
  }

  return (
    <>
      <Navbar />
      <div className="landing-page">
        <div className="grain-overlay" />
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
        
        {/* Floating Chat Bubble for logged in users */}
        {isAuthenticated && (
          <>
            {showChatBubble && (
              <div className={`landing-chat-bubble ${isExpanded ? 'expanded' : ''}`}>
                <div className="chat-bubble-header">
                  <span>AI Assistant</span>
                  <div className="chat-bubble-actions">
                    <button 
                      className="btn-expand"
                      onClick={() => setIsExpanded(!isExpanded)}
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? '⤓' : '⤢'}
                    </button>
                    <button 
                      className="btn-minimize"
                      onClick={() => {
                        setShowChatBubble(false)
                        setIsExpanded(false)
                      }}
                      title="Minimize"
                    >
                      −
                    </button>
                  </div>
                </div>
                <div className="chat-bubble-content">
                  <AIChat workspaceId="default" hideHeader={true} />
                </div>
              </div>
            )}
            
            {!showChatBubble && (
              <button 
                className="landing-fab-chat"
                onClick={() => {
                  setShowChatBubble(true)
                  setIsExpanded(false)
                }}
                title="Open AI Chat"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.6 15.71 3.63 17.17L2.05 21.95L7.01 20.42C8.39 21.24 10.14 21.75 12 21.75C17.52 21.75 22 17.27 22 11.75C22 6.23 17.52 2 12 2Z" fill="currentColor"/>
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </>
  )
}
