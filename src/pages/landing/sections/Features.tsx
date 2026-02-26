import { Brain, Clock, Shield, Users, Smartphone, Globe } from 'lucide-react'
import { useScrollAnimation } from '../../../hooks/useScrollAnimation'

const features = [
  {
    icon: Brain,
    title: 'Smart AI Assistant',
    description: 'Your personal AI that learns from your notes and helps you find anything instantly.',
    visual: 'brain'
  },
  {
    icon: Clock,
    title: 'Save Time Daily',
    description: 'Organize tasks, set reminders, and never forget important things again.',
    visual: 'speed'
  },
  {
    icon: Shield,
    title: 'Your Data is Safe',
    description: 'Everything is encrypted and private. Only you can access your information.',
    visual: 'secure'
  },
  {
    icon: Users,
    title: 'Share with Family',
    description: 'Create shared spaces for family notes, shopping lists, and plans.',
    visual: 'modular'
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    description: 'Access from phone, tablet, or computer. Always in sync.',
    visual: 'offline'
  },
  {
    icon: Globe,
    title: 'Works Offline',
    description: 'Keep working even without internet. Everything syncs when you\'re back online.',
    visual: 'workflow'
  }
]

export const Features = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation()
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.2 })

  return (
    <section ref={sectionRef} id="features" className="features-section">
      <div className="features-bg-wrapper">
        <img src="/portrait-right.jpg" alt="" className="features-bg-image" />
        <div className="features-bg-overlay" />
      </div>

      <div className="section-container">
        <div className={`section-header animate-stagger ${sectionVisible ? 'is-visible' : ''}`}>
          <span className="eyebrow">FEATURES</span>
          <h2 className="section-title">
            Everything you need<br />in one place
          </h2>
          <p className="section-subtitle">
            Simple tools that help you stay organized and productive
          </p>
        </div>

        <div ref={cardsRef as any} className={`features-grid animate-stagger ${cardsVisible ? 'is-visible' : ''}`}>
          {features.map((feature, index) => (
            <div key={index} className="feature-card glass-card">
              <div className="feature-visual-bg" data-visual={feature.visual} />
              <div className="feature-icon">
                <feature.icon />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-shine" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
