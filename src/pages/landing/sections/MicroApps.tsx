import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, CheckSquare, MessageSquare, ArrowRight, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const appCards = [
  { icon: FileText, title: 'Notes', color: 'bg-vibe-cyan/20', desc: 'Capture ideas instantly' },
  { icon: CheckSquare, title: 'Tasks', color: 'bg-white/5', desc: 'Track what matters' },
  { icon: MessageSquare, title: 'Captions', color: 'bg-white/5', desc: 'AI-powered content' },
];

export default function MicroApps() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineCardRef = useRef<HTMLDivElement>(null);
  const appCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const chipTopRef = useRef<HTMLDivElement>(null);
  const chipBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headlineCard = headlineCardRef.current;
    const appCardsList = appCardsRef.current.filter(Boolean);
    const chipTop = chipTopRef.current;
    const chipBottom = chipBottomRef.current;

    if (!section || !headlineCard || appCardsList.length === 0) return;

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
      scrollTl.fromTo(headlineCard,
        { x: '-55vw', rotateY: 18, opacity: 0 },
        { x: 0, rotateY: 0, opacity: 1, ease: 'none' },
        0
      );

      appCardsList.forEach((card, index) => {
        scrollTl.fromTo(card,
          { x: '55vw', rotateY: -14, opacity: 0 },
          { x: 0, rotateY: 0, opacity: 1, ease: 'none' },
          index * 0.03
        );
      });

      scrollTl.fromTo(chipTop,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(chipBottom,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0.15
      );

      // SETTLE (30% - 70%): Elements hold position

      // EXIT (70% - 100%)
      scrollTl.fromTo(headlineCard,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      appCardsList.forEach((card, index) => {
        scrollTl.fromTo(card,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7 + index * 0.02
        );
      });

      scrollTl.fromTo([chipTop, chipBottom],
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden z-30"
      style={{ backgroundColor: '#070A12' }}
    >
      {/* Subtle city silhouette at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 opacity-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(46,233,255,0.1) 0%, transparent 100%)'
        }}
      />

      {/* Left Headline Card */}
      <div
        ref={headlineCardRef}
        className="absolute glass-card glow-cyan p-8 md:p-12"
        style={{
          left: '7vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '42vw',
          height: '62vh',
          maxWidth: '600px',
        }}
      >
        <div className="h-full flex flex-col justify-center">
          <div className="w-14 h-14 rounded-2xl bg-vibe-cyan/20 flex items-center justify-center mb-6">
            <Layers className="w-7 h-7 text-vibe-cyan" />
          </div>
          
          <h2 
            className="font-heading font-bold text-vibe-text mb-6"
            style={{ fontSize: 'clamp(28px, 3vw, 48px)', lineHeight: 1.1 }}
          >
            Build your own OS.
          </h2>
          
          <p className="text-vibe-text-secondary text-lg leading-relaxed mb-8">
            Drop in micro-apps for notes, tasks, captions, and content. 
            Rearrange like blocks. Work like a pro.
          </p>
          
          <button className="btn-primary w-fit flex items-center gap-2">
            Explore modules
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Stack of App Cards */}
      <div
        className="absolute flex flex-col gap-4"
        style={{
          left: '56vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '34vw',
          maxWidth: '480px',
        }}
      >
        {appCards.map((app, index) => (
          <div
            key={index}
            ref={el => { appCardsRef.current[index] = el; }}
            className="glass-card-sm p-5 flex items-center gap-4 group hover:border-vibe-cyan/30 transition-all duration-300"
            style={{ height: '18vh', minHeight: '120px' }}
          >
            <div className={`w-14 h-14 rounded-xl ${app.color} flex items-center justify-center flex-shrink-0 group-hover:bg-vibe-cyan/20 transition-colors`}>
              <app.icon className="w-6 h-6 text-vibe-cyan" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-vibe-text text-xl mb-1">
                {app.title}
              </h3>
              <p className="text-vibe-text-secondary text-sm">
                {app.desc}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-vibe-text-secondary ml-auto opacity-0 group-hover:opacity-100 group-hover:text-vibe-cyan transition-all" />
          </div>
        ))}
      </div>

      {/* Widget Chips */}
      <div
        ref={chipTopRef}
        className="absolute glass-card-sm px-4 py-2 flex items-center gap-2 float-animation"
        style={{ left: '44vw', top: '18%' }}
      >
        <div className="w-2 h-2 rounded-full bg-vibe-cyan" />
        <span className="text-sm text-vibe-text-secondary">Drag to rearrange</span>
      </div>

      <div
        ref={chipBottomRef}
        className="absolute glass-card-sm px-4 py-2 flex items-center gap-2 float-animation"
        style={{ left: '10vw', top: '76%', animationDelay: '2s' }}
      >
        <Layers className="w-4 h-4 text-vibe-cyan" />
        <span className="text-sm text-vibe-text-secondary">Modular system</span>
      </div>
    </section>
  );
}
