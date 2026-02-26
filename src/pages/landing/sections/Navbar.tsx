import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import puter from '@heyputer/puter.js'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' }
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await puter.auth.getUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.log('Not logged in')
      }
    }
    checkAuth()
  }, [])

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <a href="/" className="navbar-logo">
            <div className="logo-icon">V</div>
            <span className="logo-text">VibeOS</span>
          </a>

          <div className="navbar-links">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            {user ? (
              <>
                <span className="nav-user">Hi, {user.username}</span>
                <a href="/app" className="btn-primary btn-small">Open App</a>
              </>
            ) : (
              <>
                <a href="/auth" className="nav-link">Sign in</a>
                <a href="/auth" className="btn-primary btn-small">Get started</a>
              </>
            )}
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <a href="/app" className="btn-primary btn-block">Open App</a>
            ) : (
              <a href="/auth" className="btn-primary btn-block">Get started</a>
            )}
          </div>
        </div>
      )}
    </>
  )
}
