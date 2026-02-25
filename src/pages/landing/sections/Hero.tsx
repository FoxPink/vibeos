import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Sparkles } from 'lucide-react'

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.children || [], {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} id="hero" className="hero-section">
      <div className="hero-bg-wrapper">
        <img src="/hero-city.jpg" alt="" className="hero-bg-image" />
        <div className="hero-bg-overlay" />
      </div>

      <div className="section-container">
        <div ref={contentRef} className="hero-content-center">
          <div className="hero-badge">
            <Sparkles className="badge-icon" />
            <span>YOUR PERSONAL AI WORKSPACE</span>
          </div>

          <h1 className="hero-title">
            Organize your life with <span className="gradient-text">AI assistant</span>
          </h1>

          <p className="hero-description">
            Notes, tasks, ideas—all in one place. Your AI assistant understands everything and helps you stay organized.
          </p>

          <div className="hero-actions">
            <a href="/auth" className="btn-primary btn-large">
              Start free today
              <ArrowRight className="btn-icon" />
            </a>
            <a href="#features" className="btn-secondary btn-large">
              Learn more
            </a>
          </div>

          <div className="hero-social-proof">
            <div className="avatars">
              <div className="avatar">JD</div>
              <div className="avatar">SK</div>
              <div className="avatar">AL</div>
              <div className="avatar-more">+2.5K</div>
            </div>
            <p className="social-proof-text">
              Join <strong>2,500+ people</strong> organizing their life with VibeOS
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
