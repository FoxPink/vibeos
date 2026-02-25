import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FileText, MessageSquare, Sparkles, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

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
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children || [], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      })

      gsap.from(stepsRef.current?.children || [], {
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="how-it-works-section">
      <div className="how-it-works-bg-wrapper">
        <img src="/portrait-left.jpg" alt="" className="how-it-works-bg-image" />
        <div className="how-it-works-bg-overlay" />
      </div>

      <div className="section-container">
        <div ref={headerRef} className="section-header">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2 className="section-title">
            Simple by design. Powerful when you need it.
          </h2>
        </div>

        <div ref={stepsRef} className="steps-container">
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
