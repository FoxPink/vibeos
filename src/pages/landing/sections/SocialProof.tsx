import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "It feels like the OS I always wanted.",
    name: "Alex",
    role: "Indie Hacker",
    avatar: "A",
  },
  {
    quote: "I open it and I'm already working.",
    name: "Sam",
    role: "Content Creator",
    avatar: "S",
  },
  {
    quote: "The AI actually understands my projects.",
    name: "Jordan",
    role: "Designer",
    avatar: "J",
  },
];

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !header || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(header,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Cards stagger animation
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 z-[60]"
      style={{ backgroundColor: '#070A12' }}
    >
      {/* Faint city silhouette at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 opacity-5 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(46,233,255,0.2) 0%, transparent 100%)'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 
            className="font-heading font-bold text-vibe-text mb-6"
            style={{ fontSize: 'clamp(32px, 3.2vw, 52px)' }}
          >
            Loved by indie builders.
          </h2>
          <p className="text-vibe-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Creators, founders, and teams using VibeOS to ship faster.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={el => { cardsRef.current[index] = el; }}
              className="glass-card p-6 group hover:border-vibe-cyan/30 transition-all duration-300 relative"
            >
              {/* Cyan ring for middle card */}
              {index === 1 && (
                <div className="absolute -right-6 -bottom-6 w-24 h-24 cyan-ring opacity-30" />
              )}

              <div className="relative z-10">
                <Quote className="w-8 h-8 text-vibe-cyan/40 mb-4" />
                
                <p className="text-vibe-text text-lg leading-relaxed mb-6 font-medium">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vibe-cyan/20 flex items-center justify-center">
                    <span className="text-vibe-cyan font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="text-vibe-text font-medium">{testimonial.name}</div>
                    <div className="text-vibe-text-secondary text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-heading font-bold text-vibe-cyan mb-1">2,500+</div>
            <div className="text-vibe-text-secondary text-sm">Waitlist signups</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-heading font-bold text-vibe-cyan mb-1">50+</div>
            <div className="text-vibe-text-secondary text-sm">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-heading font-bold text-vibe-cyan mb-1">99.9%</div>
            <div className="text-vibe-text-secondary text-sm">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}
