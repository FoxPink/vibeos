import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AIContext() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const inputChipRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;
    const inputChip = inputChipRef.current;
    const portrait = portraitRef.current;

    if (!section || !leftCard || !rightCard || !inputChip || !portrait) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.7,
        }
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(leftCard,
        { y: '80vh', rotateX: 10, opacity: 0 },
        { y: 0, rotateX: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(rightCard,
        { y: '60vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(inputChip,
        { x: '20vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(portrait,
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 0.55, ease: 'none' },
        0
      );

      // SETTLE (30% - 70%): Hold position

      // EXIT (70% - 100%)
      scrollTl.fromTo(leftCard,
        { y: 0, opacity: 1 },
        { y: '-18vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(rightCard,
        { y: 0, opacity: 1 },
        { y: '18vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(inputChip,
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0, ease: 'power2.in' },
        0.75
      );

      scrollTl.fromTo(portrait,
        { opacity: 0.55 },
        { opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden z-40"
      style={{ backgroundColor: '#070A12' }}
    >
      {/* Background Portrait */}
      <div
        ref={portraitRef}
        className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
      >
        <img
          src="/portrait-right.jpg"
          alt="AI visualization"
          className="w-full h-full object-cover object-center"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, #070A12 0%, transparent 30%, transparent 100%)'
          }}
        />
      </div>

      {/* Left Tall Card */}
      <div
        ref={leftCardRef}
        className="absolute glass-card glow-cyan p-8 md:p-10"
        style={{
          left: '7vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40vw',
          height: '72vh',
          maxWidth: '560px',
        }}
      >
        <div className="h-full flex flex-col justify-center">
          <div className="w-14 h-14 rounded-2xl bg-vibe-cyan/20 flex items-center justify-center mb-6">
            <Brain className="w-7 h-7 text-vibe-cyan" />
          </div>
          
          <h2 
            className="font-heading font-bold text-vibe-text mb-6"
            style={{ fontSize: 'clamp(28px, 3vw, 48px)', lineHeight: 1.1 }}
          >
            It knows what you're building.
          </h2>
          
          <p className="text-vibe-text-secondary text-lg leading-relaxed">
            Ask about your notes, your next task, or your next post. 
            VibeOS answers with context—not generic guesses.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-vibe-cyan/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-vibe-cyan" />
            </div>
            <span className="text-vibe-text">Powered by advanced AI</span>
          </div>
        </div>
      </div>

      {/* Input Chip */}
      <div
        ref={inputChipRef}
        className="absolute glass-card-sm px-5 py-3 flex items-center gap-3"
        style={{ right: '7vw', top: '14vh', width: '280px' }}
      >
        <div className="w-2 h-2 rounded-full bg-vibe-cyan animate-pulse" />
        <span className="text-vibe-text text-sm">What should I work on next?</span>
      </div>

      {/* Right Bottom Card - AI Response */}
      <div
        ref={rightCardRef}
        className="absolute glass-card-sm p-6"
        style={{
          right: '7vw',
          bottom: '10vh',
          width: '38vw',
          height: '34vh',
          maxWidth: '520px',
        }}
      >
        {/* Cyan glow inset */}
        <div 
          className="absolute inset-0 rounded-[22px] pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px rgba(46,233,255,0.1)'
          }}
        />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-vibe-cyan/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-vibe-cyan" />
            </div>
            <span className="text-vibe-cyan text-sm font-medium">VibeOS AI</span>
          </div>

          <p className="text-vibe-text leading-relaxed flex-1">
            Based on your draft <span className="text-vibe-cyan">'Launch Plan,'</span> the next step 
            is to finalize the hero image. Want me to suggest captions?
          </p>

          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 rounded-lg bg-vibe-cyan/20 text-vibe-cyan text-sm font-medium hover:bg-vibe-cyan/30 transition-colors">
              Yes, please
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/5 text-vibe-text-secondary text-sm hover:bg-white/10 transition-colors">
              Show tasks
            </button>
          </div>

          {/* Pulsing underline */}
          <div className="mt-4 h-0.5 bg-gradient-to-r from-vibe-cyan/60 to-transparent rounded-full pulse-glow" />
        </div>
      </div>
    </section>
  );
}
