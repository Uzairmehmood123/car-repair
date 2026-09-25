/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Apex Works - GSAP Animation Orchestration & Custom Cursor
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');

  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Smooth lerp follower
  const updateFollower = () => {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(updateFollower);
  };
  requestAnimationFrame(updateFollower);

  // Hover states
  const interactives = document.querySelectorAll<HTMLElement>(
    'a, button, input, select, textarea, .service-card, .gallery-card, .color-swatch, .comparison-handle'
  );

  interactives.forEach(el => {
    el.addEventListener('pointerenter', () => {
      follower.classList.add('is-hovering');
    });
    el.addEventListener('pointerleave', () => {
      follower.classList.remove('is-hovering');
    });
  });
}

export function initNavbar() {
  const navbar = document.querySelector('.navbar-apex');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link-custom, .mobile-nav-link');
  const hamburgerBtn = document.getElementById('btn-hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileCloseBtn = document.getElementById('btn-close-mobile-nav');

  // Sticky / background change on scroll
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Drawer Toggle
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (mobileCloseBtn && mobileDrawer) {
    mobileCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Smooth scroll and active link highlight
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          if (mobileDrawer && mobileDrawer.classList.contains('open')) {
            mobileDrawer.classList.remove('open');
            document.body.style.overflow = '';
          }
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Scrollspy
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

export function playHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-badge-tag',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 }
  )
  .fromTo('.hero-title-reveal',
    { opacity: 0, y: 35 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
    '-=0.4'
  )
  .fromTo('.hero-desc-reveal',
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: 0.7 },
    '-=0.5'
  )
  .fromTo('.hero-cta-group',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.4'
  )
  .fromTo('.hero-3d-wrap',
    { opacity: 0, scale: 0.94, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power2.out' },
    '-=0.7'
  );
}

export function initScrollAnimations() {
  // Reveal on scroll elements
  const revealElements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');
  revealElements.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Services stagger
  const serviceCards = document.querySelectorAll<HTMLElement>('.service-col');
  if (serviceCards.length > 0) {
    gsap.fromTo(serviceCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#services-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  // 3D tilt effect on primary CTA buttons
  const tiltBtns = document.querySelectorAll<HTMLElement>('.btn-apex-primary, .btn-apex-secondary');
  tiltBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -8;
      const ry = ((x - cx) / cx) * 8;
      btn.style.transform = `perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}
