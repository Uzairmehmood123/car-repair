/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Apex Works - Services Section Logic
 * Handles real automotive imagery, distinct multi-color themes per card,
 * 3D interactive tilt, GSAP category filtering, and service detail modal.
 */

import gsap from 'gsap';

export interface ServiceDetail {
  id: string;
  category: 'repair' | 'modification';
  colorTheme: 'blue' | 'orange' | 'amber' | 'crimson' | 'purple' | 'cyan';
  themeHex: string;
  title: string;
  badge: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  priceEstimate: string;
  duration: string;
  deliverables: string[];
}

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'engine-tuning',
    category: 'modification',
    colorTheme: 'blue',
    themeHex: '#00f0ff',
    badge: 'STAGE 1–4 · AWD DYNO',
    title: 'Precision Engine Tuning & Dyno Calibration',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1000&auto=format&fit=crop',
    shortDesc: 'Stage 1 to Stage 4 ECU/TCU remapping, twin-turbo conversions, high-flow injectors, and real-time dyno testing.',
    fullDesc: 'Custom dyno-tuned calibrations designed specifically for your hardware setup. We adjust ignition timing, boost duty cycles, AFR lambda maps, and thermal thresholds to unleash safe, massive wheel horsepower.',
    priceEstimate: 'From $1,250',
    duration: '1–2 Days',
    deliverables: [
      'Pre & Post Wheel-HP Dyno Verification Graphs',
      'Dual-Map Flex-Fuel (93 Octane / E85 Ethanol)',
      'Custom Anti-Lag, Burble & Launch Control Tuning',
      '12-Month Mechanical Calibration Warranty'
    ]
  },
  {
    id: 'body-kits',
    category: 'modification',
    colorTheme: 'orange',
    themeHex: '#ff5500',
    badge: 'AERO · PRE-PREG CARBON',
    title: 'Custom Widebody Packages & Carbon Aero',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop',
    shortDesc: 'Laser-scanned wide fender flare installations, dry carbon fiber splitters, diffusers, GT swan-neck wings, and vented hoods.',
    fullDesc: 'Engineered downforce meets aggressive street presence. Our composites studio designs, molds, and fits autoclave pre-preg carbon fiber aero with millimeter-perfect OEM panel gaps and integrated airflow ducts.',
    priceEstimate: 'From $3,400',
    duration: '3–5 Days',
    deliverables: [
      '3D Optical CAD Scan & Panel Alignment',
      'Dry Carbon Fiber Splitter & Swan-Neck Wing',
      'Seamless Stance Fender Flare Blending',
      'High-Gloss UV-Inhibiting Clear Coat Polish'
    ]
  },
  {
    id: 'mechanical-repair',
    category: 'repair',
    colorTheme: 'amber',
    themeHex: '#f59e0b',
    badge: 'OEM MASTER TECHNICIANS',
    title: 'Comprehensive Drivetrain & Engine Overhaul',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1000&auto=format&fit=crop',
    shortDesc: 'Complete mechanical diagnostics, engine rebuilds, transmission servicing, timing chain replacements, and cylinder head machining.',
    fullDesc: 'Factory-trained master technicians utilizing OEM diagnostic computers to diagnose and rebuild failing mechanical systems, from rod knock crankshaft replacements to dual-clutch transmission rebuilds.',
    priceEstimate: 'From $850',
    duration: '2–4 Days',
    deliverables: [
      'Digital Borescope Cylinder & Valvetrain Inspection',
      'Genuine OEM Replacement Bearings & Gaskets',
      'Multi-Cylinder Compression & Leakdown Reports',
      '24-Month / 24,000 Mile Comprehensive Warranty'
    ]
  },
  {
    id: 'suspension-brakes',
    category: 'repair',
    colorTheme: 'crimson',
    themeHex: '#ff0055',
    badge: 'BREMBO BIG BRAKES · COILOVERS',
    title: 'Performance Suspension & Big Brake Systems',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop',
    shortDesc: '6-piston monobloc Brembo conversions, 2-piece floating rotors, 3-way adjustable coilovers, and air suspension setups.',
    fullDesc: 'Transform track braking endurance and cornering dynamics. We measure corner weights with wireless digital scales, optimize roll center geometry, and align camber and toe to custom motorsport specifications.',
    priceEstimate: 'From $1,650',
    duration: '1–2 Days',
    deliverables: [
      '4-Corner Scale Balancing & Laser Camber Alignment',
      'Braided Stainless Steel Teflon Brake Lines',
      'Castrol SRF High-Temp Motorsport Fluid Flush',
      'Road & Track Damping Rebound Valving Setup'
    ]
  },
  {
    id: 'valvetronic-exhaust',
    category: 'modification',
    colorTheme: 'purple',
    themeHex: '#a855f7',
    badge: 'TITANIUM · TIG WELDED',
    title: 'Bespoke Valvetronic Titanium Exhausts',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop',
    shortDesc: 'Mandrel-bent titanium and T304 stainless steel cat-back exhausts with electronic remote-controlled sound valves.',
    fullDesc: 'Handcrafted with pie-cut TIG welding for maximum backpressure relief and acoustic euphoria. Switch effortlessly between neighborhood-friendly stealth mode and wide-open straight-pipe roar.',
    priceEstimate: 'From $2,100',
    duration: '1–2 Days',
    deliverables: [
      'Grade 5 Titanium Piping with Anodized Heat Bluing',
      'Dual Wireless Keyfob / In-Cabin Valve Switch',
      'Burnt Titanium or Matte Carbon Quad Tips',
      'Engineered Anti-Drone Hemispherical Resonators'
    ]
  },
  {
    id: 'ceramic-detailing',
    category: 'repair',
    colorTheme: 'cyan',
    themeHex: '#06b6d4',
    badge: '9H NANO SHIELD · MIRROR FINISH',
    title: 'Paint Correction & 9H Ceramic Shield',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop',
    shortDesc: 'Multi-stage rotary polish paint restoration, swirl eradication, and 5-year self-healing ceramic nanocoating.',
    fullDesc: 'The pinnacle of automotive aesthetic perfection. We measure clear-coat depth with ultrasonic thickness gauges, eliminate 98%+ of swirls and micro-marring, and bake military-grade hydrophobic ceramic quartz layers.',
    priceEstimate: 'From $950',
    duration: '2 Days',
    deliverables: [
      '3-Stage Compound & Jewel Finish Rotary Polish',
      'Multi-Layer 9H Hardness Hydrophobic Ceramic Shield',
      'Full Wheel Rim & Caliper Ceramic Coating',
      'Interior Leather Conditioning & Hydrophobic Seal'
    ]
  }
];

export function initServices() {
  const cards = document.querySelectorAll<HTMLElement>('.service-card');
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');

  // 1. 3D Hover Tilt Effect
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 2. Dynamic Filtering with GSAP
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || 'all';

      // Update button active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cardColWrappers = document.querySelectorAll<HTMLElement>('.service-col');

      // Animate out non-matching, animate in matching
      cardColWrappers.forEach(col => {
        const cat = col.dataset.category;
        const shouldShow = filter === 'all' || cat === filter;

        if (shouldShow) {
          col.style.display = 'block';
          gsap.fromTo(col, 
            { opacity: 0, y: 30, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' }
          );
        } else {
          gsap.to(col, {
            opacity: 0,
            y: 20,
            scale: 0.94,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
              col.style.display = 'none';
            }
          });
        }
      });
    });
  });

  // 3. Service Detail Modal
  initServiceModal();
}

function initServiceModal() {
  const modalBackdrop = document.getElementById('service-modal');
  const titleEl = document.getElementById('modal-service-title');
  const categoryEl = document.getElementById('modal-service-category');
  const descEl = document.getElementById('modal-service-desc');
  const priceEl = document.getElementById('modal-service-price');
  const durationEl = document.getElementById('modal-service-duration');
  const deliverablesEl = document.getElementById('modal-service-deliverables');
  const selectServiceBtn = document.getElementById('btn-select-modal-service');
  const closeBtn = document.getElementById('btn-close-service-modal');

  let activeServiceId: string | null = null;

  const openButtons = document.querySelectorAll<HTMLButtonElement>('.btn-open-service-modal');
  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.serviceId;
      const data = SERVICES_DATA.find(s => s.id === id);
      if (!data || !modalBackdrop) return;

      activeServiceId = data.id;

      if (titleEl) titleEl.textContent = data.title;
      if (categoryEl) {
        categoryEl.textContent = `${data.category.toUpperCase()} · ${data.badge}`;
        categoryEl.style.color = data.themeHex;
      }
      if (descEl) descEl.textContent = data.fullDesc;
      if (priceEl) {
        priceEl.textContent = data.priceEstimate;
        priceEl.style.color = data.themeHex;
      }
      if (durationEl) durationEl.textContent = data.duration;

      if (deliverablesEl) {
        deliverablesEl.innerHTML = '';
        data.deliverables.forEach(item => {
          const li = document.createElement('li');
          li.className = 'd-flex align-items-center gap-2 mb-2 text-slate-300';
          li.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${data.themeHex}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${item}</span>
          `;
          deliverablesEl.appendChild(li);
        });
      }

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeModal();
    }
  });

  // "Select & Book" button inside modal
  if (selectServiceBtn) {
    selectServiceBtn.addEventListener('click', () => {
      closeModal();
      if (activeServiceId) {
        const serviceSelect = document.getElementById('booking-service') as HTMLSelectElement | null;
        if (serviceSelect) {
          serviceSelect.value = activeServiceId;
          serviceSelect.dispatchEvent(new Event('change'));
        }
      }

      // Smooth scroll to booking section
      const bookingSec = document.getElementById('booking');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
