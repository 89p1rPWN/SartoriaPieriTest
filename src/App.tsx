import { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll using Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // ===========================
      // HERO ANIMATIONS
      // ===========================
      const heroTl = gsap.timeline();
      
      // Staggered word reveal with slight rotation
      heroTl.from('.hero-word', {
        y: 120,
        opacity: 0,
        rotateX: 40,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.3
      })
      .from('.hero-scatter', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out'
      }, "-=0.6");

      // Hero crossfade timeline: title fades out → philosophy fades in
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // First half: title fades & scales out
      heroScrollTl.to('.hero-text-wrapper', {
        scale: 0.8,
        opacity: 0,
        ease: 'none',
      }, 0);

      // Second half: philosophy fades in
      heroScrollTl.fromTo('.philo-container', {
        opacity: 0,
        y: 60,
      }, {
        opacity: 1,
        y: 0,
        ease: 'none',
      }, 0.35);

      // Stagger the philosophy lines in with scale
      heroScrollTl.from('.philo-line', {
        y: 30,
        opacity: 0,
        stagger: 0.03,
        ease: 'power2.out',
      }, 0.45);

      // Grow the decorative line
      heroScrollTl.from('.philo-line-decor', {
        scaleY: 0,
        transformOrigin: 'top center',
        ease: 'power2.inOut',
      }, 0.4);

      // Hero background kenburns across full scroll
      gsap.to('.hero-bg-image', {
        scale: 1.3,
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // ===========================
      // FOUNDER SECTION
      // ===========================
      // Image reveal: clip-path animation from center outward
      gsap.from('.founder-img-wrapper', {
        clipPath: 'inset(50% 50% 50% 50%)',
        duration: 1.8,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: '.founder-wrapper',
          start: 'top 75%'
        }
      });

      // Founder image inner parallax
      gsap.to('.founder-img-inner', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.founder-wrapper',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Founder text stagger from the right
      gsap.from('.founder-text-block > *', {
        x: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.founder-text-block',
          start: 'top 80%'
        }
      });

      // ===========================
      // PROCESS PANELS — Enhanced
      // ===========================
      const panels = gsap.utils.toArray('.process-panel');
      
      panels.forEach((panel: any, i: number) => {
        // Pin each panel
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          pin: true,
          pinSpacing: false,
          end: 'max'
        });

        // Crossfade — tight range so previous panel fades out quickly
        if (i < panels.length - 1) {
          gsap.to(panel, {
            opacity: 0,
            ease: 'power1.in',
            scrollTrigger: {
              trigger: panels[i + 1] as any,
              start: 'top 80%',
              end: 'top 30%',
              scrub: true
            }
          });
        }

        // Image parallax inside each panel
        const img = panel.querySelector('.process-img');
        if (img) {
          gsap.to(img, {
            yPercent: -15,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        }

        // Giant number counter float
        const num = panel.querySelector('.process-num');
        if (num) {
          gsap.to(num, {
            y: -80,
            opacity: 0.02,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        }

        // Text block slide in
        const textBlock = panel.querySelector('.process-text');
        if (textBlock) {
          gsap.from(textBlock, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 70%'
            }
          });
        }
      });

      // Fade out last panel before footer
      const lastPanel = panels[panels.length - 1];
      if (lastPanel) {
        gsap.to(lastPanel as any, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.collection-wrapper',
            start: 'top bottom',
            end: 'top 50%',
            scrub: true
          }
        });
      }

      // ===========================
      // COLLECTION SECTION
      // ===========================
      // Title and button fade-up
      gsap.utils.toArray('.fade-up').forEach((elem: any) => {
        gsap.from(elem, {
          y: 60,
          opacity: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
          }
        });
      });

      // ---------------------------
      // ATELIER PROCESS SECTION (Horizontal Reel)
      // ---------------------------
      const processTrack = document.querySelector('.process-track') as HTMLElement;
      if (processTrack) {
        const getProcessScrollAmount = () => -(processTrack.scrollWidth - window.innerWidth + 60);
        const processCards = gsap.utils.toArray('.process-card');
        
        const processHorizontalTween = gsap.to(processTrack, {
          x: getProcessScrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-pin',
            start: 'top top',
            end: () => `+=${Math.abs(getProcessScrollAmount())}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          }
        });

        processCards.forEach((card: any) => {
          gsap.timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: processHorizontalTween,
              start: 'left center+=200',
              end: 'right center-=200',
              scrub: true,
            }
          })
          .fromTo(card, {
            rotationY: 70,
            rotationX: 10,
            scale: 0.7,
            opacity: 0.3,
            transformPerspective: 1200,
            transformOrigin: '50% 0%',
          }, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
          })
          .to(card, {
            rotationY: -70,
            rotationX: -10,
            scale: 0.7,
            opacity: 0.3,
            ease: 'none',
          });
        });
      }

      // ---------------------------
      // COLLECTION SECTION (Horizontal Reel)
      // ---------------------------
      const track = document.querySelector('.collection-track') as HTMLElement;
      if (track) {
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 60);
        const cards = gsap.utils.toArray('.collection-card');
        
        // 1. Horizontal movement with ID for syncing
        const horizontalTween = gsap.to(track, {
          x: getScrollAmount,
          ease: 'none',
          id: 'collection-scroll',
          scrollTrigger: {
            trigger: '.collection-pin',
            start: 'top top',
            end: () => `+=${Math.abs(getScrollAmount())}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          }
        });

        // 2. Individual card 'Flipping Swatch' effect
        // Pivot from the top-left to resemble a pinned fabric swatch or design board
        cards.forEach((card: any) => {
          gsap.timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: 'left center+=200',
              end: 'right center-=200',
              scrub: true,
            }
          })
          .fromTo(card, {
            rotationY: 70,
            rotationX: 10,
            scale: 0.7,
            opacity: 0.3,
            transformPerspective: 1200,
            transformOrigin: '50% 0%', // Pivot from top like a hanger
          }, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
          })
          .to(card, {
            rotationY: -70,
            rotationX: -10,
            scale: 0.7,
            opacity: 0.3,
            ease: 'none',
          });
        });
      }

      // ===========================
      // FOOTER REVEAL
      // ===========================
      gsap.from('.footer-content', {
        y: -100,
        scale: 0.92,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.footer-section',
          start: 'top bottom',
          end: 'top 50%',
          scrub: true
        }
      });

      // Footer links stagger
      gsap.from('.footer-link', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer-section',
          start: 'top 60%'
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="text-[#1A1A1A] min-h-screen font-sans selection:bg-black/10 relative">
      
      {/* === GLOBAL UNIFIED BACKGROUND MOODBOARD (LIGHT THEME) === */}
      <div className="fixed inset-0 z-[-1] bg-[#F7F7F7] overflow-hidden">
        {/* Layer 1: Large text annotations — slowest parallax */}
        <div className="moodboard-text absolute inset-[-10%] w-[120%] h-[120%] overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] left-[10%] font-serif italic text-6xl md:text-8xl text-neutral-800 -rotate-6">Tomas Zopieri</div>
            <div className="absolute top-[45%] right-[25%] font-serif italic text-7xl md:text-[10rem] text-zinc-800 rotate-[10deg] whitespace-nowrap">Modartec Studio</div>
            <div className="absolute top-[65%] left-[30%] font-serif text-3xl md:text-6xl text-zinc-800 rotate-[3deg]">"THE FORM FOLLOWS TRAUMA"</div>
            <div className="absolute bottom-[10%] right-[30%] font-sans font-light italic text-5xl text-zinc-900 rotate-[-5deg]">Sartoria Pieri</div>
            <div className="absolute top-[75%] right-[5%] font-serif text-6xl md:text-9xl text-zinc-800 rotate-90 origin-right">VERGOGNA</div>
            <div className="absolute bottom-[35%] left-[15%] font-serif italic text-4xl text-neutral-800 rotate-[45deg]">Volume I.</div>
        </div>

        {/* Layer 2: Technical notes — medium parallax */}
        <div className="moodboard-notes absolute inset-[-10%] w-[120%] h-[120%] overflow-hidden pointer-events-none">
            <div className="absolute bottom-[20%] left-[8%] font-mono text-4xl text-neutral-900 -rotate-90 origin-left">SKETCH_04.2026 // DRAFT</div>
            <div className="absolute top-[10%] right-[15%] font-mono text-2xl text-neutral-800 tracking-[0.5em] mt-10">REF: SP-2481A</div>
            <div className="absolute top-[30%] left-[60%] font-mono text-4xl md:text-6xl text-neutral-900 rotate-90 origin-left tracking-[1em]">CATHARSIS</div>

            <div className="absolute top-[25%] left-[45%] font-mono text-[10px] md:text-xs text-neutral-800 max-w-xs rotate-[2deg]">
              [NOTE: EXTEND THE LAPEL BY 2.4CM]
              <br/>[TENSION ALONG THE SPINE SEAM]
              <br/>[SILK BLEND / HEAVY DROP]
            </div>
            
            <div className="absolute top-[80%] left-[40%] font-mono text-[10px] md:text-xs text-zinc-800 max-w-[200px] -rotate-[12deg]">
              X1: 34.2
              <br/>Y1: 44.9
              <br/>HEM: RAW CUT
            </div>

            <div className="absolute top-[18%] right-[40%] font-mono text-[10px] md:text-xs text-neutral-900 border border-neutral-800 p-2 rotate-[-4deg]">
              FABRIC SOURCING: PENDING
            </div>
        </div>

        {/* Layer 3: SVG mockups — fastest parallax */}
        <div className="moodboard-svg absolute inset-[-10%] w-[120%] h-[120%] overflow-hidden pointer-events-none">
            {/* Central abstracted torso / suit shape */}
            <svg className="absolute top-[25%] left-[18%] w-[300px] md:w-[450px] opacity-[0.8] -rotate-[8deg]" viewBox="0 0 200 300" fill="none" stroke="#27272a" strokeWidth="1">
              <path d="M70,50 Q100,20 130,50 Q160,80 140,150 Q120,220 100,280 Q80,220 60,150 Q40,80 70,50 Z" />
              <path d="M100,20 L100,280" strokeDasharray="4,4" />
              <circle cx="100" cy="80" r="3" fill="#27272a" />
              <circle cx="100" cy="140" r="3" fill="#27272a" />
              <circle cx="100" cy="200" r="3" fill="#27272a" />
              <path d="M50,80 Q20,120 40,200" strokeDasharray="2,2" />
              <path d="M150,80 Q180,120 160,200" strokeDasharray="2,2" />
              <path d="M70,50 L100,100 L130,50" />
            </svg>

            {/* Geometric Drafting Pattern Sheet */}
            <svg className="absolute bottom-[20%] right-[10%] w-[350px] md:w-[500px] opacity-[0.7]" viewBox="0 0 400 400" fill="none" stroke="#27272a" strokeWidth="1">
              <rect x="50" y="50" width="300" height="300" strokeDasharray="4,4" />
              <line x1="50" y1="200" x2="350" y2="200" />
              <line x1="200" y1="50" x2="200" y2="350" />
              <circle cx="200" cy="200" r="120" strokeDasharray="2,8" />
              <path d="M100,100 Q200,200 300,100" />
              <path d="M100,300 Q200,200 300,300" />
              <text x="210" y="190" fontSize="10" fill="#27272a" stroke="none">RADIUS: 120 / CUT</text>
              <text x="60" y="195" fontSize="10" fill="#27272a" stroke="none">A_01</text>
            </svg>

            {/* Thread / Abstract bezier swirls */}
            <svg className="absolute top-[40%] right-[30%] w-[400px] md:w-[600px] opacity-[0.6] rotate-[15deg]" viewBox="0 0 500 500" fill="none" stroke="#262626" strokeWidth="2">
              <path d="M50,250 C 150,50 350,450 450,250 C 350,50 150,450 50,250" />
              <path d="M50,250 C 100,150 400,350 450,250" strokeDasharray="5,10" />
            </svg>

            {/* Scribing / Calligraphic loops */}
            <svg className="absolute bottom-[40%] left-[8%] w-[200px] opacity-[0.8] -rotate-[22deg]" viewBox="0 0 200 100" fill="none" stroke="#27272a" strokeWidth="1.5">
              <path d="M10,50 C 30,-20 80,-20 90,50 C 100,120 150,120 180,50" />
            </svg>
        </div>

        {/* Global SVG Noise Overlay */}
        <svg className="pointer-events-none absolute isolate z-10 opacity-[0.4] mix-blend-multiply inset-0 w-full h-full filter invert">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        {/* Light radial vignette */}
        <div className="absolute inset-0 bg-[#000000]/10 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#E0E0E0_100%)] pointer-events-none"></div>
      </div>
      {/* =========================================== */}


      {/* 1. Hero + Philosophy Section — Two viewports tall */}
      <section className="hero-section relative h-[200vh] w-full bg-[#030303] text-white z-20">
        
        {/* Dynamic Background Layer — sticky for the full 200vh */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-[-1] overflow-hidden bg-[#000]">
            <div className="hero-bg-image absolute inset-[-20%] w-[140%] h-[140%] flex items-center justify-center opacity-40 pointer-events-none grayscale">
              <img 
                src="/images/sartoria/DSC09793.jpg" 
                alt="Sartoria Elements" 
                className="w-full h-full object-cover mix-blend-luminosity filter contrast-[2.5] brightness-50"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#000000_90%)] pointer-events-none"></div>
            <svg className="pointer-events-none absolute isolate z-10 opacity-[0.25] mix-blend-soft-light inset-0 w-full h-full">
              <filter id="noise-dark">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise-dark)" />
            </svg>
          </div>

          {/* Scattered Random Text Annotations */}
          <div className="absolute top-8 left-8 text-[10px] md:text-xs text-white/50 font-mono tracking-widest uppercase flex flex-col gap-1 z-10 mix-blend-difference">
            <span className="hero-scatter">Sartoria Pieri</span>
            <span className="hero-scatter">Creative Dir. T. Zopieri</span>
          </div>

          <div className="absolute top-8 right-8 text-[10px] md:text-xs text-white/50 font-mono tracking-widest text-right uppercase flex flex-col gap-1 z-10 mix-blend-difference">
            <span className="hero-scatter">001.2026</span>
            <span className="hero-scatter">Firenze, Italy</span>
          </div>

          <div className="absolute bottom-12 left-8 text-[10px] md:text-xs text-white/50 font-mono tracking-widest uppercase flex flex-col gap-1 max-w-[200px] md:max-w-xs z-10 mix-blend-difference">
            <span className="hero-scatter">"We do not just dress the body,</span>
            <span className="hero-scatter">we frame the soul."</span>
          </div>

          <div className="absolute bottom-12 right-8 text-[10px] md:text-xs text-white/30 font-mono tracking-widest text-right flex flex-col gap-1 z-10 mix-blend-difference">
            <span className="hero-scatter">74.921.84 // SYSTEM READY</span>
            <span className="hero-scatter">[ SCROLL TO INITIALIZE ]</span>
          </div>

          {/* Center Title — fades out as philosophy appears */}
          <div className="hero-text-wrapper absolute inset-0 z-10 flex flex-col justify-center items-center w-full px-4 mix-blend-difference" style={{ perspective: '800px' }}>
            <h1 className="flex flex-col text-center">
              <span className="hero-word text-[15vw] md:text-[12rem] lg:text-[16rem] font-sans font-black tracking-tighter text-white uppercase leading-[0.8] drop-shadow-2xl">
                SARTORIA
              </span>
              <span className="hero-word text-[15vw] md:text-[12rem] lg:text-[16rem] font-sans font-black tracking-tighter text-[#eaeaea] uppercase leading-[0.8] drop-shadow-2xl">
                PIERI
              </span>
            </h1>
          </div>

          {/* Philosophy — appears as you scroll into the second viewport */}
          <div className="philo-container absolute inset-0 z-20 flex flex-col justify-center items-center text-center opacity-0 px-6">
            <div className="max-w-5xl w-full mx-auto">
              <div className="relative space-y-12 p-8 md:p-16 z-10">
                <span className="philo-label text-xs font-sans tracking-[0.4em] uppercase text-white/50">The Philosophy</span>
                <h2 className="philo-title text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white leading-tight">
                  <div className="overflow-hidden"><span className="philo-line block">Embedding Emotions</span></div>
                  <div className="overflow-hidden"><span className="philo-line block">Into Outfits.</span></div>
                </h2>
                <div className="philo-line-decor w-px h-24 bg-white/20 mx-auto"></div>
                <div className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-4xl mx-auto">
                  <div className="overflow-hidden"><span className="philo-line block">Sartoria Pieri is not simply about clothing;</span></div>
                  <div className="overflow-hidden"><span className="philo-line block">it is about encapsulating the human experience.</span></div>
                  <div className="overflow-hidden"><span className="philo-line block">Every stitch, silhouette, and drape is deliberately</span></div>
                  <div className="overflow-hidden"><span className="philo-line block">crafted to translate unseen internal feelings</span></div>
                  <div className="overflow-hidden"><span className="philo-line block">into tangible, wearable reality.</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Founder Section */}
      <section className="founder-wrapper relative py-32 z-10 bg-transparent">
        <div className="max-w-7xl w-full mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-8 lg:py-16">
            
            <div className="founder-img-wrapper relative h-[60vh] lg:h-[80vh] w-full overflow-hidden group order-2 lg:order-1" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
              <img 
                src="/images/Depravazione/Depravazione.jpg" 
                alt="Tomas Zopieri Art"
                className="founder-img-inner absolute top-[-20%] w-full h-[140%] object-cover opacity-90 contrast-125 grayscale-[0.2]"
              />
              <div className="absolute inset-0 bg-white/10 transition duration-700 group-hover:bg-transparent"></div>
            </div>
            
            <div className="founder-text-block relative space-y-10 order-1 lg:order-2 p-8 lg:p-12 z-10 text-black">
              <div 
                className="absolute inset-[-30%] backdrop-blur-[24px] bg-white/50 -z-10 pointer-events-none"
                style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)', maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)' }}
              ></div>
              <span className="text-xs font-sans tracking-[0.4em] uppercase text-gray-500">The Visionary</span>
              <h2 className="text-5xl md:text-7xl font-serif font-light text-black tracking-tight">
                Tomas Zopieri
              </h2>
              <div className="w-16 h-[2px] bg-black"></div>
              <p className="text-2xl text-gray-800 leading-relaxed font-light">
                Educated at the prestigious <span className="font-semibold italic">Modartec Studio</span>, Tomas has cultivated profound expertise 
                across every realm of fashion design.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                Through meticulous attention to detail and an avant-garde approach to tailoring, Tomas ensures 
                that each piece transcends conventional fashion. His vision bridges the gap between high-end haute couture 
                and psychological art, forging an intimate dialogue between the creator, the garment, and the wearer.
              </p>
              <div className="pt-8">
                 <button className="flex items-center gap-4 text-xs tracking-[0.2em] uppercase text-black hover:text-gray-500 transition-colors w-fit border-b border-black/30 pb-3 group font-bold">
                   Read Full Story <ChevronRight size={16} className="transform transition-transform group-hover:translate-x-2" />
                 </button>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 4. The Atelier Process — Horizontal Lookbook Reel */}
      <section className="process-wrapper relative w-full z-10 bg-transparent overflow-hidden flex flex-col items-center">
        
        {/* Title area */}
        <div className="relative max-w-4xl w-full mx-6 mb-16 text-center p-12 md:p-16 z-10 py-32">
          <div 
            className="absolute inset-[-40%] backdrop-blur-[24px] bg-white/50 -z-10 pointer-events-none"
            style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)', maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)' }}
          ></div>
          <span className="fade-up text-xs font-sans tracking-[0.4em] uppercase text-gray-500 block mb-6">Methodology</span>
          <h2 className="fade-up text-5xl md:text-7xl lg:text-8xl font-serif font-light text-black mb-8">The Atelier</h2>
          <p className="fade-up text-xl text-gray-800 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            From cognitive mapping to the final stitch. A four-phase journey into wearable consciousness.
          </p>
        </div>

        {/* Horizontal scroll — pinned section with 3D reel */}
        <div className="process-pin w-full overflow-hidden min-h-[90vh] flex items-center">
          <div className="process-track flex gap-12 pl-[25vw] pr-[25vw] py-24 will-change-transform" style={{ perspective: '2000px' }}>
            {[
              { 
                num: "01", 
                title: "The Catharsis", 
                desc: "Emotional mapping sessions to define the wearer's psychological foundation.",
                src: "/images/Dolore/SnapInsta.to_557439036_17969503967956293_3160932913129019343_n.jpg",
                tag: "PHASE: ANALYSIS",
                workshop: "COGNITIVE_DEPT"
              },
              { 
                num: "02", 
                title: "The Translation", 
                desc: "Sourcing textiles that act as biological metaphors for internal states.",
                src: "/images/Trauma/SnapInsta.to_552897189_17968571219956293_5767781704309943743_n.jpg",
                tag: "PHASE: MATERIAL",
                workshop: "TEXTILE_LAB"
              },
              { 
                num: "03", 
                title: "The Embodiment", 
                desc: "Hand-tailoring using artisanal techniques to lock emotion into form.",
                src: "/images/Vergogna/SnapInsta.to_556832248_17969316989956293_8195147423866004946_n.jpg",
                tag: "PHASE: CRAFT",
                workshop: "ATELIER_01"
              },
              { 
                num: "04", 
                title: "The Revelation", 
                desc: "The final alignment. The garment becomes a second skin, a wearable truth.",
                src: "/images/Trauma/SnapInsta.to_552278453_17968412891956293_6352945722288339893_n.jpg",
                tag: "PHASE: REVEAL",
                workshop: "SHOWROOM"
              }
            ].map((phase, i) => (
              <div key={i} className="process-card relative w-[75vw] md:w-[40vw] lg:w-[32vw] h-[65vh] shrink-0 group">
                
                {/* Hanger Hook Visual */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-12 flex flex-col items-center opacity-40 group-hover:opacity-80 transition-opacity">
                  <div className="w-1.5 h-6 bg-black rounded-full mb-1"></div>
                  <div className="w-full h-1 bg-black/20 rounded-full"></div>
                </div>

                <div className="w-full h-full bg-[#f9f9f9] shadow-[20px_40px_80px_rgba(0,0,0,0.15)] group-hover:shadow-[20px_40px_100px_rgba(0,0,0,0.25)] transition-shadow duration-700 overflow-hidden border border-black/10 flex flex-col">
                  {/* Phase Number Background */}
                  <h2 className="absolute top-0 left-0 text-[12rem] font-serif font-bold text-black/[0.03] leading-none pointer-events-none">{phase.num}</h2>
                  
                  {/* Technical Tag Overlay */}
                  <div className="absolute top-6 right-6 z-20 mix-blend-difference pointer-events-none">
                    <div className="flex flex-col text-[8px] md:text-[10px] font-mono tracking-tighter text-white/50 border-r border-white/30 pr-2 items-end">
                      <span>{phase.tag}</span>
                      <span>LAB: {phase.workshop}</span>
                      <span>VER: 2026.04</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden relative">
                    <img src={phase.src} className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0" alt={phase.title} />
                  </div>

                  <div className="p-8 md:p-12 bg-white relative z-10 border-t border-black/5">
                    <span className="text-[10px] font-sans tracking-[0.4em] uppercase text-gray-400 block mb-2">Phase {phase.num}</span>
                    <h3 className="text-3xl md:text-4xl font-serif font-light text-black mb-4">{phase.title}</h3>
                    <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                      {phase.desc}
                    </p>
                  </div>
                  
                </div>

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 The Collection Section */}
      <section className="collection-wrapper relative w-full z-10 bg-transparent overflow-hidden flex flex-col items-center">
        
        {/* Title area — not pinned */}
        <div className="relative max-w-4xl w-full mx-6 mb-16 text-center p-12 md:p-16 z-10 py-32">
          <div 
            className="absolute inset-[-40%] backdrop-blur-[24px] bg-white/50 -z-10 pointer-events-none"
            style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)', maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)' }}
          ></div>
          <span className="fade-up text-xs font-sans tracking-[0.4em] uppercase text-gray-500 block mb-6">Archive</span>
          <h2 className="fade-up text-5xl md:text-7xl lg:text-8xl font-serif font-light text-black mb-8">The Collection</h2>
          <p className="fade-up text-xl text-gray-800 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            Explore the full breadth of our conceptual tailoring. Each piece is a solitary study in tension and release.
          </p>
          <button className="fade-up px-8 py-4 bg-black text-white font-sans font-bold tracking-[0.2em] text-xs uppercase hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-[10px_10px_0px_#111]">
            Discover the Collections
          </button>
        </div>

        {/* Horizontal scroll — pinned section with translateX */}
        <div className="collection-pin w-full overflow-hidden min-h-[90vh] flex items-center">
          <div className="collection-track flex gap-12 pl-[20vw] pr-[20vw] py-24 will-change-transform" style={{ perspective: '2000px' }}>
            {[
              { src: "/images/Dolore/SnapInsta.to_557439036_17969503967956293_3160932913129019343_n.jpg", fabric: "Raw Silk Blend" },
              { src: "/images/Vergogna/SnapInsta.to_556832248_17969316989956293_8195147423866004946_n.jpg", fabric: "Heavy Wool Tartan" },
              { src: "/images/Dolore/SnapInsta.to_558249135_17969464229956293_5690768833321361701_n.jpg", fabric: "Distressed Canvas" },
              { src: "/images/Vergogna/SnapInsta.to_557354789_17969241758956293_8274444764858319297_n.jpg", fabric: "Brushed Mohair" },
              { src: "/images/Dolore/SnapInsta.to_558963690_17969464241956293_86024772721168564_n.jpg", fabric: "Technical Nylon" },
              { src: "/images/Vergogna/SnapInsta.to_557416702_17969241773956293_8398165058072610666_n.jpg", fabric: "Linen Gauze" }
            ].map((item, i) => (
              <div key={i} className="collection-card relative w-[75vw] md:w-[35vw] lg:w-[24vw] h-[55vh] shrink-0 group">
                
                {/* Hanger Hook Visual */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-12 flex flex-col items-center opacity-40 group-hover:opacity-80 transition-opacity">
                  <div className="w-1.5 h-6 bg-black rounded-full mb-1"></div>
                  <div className="w-full h-1 bg-black/20 rounded-full"></div>
                </div>

                <div className="w-full h-full bg-[#111] shadow-[20px_40px_80px_rgba(0,0,0,0.3)] group-hover:shadow-[20px_40px_100px_rgba(0,0,0,0.5)] transition-shadow duration-700 overflow-hidden border border-black/10 flex flex-col">
                  {/* Technical Tag Overlay */}
                  <div className="absolute top-6 right-6 z-20 mix-blend-difference pointer-events-none">
                    <div className="flex flex-col text-[8px] md:text-[10px] font-mono tracking-tighter text-white/50 border-r border-white/30 pr-2 items-end">
                      <span>LOOK_0{i+1}</span>
                      <span>FABRIC: {item.fabric}</span>
                      <span>REF: SP2026.V1</span>
                    </div>
                  </div>

                  <img src={item.src} className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0" alt={`Collection look ${i+1}`} />
                  
                  {/* Subtle border overlay */}
                  <div className="absolute inset-0 border-[1.5rem] border-transparent group-hover:border-black/5 transition-all duration-700 pointer-events-none"></div>
                </div>

                {/* Card Shadow Shadow (separate for 3D depth) */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact/Footer Section */}
      <section className="footer-section h-[80vh] w-full flex flex-col items-center justify-center bg-white/70 backdrop-blur-[40px] border-t border-white/50 relative z-10 rounded-t-[4rem] text-black">
        <div className="footer-content text-center px-6 w-full max-w-4xl">
          <span className="text-xs font-sans tracking-[0.4em] uppercase text-gray-500 mb-12 block drop-shadow-sm">Inquiries</span>
          <h2 className="text-[3rem] md:text-[5rem] lg:text-[6rem] font-serif font-light mb-16 tracking-tight leading-none text-black drop-shadow-sm">
            Tailor Your Emotion.
          </h2>
          <button className="px-14 py-6 bg-black text-white font-sans font-bold tracking-[0.2em] text-xs uppercase hover:bg-gray-800 hover:scale-105 transition-all duration-500 rounded-full shadow-2xl">
            Book an Appointment
          </button>
        </div>
        <footer className="absolute bottom-12 w-full flex flex-col md:flex-row justify-between items-center px-12 text-[10px] text-gray-500 font-sans tracking-widest uppercase gap-6 md:gap-0">
          <span className="footer-link">© 2026 Sartoria Pieri</span>
          <div className="flex gap-8">
            <a href="#" className="footer-link hover:text-black transition-colors font-bold">Instagram</a>
            <a href="#" className="footer-link hover:text-black transition-colors font-bold">Journal</a>
            <a href="#" className="footer-link hover:text-black transition-colors font-bold">Atelier</a>
          </div>
        </footer>
      </section>

    </div>
  );
}
