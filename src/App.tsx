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

      // Hero parallax zoom-out on scroll — text scales down, image zooms out
      gsap.to('.hero-text-wrapper', {
        scale: 0.85,
        y: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Hero background image kenburns on scroll
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
      // MULTI-LAYER MOODBOARD PARALLAX
      // ===========================
      // Text layer — slowest
      gsap.to('.moodboard-text', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      // SVG layer — medium speed
      gsap.to('.moodboard-svg', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      // Notes / technical layer — fastest
      gsap.to('.moodboard-notes', {
        yPercent: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      // ===========================
      // PHILOSOPHY SECTION
      // ===========================
      // Title slides in from the left
      gsap.from('.philo-title', {
        x: -120,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.philo-container',
          start: 'top 80%'
        }
      });

      // Decorative vertical line grows
      gsap.from('.philo-line-decor', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.philo-container',
          start: 'top 75%'
        }
      });

      // Split text reveal for Philosophy paragraphs — staggered from bottom
      gsap.from('.philo-line', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.philo-container',
          start: 'top 70%'
        }
      });

      // Parallax drift on philosophy label
      gsap.to('.philo-label', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.philo-container',
          start: 'top bottom',
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

        // Crossfade between panels
        if (i < panels.length - 1) {
          gsap.to(panel, {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: panels[i + 1] as any,
              start: 'top bottom',
              end: 'top top',
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
            trigger: '.footer-section',
            start: 'top bottom',
            end: 'top center',
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

      // GSAP-driven horizontal scroll for collection
      const scrollContainer = document.querySelector('.collection-scroll');
      if (scrollContainer) {
        const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        gsap.to(scrollContainer, {
          scrollLeft: scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: '.collection-wrapper',
            start: 'top 20%',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
          }
        });
      }

      // Scale-in for each collection card as they come into view
      gsap.utils.toArray('.collection-card').forEach((card: any, i: number) => {
        gsap.from(card, {
          scale: 0.85,
          opacity: 0,
          rotateY: 8,
          duration: 0.8,
          ease: 'power2.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: '.collection-wrapper',
            start: 'top 75%',
          }
        });
      });

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


      {/* 1. Hero Section */}
      <section className="hero-section relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#030303] text-white z-20">
        
        {/* Dynamic Background Layer for Hero */}
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

        {/* Center Stark Typography */}
        <div className="hero-text-wrapper z-10 flex flex-col justify-center items-center relative w-full px-4 mix-blend-difference" style={{ perspective: '800px' }}>
          <h1 className="flex flex-col text-center">
            <span className="hero-word text-[15vw] md:text-[12rem] lg:text-[16rem] font-sans font-black tracking-tighter text-white uppercase leading-[0.8] drop-shadow-2xl">
              SARTORIA
            </span>
            <span className="hero-word text-[15vw] md:text-[12rem] lg:text-[16rem] font-sans font-black tracking-tighter text-[#eaeaea] uppercase leading-[0.8] drop-shadow-2xl">
              PIERI
            </span>
          </h1>
        </div>
      </section>

      {/* 2. Philosophy Section */}
      <section className="philo-container relative py-40 flex flex-col items-center text-center z-10 bg-transparent">
        <div className="max-w-5xl w-full mx-auto px-6 py-24">
          <div className="relative space-y-16 p-8 md:p-16 z-10">
            <div 
              className="absolute inset-[-40%] backdrop-blur-[24px] bg-white/50 -z-10 pointer-events-none"
              style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)', maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)' }}
            ></div>
            <span className="philo-label fade-up text-xs font-sans tracking-[0.4em] uppercase text-gray-500">The Philosophy</span>
            <h2 className="philo-title text-4xl md:text-6xl lg:text-7xl font-serif font-light text-black leading-tight">
              <div className="overflow-hidden"><span className="philo-line block">Embedding Emotions</span></div>
              <div className="overflow-hidden"><span className="philo-line block">Into Outfits.</span></div>
            </h2>
            <div className="philo-line-decor w-px h-24 bg-black/20 mx-auto"></div>
            <div className="text-xl md:text-3xl text-[#333] font-light leading-relaxed max-w-4xl mx-auto">
              <div className="overflow-hidden"><span className="philo-line block">Sartoria Pieri is not simply about clothing;</span></div>
              <div className="overflow-hidden"><span className="philo-line block">it is about encapsulating the human experience.</span></div>
              <div className="overflow-hidden"><span className="philo-line block">Every stitch, silhouette, and drape is deliberately</span></div>
              <div className="overflow-hidden"><span className="philo-line block">crafted to translate unseen internal feelings</span></div>
              <div className="overflow-hidden"><span className="philo-line block">into tangible, wearable reality.</span></div>
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

      {/* 4. The Atelier Process */}
      <section className="relative w-full z-10 bg-transparent mb-40">
        
        {/* Layer 1: Consultation */}
        <div className="process-panel h-screen w-full relative flex items-center justify-center bg-transparent py-12">
          <div className="max-w-6xl w-full mx-6 flex flex-col md:flex-row gap-12 lg:gap-24 items-center relative py-10 lg:py-16">
            <h2 className="process-num text-[14rem] lg:text-[22rem] font-serif font-bold text-black/[0.04] absolute -top-16 lg:-top-32 -left-10 lg:-left-16 pointer-events-none select-none">01</h2>
            <div className="process-text relative w-full md:w-1/2 z-10 text-black p-8 md:p-12">
              <div 
                className="absolute inset-[-30%] backdrop-blur-[24px] bg-white/50 -z-10 pointer-events-none"
                style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)', maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)' }}
              ></div>
              <span className="text-xs font-sans tracking-[0.4em] uppercase text-gray-500 block mb-6">Phase 01</span>
              <h3 className="text-5xl md:text-7xl font-serif font-light text-black mb-8">The Catharsis</h3>
              <p className="text-xl text-gray-800 font-light leading-relaxed">
                Before the needle threads, we sit. Understanding the emotional landscape of the client is paramount. We draw from vulnerabilities, experiences, and unsaid stories to form the foundational blueprint.
              </p>
            </div>
            <div className="w-full md:w-1/2 h-[45vh] lg:h-[60vh] overflow-hidden z-10 shadow-[20px_20px_0px_#111]">
               <img src="/images/Dolore/SnapInsta.to_557439036_17969503967956293_3160932913129019343_n.jpg" className="process-img w-full h-full object-cover grayscale-[0.3] contrast-[1.1]" alt="Phase 1" />
            </div>
          </div>
        </div>

        {/* Layer 2: Material Sourcing */}
        <div className="process-panel h-screen w-full relative flex items-center justify-center bg-transparent py-12">
          <div className="max-w-6xl w-full mx-6 flex flex-col md:flex-row-reverse gap-12 lg:gap-24 items-center relative py-10 lg:py-16">
            <h2 className="process-num text-[14rem] lg:text-[22rem] font-serif font-bold text-black/[0.04] absolute -bottom-16 lg:-bottom-32 -right-10 lg:-right-16 pointer-events-none select-none">02</h2>
            <div className="process-text relative w-full md:w-1/2 z-10 text-black p-8 md:p-12">
              <div 
                className="absolute inset-[-30%] backdrop-blur-[24px] bg-white/50 -z-10 pointer-events-none"
                style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)', maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)' }}
              ></div>
              <span className="text-xs font-sans tracking-[0.4em] uppercase text-gray-500 block mb-6">Phase 02</span>
              <h3 className="text-5xl md:text-7xl font-serif font-light text-black mb-8">The Translation</h3>
              <p className="text-xl text-gray-800 font-light leading-relaxed">
                Sourcing materials that mirror the psyche. Heavy wools for protection. Sheer silks for exposure. Torn weaves for the scars. The fabric itself is chosen as an actor to play the emotion.
              </p>
            </div>
            <div className="w-full md:w-1/2 h-[45vh] lg:h-[60vh] overflow-hidden z-10 shadow-[-20px_20px_0px_#111]">
               <img src="/images/Trauma/SnapInsta.to_552897189_17968571219956293_5767781704309943743_n.jpg" className="process-img w-full h-full object-cover grayscale-[0.3] contrast-[1.1]" alt="Phase 2" />
            </div>
          </div>
        </div>

        {/* Layer 3: Crafting */}
        <div className="process-panel h-screen w-full relative flex items-center justify-center bg-transparent py-12">
          <div className="max-w-6xl w-full mx-6 flex flex-col md:flex-row gap-12 lg:gap-24 items-center relative py-10 lg:py-16">
            <h2 className="process-num text-[14rem] lg:text-[22rem] font-serif font-bold text-black/[0.04] absolute -top-16 lg:-top-32 -left-10 lg:-left-16 pointer-events-none select-none">03</h2>
            <div className="process-text relative w-full md:w-1/2 z-10 text-black p-8 md:p-12">
              <div 
                className="absolute inset-[-30%] backdrop-blur-[24px] bg-white/50 -z-10 pointer-events-none"
                style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)', maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 50%)' }}
              ></div>
              <span className="text-xs font-sans tracking-[0.4em] uppercase text-gray-500 block mb-6">Phase 03</span>
              <h3 className="text-5xl md:text-7xl font-serif font-light text-black mb-8">The Embodiment</h3>
              <p className="text-xl text-gray-800 font-light leading-relaxed">
                The atelier becomes a sanctuary. Precision tailoring merges with chaotic expression. Tomas and his artisans craft the piece entirely by hand, immortalizing the emotion perfectly tailored to the client's soul.
              </p>
              <div className="pt-8">
               <button className="flex items-center gap-4 text-xs tracking-[0.2em] uppercase text-black hover:text-gray-500 transition-colors w-fit border-b border-black/30 pb-3 group font-bold">
                 Explore The Atelier <ChevronRight size={16} className="transform transition-transform group-hover:translate-x-2" />
               </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-[45vh] lg:h-[60vh] overflow-hidden z-10 shadow-[20px_20px_0px_#111]">
               <img src="/images/Vergogna/SnapInsta.to_556832248_17969316989956293_8195147423866004946_n.jpg" className="process-img w-full h-full object-cover grayscale-[0.3] contrast-[1.1]" alt="Phase 3" />
            </div>
          </div>
        </div>

      </section>

      {/* 4.5 The Collection Section */}
      <section className="collection-wrapper relative w-full z-10 bg-transparent py-32 overflow-hidden flex flex-col items-center">
        <style>{`
          .hide-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="relative max-w-4xl w-full mx-6 mb-16 text-center p-12 md:p-16 z-10">
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

        {/* Horizontal Carousel — GSAP scroll-linked */}
        <div className="w-full relative mt-12 fade-up">
          <div className="collection-scroll flex overflow-x-auto gap-8 px-6 pb-12 snap-x snap-mandatory hide-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              "/images/Dolore/SnapInsta.to_557439036_17969503967956293_3160932913129019343_n.jpg",
              "/images/Vergogna/SnapInsta.to_556832248_17969316989956293_8195147423866004946_n.jpg",
              "/images/Dolore/SnapInsta.to_558249135_17969464229956293_5690768833321361701_n.jpg",
              "/images/Vergogna/SnapInsta.to_557354789_17969241758956293_8274444764858319297_n.jpg",
              "/images/Dolore/SnapInsta.to_558963690_17969464241956293_86024772721168564_n.jpg",
              "/images/Vergogna/SnapInsta.to_557416702_17969241773956293_8398165058072610666_n.jpg"
            ].map((src, i) => (
              <div key={i} className="collection-card min-w-[80vw] md:min-w-[40vw] lg:min-w-[28vw] h-[60vh] shrink-0 snap-center shadow-[15px_15px_0px_#111] group overflow-hidden border border-black/10">
                <img src={src} className="w-full h-full object-cover grayscale-[0.3] contrast-[1.1] transform transition-transform duration-1000 group-hover:scale-105" alt={`Collection outfit ${i}`} />
              </div>
            ))}
            <div className="min-w-[10vw] shrink-0"></div>
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
