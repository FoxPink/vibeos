import { FileText, MessageSquare, Sparkles, ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '../../../hooks/useScrollAnimation'

const steps = [
  {
    icon: FileText,
    number: '01',
    title: 'Write & Organize',
    description: 'Capture your thoughts, ideas, and to-dos. Organize them in folders that make sense to you.',
    color: '#8B5CF6'
  },
  {
    icon: MessageSquare,
    number: '02',
    title: 'Ask Your AI',
    description: 'Can\'t find something? Just ask. Your AI assistant knows everything you\'ve written.',
    color: '#2EE9FF'
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Stay Organized',
    description: 'Get smart suggestions, reminders, and summaries. Focus on what matters.',
    color: '#22C55E'
  }
]

export const HowItWorks = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation()
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation({ threshold: 0.2 })

  return (
    <section ref={sectionRef} id="how-it-works" className="how-it-works-section">
      <div className="how-it-works-bg-wrapper">
        <img src="/portrait-left.jpg" alt="" className="how-it-works-bg-image" />
        <div className="how-it-works-bg-overlay" />
      </div>

      <div className="section-container">
        <div className={`section-header animate-stagger ${sectionVisible ? 'is-visible' : ''}`}>
          <span className="eyebrow">HOW IT WORKS</span>
          <h2 className="section-title">
            Simple by design. Powerful when you need it.
          </h2>
        </div>

        <div ref={stepsRef as any} className={`steps-container animate-stagger ${stepsVisible ? 'is-visible' : ''}`}>
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number" style={{ color: step.color + '20' }}>{step.number}</div>
              <div className="step-icon glass-card-sm" style={{ borderColor: step.color + '40' }}>
                <step.icon style={{ color: step.color }} />
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              <div className="step-glow" style={{ background: `radial-gradient(circle, ${step.color}15 0%, transparent 70%)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
