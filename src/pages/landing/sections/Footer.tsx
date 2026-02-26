import { Github, Twitter, Linkedin } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="section-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">V</div>
              <span className="logo-text">VibeOS</span>
            </div>
            <p className="footer-tagline">
              AI-native workspace for indie builders
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <Github />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <Linkedin />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Product</h4>
              <a href="#features" className="footer-link">Features</a>
              <a href="#how-it-works" className="footer-link">How it works</a>
              <a href="#pricing" className="footer-link">Pricing</a>
              <a href="/auth" className="footer-link">Get started</a>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Resources</h4>
              <a href="/docs" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">API Reference</a>
              <a href="#" className="footer-link">Guides</a>
              <a href="#" className="footer-link">Blog</a>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <a href="#" className="footer-link">About</a>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 VibeOS. Built by FoxPink.
          </p>
        </div>
      </div>
    </footer>
  )
}
