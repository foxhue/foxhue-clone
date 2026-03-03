/* ============================================
   FOXHUE CLONE - INTERACTIONS
   Lenis smooth scroll, clip-masked text reveals,
   stacking cards, floating badges, button hovers,
   menu character stagger
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // LENIS SMOOTH SCROLL
  // ============================================
  const lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // ============================================
  // SPLIT TEXT - character-by-character animation
  // ============================================
  function splitTextIntoChars(el) {
    const text = el.textContent;
    el.innerHTML = '';
    el.style.overflow = 'clip';
    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline-flex';
    wrapper.style.flexWrap = 'wrap';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.classList.add('split-char');
      wrapper.appendChild(span);
    });
    el.appendChild(wrapper);
    return wrapper.querySelectorAll('.split-char');
  }

  function splitWordsIntoChars(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = '';
    const allChars = [];
    words.forEach((word, wi) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'clip';
      wordSpan.style.verticalAlign = 'bottom';
      word.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        charSpan.classList.add('split-char');
        wordSpan.appendChild(charSpan);
        allChars.push(charSpan);
      });
      el.appendChild(wordSpan);
      if (wi < words.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.display = 'inline-block';
        el.appendChild(space);
      }
    });
    return allChars;
  }

  // ============================================
  // PRELOADER
  // ============================================
  const preloader = document.getElementById('preloader');
  let animationsInitialized = false;

  function hidePreloader() {
    if (animationsInitialized) return;
    animationsInitialized = true;
    preloader.classList.add('hidden');
    lenis.start();
    requestAnimationFrame(() => {
      initAnimations();
    });
  }

  // Stop lenis during preloader
  lenis.stop();
  window.addEventListener('load', () => setTimeout(hidePreloader, 1200));
  setTimeout(hidePreloader, 2500);

  // ============================================
  // MOBILE MENU — character stagger
  // ============================================
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

  // Pre-split mobile link text into chars
  const mobileLinkChars = [];
  mobileLinks.forEach(link => {
    const chars = splitTextIntoChars(link);
    mobileLinkChars.push(chars);
    // Set initial state — hidden
    gsap.set(chars, { y: '100%' });
  });

  let menuOpen = false;

  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuBtn.classList.toggle('active', menuOpen);

    if (menuOpen) {
      mobileMenu.classList.add('open');
      lenis.stop();
      // Stagger chars in per link
      mobileLinkChars.forEach((chars, i) => {
        gsap.fromTo(chars,
          { y: '100%' },
          { y: '0%', duration: 0.5, stagger: 0.02, delay: 0.1 + i * 0.08, ease: 'power3.out' }
        );
      });
    } else {
      // Reverse animation then close
      mobileLinkChars.forEach((chars) => {
        gsap.to(chars, { y: '100%', duration: 0.3, stagger: 0.01, ease: 'power3.in' });
      });
      gsap.delayedCall(0.5, () => {
        mobileMenu.classList.remove('open');
        lenis.start();
      });
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (!menuOpen) return;
      menuOpen = false;
      menuBtn.classList.remove('active');
      mobileLinkChars.forEach((chars) => {
        gsap.to(chars, { y: '100%', duration: 0.3, stagger: 0.01, ease: 'power3.in' });
      });
      gsap.delayedCall(0.5, () => {
        mobileMenu.classList.remove('open');
        lenis.start();
        // Smooth scroll to target via Lenis
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target);
        }
      });
    });
  });

  // ============================================
  // SMOOTH SCROLL — via Lenis
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip mobile links — handled above
    if (anchor.classList.contains('mobile-link')) return;
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target);
      }
    });
  });

  // ============================================
  // MAIN ANIMATIONS
  // ============================================
  function initAnimations() {

    // === HERO - Clip-masked character reveals (no opacity) ===

    document.querySelectorAll('.hero-title-line').forEach((line, i) => {
      const chars = splitTextIntoChars(line);
      gsap.from(chars, {
        y: '100%',
        duration: 0.6,
        stagger: 0.03,
        delay: 0.2 + (i * 0.2),
        ease: 'power3.out',
      });
    });

    document.querySelectorAll('.hero-subtitle span').forEach((span, i) => {
      const chars = splitTextIntoChars(span);
      gsap.from(chars, {
        y: '100%',
        duration: 0.5,
        stagger: 0.02,
        delay: 0.8 + (i * 0.15),
        ease: 'power3.out',
      });
    });

    const descChars = splitWordsIntoChars(document.querySelector('.hero-description'));
    gsap.from(descChars, {
      y: '100%',
      duration: 0.4,
      stagger: 0.01,
      delay: 1.3,
      ease: 'power3.out',
    });

    gsap.from('.hero-meta', {
      y: 20, opacity: 0, duration: 0.8, delay: 1.6, ease: 'power3.out',
    });

    // === ABOUT SECTION ===

    gsap.fromTo('.section-label',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.section-label', start: 'top 90%', toggleActions: 'play none none none' }
      }
    );

    const aboutHeading = document.querySelector('.about-heading');
    if (aboutHeading) {
      const aboutChars = splitWordsIntoChars(aboutHeading);
      gsap.from(aboutChars, {
        y: '100%',
        duration: 0.5,
        stagger: 0.015,
        ease: 'power3.out',
        scrollTrigger: { trigger: aboutHeading, start: 'top 80%', toggleActions: 'play none none none' }
      });
    }

    gsap.fromTo('.about-top .btn-outline',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-top .btn-outline', start: 'top 90%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.about-shape',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.9, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.about-graphic', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    // === TIMELINE — Scroll-driven horizontal translation ===
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    const timelineTrack = document.querySelector('.timeline-track');
    if (timelineWrapper && timelineTrack) {
      gsap.to(timelineWrapper, {
        x: () => -(timelineWrapper.scrollWidth - window.innerWidth + 120),
        ease: 'none',
        scrollTrigger: {
          trigger: timelineTrack,
          start: 'top 80px',
          end: 'bottom bottom',
          scrub: true,
          pin: false,
          invalidateOnRefresh: true,
        }
      });
    }

    // === PROCESS SECTION ===

    const processTitle = document.querySelector('.process-title');
    if (processTitle) {
      const processChars = splitWordsIntoChars(processTitle);
      gsap.from(processChars, {
        y: '100%',
        duration: 0.5,
        stagger: 0.015,
        ease: 'power3.out',
        scrollTrigger: { trigger: processTitle, start: 'top 85%', toggleActions: 'play none none none' }
      });
    }

    const processSub = document.querySelector('.process-subtitle');
    if (processSub) {
      const subChars = splitWordsIntoChars(processSub);
      gsap.from(subChars, {
        y: '100%',
        duration: 0.4,
        stagger: 0.01,
        ease: 'power3.out',
        scrollTrigger: { trigger: processSub, start: 'top 90%', toggleActions: 'play none none none' }
      });
    }

    gsap.fromTo('.process-step',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.process-steps', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );

    // === FEATURED WORKS — Stacking card effect ===

    const worksTitle = document.querySelector('.works-title');
    if (worksTitle) {
      const worksChars = splitWordsIntoChars(worksTitle);
      gsap.from(worksChars, {
        y: '100%',
        duration: 0.5,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: worksTitle, start: 'top 85%', toggleActions: 'play none none none' }
      });
    }

    // Stacking cards — each card pins, scales down, and offsets vertically
    const workCards = document.querySelectorAll('.work-card');
    const total = workCards.length;
    workCards.forEach((card, i) => {
      if (i < total - 1) {
        const scaleVal = 1 - (total - 1 - i) * 0.06;
        const yVal = (total - 1 - i) * 40;
        gsap.to(card, {
          scale: scaleVal,
          y: yVal,
          scrollTrigger: {
            trigger: card,
            start: 'top 80px',
            end: 'bottom 80px',
            scrub: true,
          }
        });
      }
    });

    // === FLOATING / ROTATING BADGES ===

    document.querySelectorAll('[data-floating-badge]').forEach(badge => {
      gsap.set(badge, { rotation: -15, scale: 0.5, opacity: 0 });

      // Scroll in — rotate to ~25°, scale to 1, fade in
      gsap.to(badge, {
        rotation: 25,
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: badge,
          start: 'top 95%',
          end: 'top 50%',
          scrub: true,
        }
      });

      // Scroll past — rotate back, scale down slightly
      gsap.to(badge, {
        rotation: -10,
        scale: 0.85,
        ease: 'none',
        scrollTrigger: {
          trigger: badge,
          start: 'top 40%',
          end: 'top 0%',
          scrub: true,
        }
      });
    });

    // === SERVICES ===

    const servicesTitle = document.querySelector('.services-title');
    if (servicesTitle) {
      const servicesChars = splitWordsIntoChars(servicesTitle);
      gsap.from(servicesChars, {
        y: '100%',
        duration: 0.5,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: servicesTitle, start: 'top 85%', toggleActions: 'play none none none' }
      });
    }

    document.querySelectorAll('.service-row').forEach((row) => {
      const name = row.querySelector('.service-name');
      if (name) {
        const nameChars = splitWordsIntoChars(name);
        gsap.from(nameChars, {
          y: '100%',
          duration: 0.5,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' }
        });
      }

      gsap.fromTo(row.querySelector('.service-details'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );

      gsap.fromTo(row.querySelector('.service-visual'),
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    // === PLAY REEL ===
    gsap.fromTo('.play-reel-btn',
      { scale: 0 },
      { scale: 1, duration: 0.8, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.play-reel', start: 'top 75%', toggleActions: 'play none none none' }
      }
    );

    document.querySelectorAll('.play-reel-text h3').forEach((h3) => {
      const chars = splitTextIntoChars(h3);
      gsap.from(chars, {
        y: '100%',
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.play-reel', start: 'top 75%', toggleActions: 'play none none none' }
      });
    });

    // === TRUSTED BY ===
    gsap.fromTo('.trusted-header',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.trusted-header', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.trusted-logo',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out',
        scrollTrigger: { trigger: '.trusted-logos', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    // === TESTIMONIALS ===

    const testimonialsTitle = document.querySelector('.testimonials-title');
    if (testimonialsTitle) {
      const testChars = splitWordsIntoChars(testimonialsTitle);
      gsap.from(testChars, {
        y: '100%',
        duration: 0.5,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: testimonialsTitle, start: 'top 85%', toggleActions: 'play none none none' }
      });
    }

    gsap.fromTo('.testimonial-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.testimonials-grid', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    // === CTA ===
    gsap.fromTo('.cta-button',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-section', start: 'top 75%', toggleActions: 'play none none none' }
      }
    );

    // === FOOTER ===
    gsap.fromTo('.footer-logo',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%', toggleActions: 'play none none none' }
      }
    );

    gsap.fromTo('.footer-col',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-top', start: 'top 90%', toggleActions: 'play none none none' }
      }
    );

    // === PARALLAX ===
    gsap.to('.hero-bg-image', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 100,
      ease: 'none',
    });

    // === NAV BACKGROUND ON SCROLL ===
    ScrollTrigger.create({
      trigger: '.about',
      start: 'top 80px',
      onEnter: () => {
        document.querySelector('.header').style.background = 'rgba(10,10,10,0.9)';
        document.querySelector('.header').style.backdropFilter = 'blur(10px)';
      },
      onLeaveBack: () => {
        document.querySelector('.header').style.background = 'transparent';
        document.querySelector('.header').style.backdropFilter = 'none';
      },
    });

    // === MARQUEE QUOTE TEXT ===
    const quoteText = document.querySelector('.quote-text');
    if (quoteText) {
      const quoteChars = splitWordsIntoChars(quoteText);
      gsap.from(quoteChars, {
        y: '100%',
        duration: 0.4,
        stagger: 0.008,
        ease: 'power3.out',
        scrollTrigger: { trigger: quoteText, start: 'top 85%', toggleActions: 'play none none none' }
      });
    }

    // Brand logos staggered
    gsap.fromTo('.brand-logo',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out',
        scrollTrigger: { trigger: '.brand-logos', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    // === BUTTON HOVER ANIMATIONS ===
    document.querySelectorAll('.btn-outline').forEach(btn => {
      const line = btn.querySelector('.btn-line');
      if (!line) return;

      const tl = gsap.timeline({ paused: true });
      tl.to(line, { scaleX: 1.5, duration: 0.3, ease: 'power2.out' }, 0);

      btn.addEventListener('mouseenter', () => tl.play());
      btn.addEventListener('mouseleave', () => tl.reverse());
    });

    // Refresh after setup
    ScrollTrigger.refresh();
  }

});
