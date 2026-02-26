import { ArrowRight, Check, Sparkles, Zap, Shield } from 'lucide-react'
import { useScrollAnimation } from '../../../hooks/useScrollAnimation'

export const CTA = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation()

  return (
    <section ref={sectionRef} id="pricing" className="cta-section">
      <div className="cta-background">
        <img 
          src="/cta-city.jpg" 
          alt="CTA background" 
          className="cta-bg-image"
        />
        <div className="cta-overlay" />
      </div>

      <div className="section-container">
        <div className={`cta-content animate-stagger ${isVisible ? 'is-visible' : ''}`}>
          <div className="cta-badge">
            <Sparkles className="badge-icon" />
            <span>START BUILDING TODAY</span>
          </div>

          <h2 className="cta-title">
            Ready to get <span className="gradient-text">organized</span>?
          </h2>
          
          <p className="cta-subtitle">
            Join 2,500+ people using VibeOS to organize their life
          </p>

          <div className="cta-actions">
            <a href="/auth" className="btn-primary btn-large">
              Get started free
              <ArrowRight className="btn-icon" />
            </a>
          </div>

          <div className="cta-features">
            <div className="cta-feature">
              <Check className="cta-feature-icon" />
              <span>Free forever plan</span>
            </div>
            <div className="cta-feature">
              <Zap className="cta-feature-icon" />
              <span>No credit card needed</span>
            </div>
            <div className="cta-feature">
              <Shield className="cta-feature-icon" />
              <span>Your data stays private</span>
            </div>
          </div>

          <div className="cta-stats">
            <div className="cta-stat">
              <div className="cta-stat-value">2.5K+</div>
              <div className="cta-stat-label">Happy users</div>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <div className="cta-stat-value">50K+</div>
              <div className="cta-stat-label">Notes created</div>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <div className="cta-stat-value">4.9/5</div>
              <div className="cta-stat-label">User rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
