/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Apex Auto Care - Main Interactive Script
 * Clean, professional, front-end architecture using GSAP for scroll & entrance animations.
 */

import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroAnimations();
  initStatsCounter();
  initServiceModal();
  initGalleryLightbox();
  initBookingForm();
  initScrollTriggers();
});

/* ==========================================================================
   1. Navbar & Scrollspy
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link-apex, .mobile-nav-link');
  const hamburgerBtn = document.getElementById('btn-hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.getElementById('btn-close-drawer');

  // Sticky navbar shadow on scroll
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile Drawer Toggle
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Smooth scroll
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
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => {
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. Hero Section Entrance & Mouse Parallax
   ========================================================================== */
function initHeroAnimations() {
  const heroImageWrap = document.getElementById('hero-image-wrap');
  const heroMainCard = document.getElementById('hero-main-card');
  const floatCard1 = document.getElementById('hero-float-1');
  const floatCard2 = document.getElementById('hero-float-2');

  // GSAP Entrance Timeline (Immediate on page load — NO preloader)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-trust-badge',
    { opacity: 0, y: -15 },
    { opacity: 1, y: 0, duration: 0.5 }
  )
  .fromTo('.hero-title-reveal',
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
    '-=0.3'
  )
  .fromTo('.hero-desc-reveal',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.4'
  )
  .fromTo('.hero-cta-group',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 },
    '-=0.3'
  )
  .fromTo('.hero-main-card',
    { opacity: 0, scale: 0.94, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.8 },
    '-=0.5'
  )
  .fromTo(['.hero-float-card-1', '.hero-float-card-2'],
    { opacity: 0, y: 15, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15 },
    '-=0.4'
  );

  // Mouse Parallax on Hero Image Container
  if (heroImageWrap && heroMainCard) {
    heroImageWrap.addEventListener('mousemove', (e) => {
      const rect = heroImageWrap.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) - 0.5;
      const ny = ((e.clientY - rect.top) / rect.height) - 0.5;

      gsap.to(heroMainCard, {
        rotateY: nx * 8,
        rotateX: -ny * 8,
        duration: 0.4,
        ease: 'power1.out',
      });

      if (floatCard1) {
        gsap.to(floatCard1, {
          x: nx * 15,
          y: ny * 15,
          duration: 0.3,
          ease: 'power1.out',
        });
      }

      if (floatCard2) {
        gsap.to(floatCard2, {
          x: -nx * 15,
          y: -ny * 15,
          duration: 0.3,
          ease: 'power1.out',
        });
      }
    });

    heroImageWrap.addEventListener('mouseleave', () => {
      gsap.to(heroMainCard, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
      if (floatCard1) gsap.to(floatCard1, { x: 0, y: 0, duration: 0.5 });
      if (floatCard2) gsap.to(floatCard2, { x: 0, y: 0, duration: 0.5 });
    });
  }
}

/* ==========================================================================
   3. Animated Stat Counters
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll<HTMLElement>('.stat-counter');

  statElements.forEach(el => {
    const target = parseFloat(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;

    const counterObj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counterObj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            if (isDecimal) {
              el.textContent = `${counterObj.val.toFixed(1)}${suffix}`;
            } else {
              el.textContent = `${Math.floor(counterObj.val).toLocaleString()}${suffix}`;
            }
          }
        });
      }
    });
  });
}

/* ==========================================================================
   4. Service Details Modal & Booking Autofill
   ========================================================================== */
interface ServiceData {
  title: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  highlights: string[];
}

const SERVICES_CATALOG: Record<string, ServiceData> = {
  'periodic-service': {
    title: 'Periodic Maintenance & Oil Service',
    category: 'Routine Care',
    price: '$89 – $180',
    duration: '1–2 Hours',
    description: 'Comprehensive 40-point vehicle inspection with synthetic oil replacement, OEM oil filter, air & cabin filter checks, brake fluid analysis, and computerized system health scan.',
    highlights: ['OEM Synthetic Engine Oil', 'Genuine Spin-On Filter', '40-Point Safety Check', 'Fluid Top-Ups Included']
  },
  'engine-diagnostics': {
    title: 'Computerized Engine Diagnostics & Overhaul',
    category: 'Mechanical',
    price: '$120 – $850',
    duration: '2–4 Hours',
    description: 'Advanced OBD-II telemetry live-data analysis, cylinder compression verification, ignition coil and fuel injector calibration, timing belt replacement, and transmission health assessment.',
    highlights: ['Live ECU Sensor Telemetry', 'Borescope Cylinder Inspection', 'Ignition & Fuel Balancing', 'Fault Code Eradication']
  },
  'ac-climate': {
    title: 'Precision Car AC & Climate Control Repair',
    category: 'Electrical & AC',
    price: '$75 – $320',
    duration: '2 Hours',
    description: 'Automotive refrigerant R134a/R1234yf recovery & recharge, electronic compressor clutch testing, evaporator coil cleaning, and high-pressure leak detection with UV dye.',
    highlights: ['Micro-Leak UV Dye Check', 'Sub-Zero Vent Temp Guaranteed', 'Antimicrobial Duct Flush', 'OEM Compressor Service']
  },
  'brakes-suspension': {
    title: 'Brake Overhaul & Suspension Calibration',
    category: 'Safety & Chassis',
    price: '$150 – $580',
    duration: '2–3 Hours',
    description: 'Rotary brake disc resurfacing or replacement, ceramic pad installation, hydraulic fluid pressure flush, shock absorber inspection, tie rod alignment, and computerized laser balancing.',
    highlights: ['Ceramic Low-Dust Pads', 'Rotary Disc Lathe Precision', 'Laser Wheel Alignment', 'High-Temp Dot 4 Flush']
  },
  'widebody-modification': {
    title: 'Custom Body Kits & Aerodynamic Styling',
    category: 'Modification',
    price: '$1,200 – $4,500',
    duration: '3–5 Days',
    description: 'Custom aerokit design, ABS / composite widebody flare installations, front splitters, rear diffusers, GT swan-neck wings, and precision panel gap alignment with factory paint matching.',
    highlights: ['Autoclaved Carbon Splitters', 'Widebody Stance Engineering', 'Laser Scanned Panel Gaps', 'Flawless Paint Blending']
  },
  'paint-detailing': {
    title: 'Paint Correction & Ceramic Shield Detailing',
    category: 'Detailing',
    price: '$250 – $850',
    duration: '1–2 Days',
    description: 'Multi-stage rotary compounding to eliminate 95%+ of surface swirl marks, deep interior steam extraction, wheel ceramic coating, and application of 9H nano-ceramic hydrophobic shield.',
    highlights: ['3-Stage Rotary Compounding', '9H Nanotech Ceramic Shield', 'Interior Deep Steam Extraction', 'Hydrophobic Glass Shield']
  }
};

function initServiceModal() {
  const modal = document.getElementById('service-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalPrice = document.getElementById('modal-price');
  const modalDuration = document.getElementById('modal-duration');
  const modalDesc = document.getElementById('modal-desc');
  const modalHighlights = document.getElementById('modal-highlights');
  const selectServiceBtn = document.getElementById('btn-select-service');
  const closeModalBtn = document.getElementById('btn-close-service-modal');

  let activeServiceKey = '';

  const detailButtons = document.querySelectorAll<HTMLButtonElement>('.btn-view-service-detail');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.serviceKey;
      if (!key || !SERVICES_CATALOG[key] || !modal) return;

      activeServiceKey = key;
      const data = SERVICES_CATALOG[key];

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalCategory) modalCategory.textContent = data.category;
      if (modalPrice) modalPrice.textContent = data.price;
      if (modalDuration) modalDuration.textContent = data.duration;
      if (modalDesc) modalDesc.textContent = data.description;

      if (modalHighlights) {
        modalHighlights.innerHTML = '';
        data.highlights.forEach(h => {
          const li = document.createElement('li');
          li.className = 'd-flex align-items-center gap-2 mb-2 text-slate-700 font-semibold small';
          li.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e10600" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${h}</span>
          `;
          modalHighlights.appendChild(li);
        });
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });

  if (selectServiceBtn) {
    selectServiceBtn.addEventListener('click', () => {
      closeModal();
      const serviceSelect = document.getElementById('booking-service') as HTMLSelectElement | null;
      if (serviceSelect && activeServiceKey) {
        serviceSelect.value = activeServiceKey;
        serviceSelect.dispatchEvent(new Event('change'));
      }
      const bookingSec = document.getElementById('booking');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   5. Gallery Lightbox
   ========================================================================== */
function initGalleryLightbox() {
  const modal = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image') as HTMLImageElement | null;
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('btn-close-lightbox');

  if (!modal || !lightboxImg) return;

  const galleryItems = document.querySelectorAll<HTMLElement>('.gallery-grid-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.dataset.title || 'Apex Auto Care Workshop Portfolio';
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = title;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   6. Contact / Booking Form Validation
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('booking-form') as HTMLFormElement | null;
  const successBox = document.getElementById('booking-success-box');
  const serviceSelect = document.getElementById('booking-service') as HTMLSelectElement | null;
  const estimateBox = document.getElementById('booking-estimate-badge');
  const estimatePrice = document.getElementById('estimate-price-val');

  if (!form || !successBox) return;

  const priceLookup: Record<string, string> = {
    'periodic-service': '$89 – $180 (Same Day)',
    'engine-diagnostics': '$120 – $850 (2–4 Hours)',
    'ac-climate': '$75 – $320 (2 Hours)',
    'brakes-suspension': '$150 – $580 (2–3 Hours)',
    'widebody-modification': '$1,200 – $4,500 (3–5 Days)',
    'paint-detailing': '$250 – $850 (1–2 Days)'
  };

  if (serviceSelect && estimateBox && estimatePrice) {
    serviceSelect.addEventListener('change', () => {
      const val = serviceSelect.value;
      if (val && priceLookup[val]) {
        estimatePrice.textContent = priceLookup[val];
        estimateBox.style.display = 'inline-flex';
      } else {
        estimateBox.style.display = 'none';
      }
    });
  }

  function validateInput(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    const parent = input.closest('.form-group-wrap');
    const val = input.value.trim();
    let valid = true;

    if (input.required && !val) {
      valid = false;
    } else if (input.type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) valid = false;
    } else if (input.type === 'tel' && val) {
      const digits = val.replace(/\D/g, '');
      if (digits.length < 7) valid = false;
    }

    if (parent) {
      if (valid) {
        parent.classList.remove('has-error');
      } else {
        parent.classList.add('has-error');
      }
    }

    return valid;
  }

  const allInputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea');
  allInputs.forEach(inp => {
    inp.addEventListener('blur', () => validateInput(inp));
    inp.addEventListener('input', () => {
      const parent = inp.closest('.form-group-wrap');
      if (parent && parent.classList.contains('has-error')) {
        validateInput(inp);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    allInputs.forEach(inp => {
      if (!validateInput(inp)) allValid = false;
    });

    if (!allValid) {
      const firstError = form.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
        <span>Registering Booking...</span>
      `;
    }

    const clientName = (document.getElementById('booking-name') as HTMLInputElement)?.value || 'Valued Client';
    const vehicle = (document.getElementById('booking-vehicle') as HTMLInputElement)?.value || 'Vehicle';
    const serviceName = serviceSelect?.selectedOptions[0]?.text || 'General Diagnostic';
    const appointmentDate = (document.getElementById('booking-date') as HTMLInputElement)?.value || 'Earliest Slot';

    setTimeout(() => {
      const refNumber = `APX-${Math.floor(10000 + Math.random() * 90000)}`;

      const refEl = document.getElementById('success-booking-ref');
      const nameEl = document.getElementById('success-client-name');
      const vehicleEl = document.getElementById('success-client-vehicle');
      const serviceEl = document.getElementById('success-client-service');
      const dateEl = document.getElementById('success-client-date');

      if (refEl) refEl.textContent = refNumber;
      if (nameEl) nameEl.textContent = clientName;
      if (vehicleEl) vehicleEl.textContent = vehicle;
      if (serviceEl) serviceEl.textContent = serviceName;
      if (dateEl) dateEl.textContent = appointmentDate;

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#e10600', '#0ea5e9', '#0f172a', '#3ab4f2']
      });

      gsap.to(form, {
        opacity: 0,
        y: -15,
        duration: 0.35,
        onComplete: () => {
          form.style.display = 'none';
          successBox.classList.add('active');
          gsap.fromTo(successBox,
            { opacity: 0, scale: 0.95, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }
          );
        }
      });
    }, 700);
  });

  const resetBtn = document.getElementById('btn-reset-form');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Confirm Priority Booking</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
      if (estimateBox) estimateBox.style.display = 'none';

      gsap.to(successBox, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          successBox.classList.remove('active');
          form.style.display = 'block';
          gsap.fromTo(form, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
        }
      });
    });
  }
}

/* ==========================================================================
   7. ScrollTrigger Section Animations
   ========================================================================== */
function initScrollTriggers() {
  const revealElements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');

  revealElements.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // Stagger services
  const serviceCards = document.querySelectorAll<HTMLElement>('.service-card-col');
  if (serviceCards.length > 0) {
    gsap.fromTo(serviceCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#services-container',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  // Stagger gallery
  const galleryCols = document.querySelectorAll<HTMLElement>('.gallery-col');
  if (galleryCols.length > 0) {
    gsap.fromTo(galleryCols,
      { opacity: 0, scale: 0.94, y: 25 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#gallery-container',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }

  // Stagger Why Choose Us
  const whyCards = document.querySelectorAll<HTMLElement>('.why-col');
  if (whyCards.length > 0) {
    gsap.fromTo(whyCards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.14,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#why-us-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  }
}
