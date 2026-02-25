import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navbar } from './sections/Navbar'
import { Hero } from './sections/Hero'
import { Features } from './sections/Features'
import { HowItWorks } from './sections/HowItWorks'
import { CTA } from './sections/CTA'
import { Footer } from './sections/Footer'
import './LandingPage.css'

gsap.registerPlugin(ScrollTrigger)

export const LandingPage = () => {
  useEffect(() => {
    document.body.className = 'landing'
    
    return () => {
      document.body.className = ''
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

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
      </div>
    </>
  )
}
