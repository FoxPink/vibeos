import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Gauge, Cpu, Wifi } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Performance() {
  const sectionRef = useRef<HTMLElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const statusChipRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const rightCard = rightCardRef.current;
    const leftCard = leftCardRef.current;
    const statusChip = statusChipRef.current;
    const portrait = portraitRef.current;

    if (!section || !rightCard || !leftCard || !statusChip || !portrait) return;

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
      scrollTl.fromTo(rightCard,
        { x: '55vw', rotateY: -16, opacity: 0 },
        { x: 0, rotateY: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(leftCard,
        { x: '-55vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(statusChip,
        { y: '-12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(portrait,
        { scale: 1.06, opacity: 0 },
        { scale: 1, opacity: 0.55, ease: 'none' },
        0
      );

      // SETTLE (30% - 70%): Hold position

      // EXIT (70% - 100%)
      scrollTl.fromTo(rightCard,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(leftCard,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(statusChip,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
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
      className="relative w-full h-screen overflow-hidden z-50"
      style={{ backgroundColor: '#070A12' }}
    >
      {/* Background Portrait */}
      <div
        ref={portraitRef}
        className="absolute left-0 top-0 w-1/2 h-full pointer-events-none"
      >
        <img
          src="/portrait-left.jpg"
          alt="Performance visualization"
          className="w-full h-full object-cover object-center"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(270deg, #070A12 0%, transparent 30%, transparent 100%)'
          }}
        />
      </div>

      {/* Status Chip */}
      <div
        ref={statusChipRef}
        className="absolute glass-card-sm px-4 py-2.5 flex items-center gap-2"
        style={{ left: '7vw', top: '14vh' }}
      >
        <Gauge className="w-4 h-4 text-vibe-cyan" />
        <span className="text-sm text-vibe-text font-medium">Performance mode</span>
        <span className="w-2 h-2 rounded-full bg-vibe-cyan blink-dot ml-1" />
      </div>

      {/* Right Tall Card */}
      <div
        ref={rightCardRef}
        className="absolute glass-card glow-cyan p-8 md:p-10"
        style={{
          right: '7vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40vw',
          height: '72vh',
          maxWidth: '560px',
        }}
      >
        <div className="h-full flex flex-col justify-center">
          <div className="w-14 h-14 rounded-2xl bg-vibe-cyan/20 flex items-center justify-center mb-6">
            <Zap className="w-7 h-7 text-vibe-cyan" />
          </div>
          
          <h2 
            className="font-heading font-bold text-vibe-text mb-6"
            style={{ fontSize: 'clamp(28px, 3vw, 48px)', lineHeight: 1.1 }}
          >
            Zero lag. Pure flow.
          </h2>
          
          <p className="text-vibe-text-secondary text-lg leading-relaxed mb-8">
            Instant open. Silky transitions. Designed to feel like a native app—without the installation.
          </p>

          {/* Performance metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card-sm p-4">
              <div className="text-2xl font-heading font-bold text-vibe-cyan mb-1">&lt;100ms</div>
              <div className="text-sm text-vibe-text-secondary">Load time</div>
            </div>
            <div className="glass-card-sm p-4">
              <div className="text-2xl font-heading font-bold text-vibe-cyan mb-1">60fps</div>
              <div className="text-sm text-vibe-text-secondary">Animations</div>
            </div>
            <div className="glass-card-sm p-4">
              <div className="text-2xl font-heading font-bold text-vibe-cyan mb-1">&lt;50KB</div>
              <div className="text-sm text-vibe-text-secondary">Bundle size</div>
            </div>
            <div className="glass-card-sm p-4">
              <div className="text-2xl font-heading font-bold text-vibe-cyan mb-1">Edge</div>
              <div className="text-sm text-vibe-text-secondary">Deployed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Bottom Card */}
      <div
        ref={leftCardRef}
        className="absolute glass-card-sm p-6"
        style={{
          left: '7vw',
          bottom: '10vh',
          width: '38vw',
          height: '34vh',
          maxWidth: '520px',
        }}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-vibe-cyan/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-vibe-cyan" />
            </div>
            <span className="font-heading font-semibold text-vibe-text text-lg">Optimized for creators</span>
          </div>

          <p className="text-vibe-text-secondary leading-relaxed flex-1">
            Built on Puter.js with edge deployment. No backend to maintain. 
            No servers to scale. Just pure performance.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-vibe-cyan" />
              <span className="text-sm text-vibe-text-secondary">Cloud sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-vibe-cyan" />
              <span className="text-sm text-vibe-text-secondary">Instant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
