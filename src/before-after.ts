/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Apex Works - Interactive Before / After Comparison Slider & Lightbox Gallery
 * Features real sports car imagery, smooth drag kinematics, and full-screen inspection lightbox.
 */

export function initBeforeAfterSlider() {
  const container = document.getElementById('comparison-container');
  const afterWrapper = document.getElementById('comparison-after');
  const handle = document.getElementById('comparison-handle');
  const beforeImg = document.getElementById('comparison-before-img') as HTMLImageElement | null;
  const afterImg = document.getElementById('comparison-after-img') as HTMLImageElement | null;
  const percentBadge = document.getElementById('comparison-percent-badge');

  if (!container || !afterWrapper || !handle) return;

  const sliderContainer = container;
  const sliderAfterWrapper = afterWrapper;
  const sliderHandle = handle;

  let isDragging = false;
  let currentPercentage = 50;

  function updateSlider(percentage: number) {
    const clamped = Math.max(0, Math.min(100, percentage));
    currentPercentage = clamped;

    sliderHandle.style.left = `${clamped}%`;
    sliderAfterWrapper.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;

    if (percentBadge) {
      percentBadge.textContent = `${Math.round(clamped)}%`;
    }
  }

  function handleMove(clientX: number) {
    const rect = sliderContainer.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    updateSlider(percentage);
  }

  // Pointer Down
  sliderHandle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    sliderHandle.setPointerCapture(e.pointerId);
  });

  sliderContainer.addEventListener('click', (e) => {
    if (!isDragging) {
      handleMove(e.clientX);
    }
  });

  // Pointer Move
  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  // Pointer Up
  window.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
      try {
        sliderHandle.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  });

  // Keyboard accessibility
  sliderHandle.setAttribute('tabindex', '0');
  sliderHandle.setAttribute('role', 'slider');
  sliderHandle.setAttribute('aria-valuenow', '50');
  sliderHandle.setAttribute('aria-valuemin', '0');
  sliderHandle.setAttribute('aria-valuemax', '100');
  sliderHandle.setAttribute('aria-label', 'Transformation comparison position');

  sliderHandle.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      updateSlider(currentPercentage - 5);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      updateSlider(currentPercentage + 5);
      e.preventDefault();
    }
  });

  // Preset Project Switchers
  const projectBtns = document.querySelectorAll<HTMLButtonElement>('.project-switch-btn');
  const projectTitle = document.getElementById('project-title');
  const projectDesc = document.getElementById('project-desc');
  const projectSpecs = document.getElementById('project-specs');

  const projectsData: Record<string, {
    beforeSrc: string;
    afterSrc: string;
    title: string;
    desc: string;
    specs: string;
  }> = {
    widebody: {
      beforeSrc: '/src/assets/images/car_before_stock_1790329620599.jpg',
      afterSrc: '/src/assets/images/car_after_modified_1790329632300.jpg',
      title: 'Bespoke Widebody GT Aero Package',
      desc: 'Complete carbon-fiber widebody conversion, active rear wing installation, forged lightweight staggered wheels, and 3-way adjustable air suspension.',
      specs: 'Dry Carbon Fiber · +85mm Track Width · -42kg Unsprung Mass'
    },
    engine: {
      beforeSrc: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1200&auto=format&fit=crop',
      afterSrc: '/src/assets/images/car_engine_tuned_1790329645111.jpg',
      title: 'Twin-Turbocharged Stage 3 Powertrain Overhaul',
      desc: 'Precision balanced forged rotating assembly, twin ceramic ball-bearing turbos, custom titanium exhaust headers, and bespoke dyno ECU calibration.',
      specs: '780 WHP · 850 Nm Torque · Dual Map Ethanol Flex-Fuel'
    },
    detailing: {
      beforeSrc: '/src/assets/images/car_before_stock_1790329620599.jpg',
      afterSrc: '/src/assets/images/car_detailing_paint_1790329660510.jpg',
      title: 'Multi-Stage Paint Restoration & 9H Ceramic Shield',
      desc: 'Rotary multi-step compounding to eliminate 99% of surface imperfections, followed by thermal infrared baking of dual-layer hydrophobic ceramic shield.',
      specs: 'Mirror Specular Reflection · 9H Hardness · 5-Year Surface Warranty'
    }
  };

  projectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const key = btn.dataset.project || 'widebody';
      const data = projectsData[key];
      if (data && beforeImg && afterImg) {
        beforeImg.src = data.beforeSrc;
        afterImg.src = data.afterSrc;
        if (projectTitle) projectTitle.textContent = data.title;
        if (projectDesc) projectDesc.textContent = data.desc;
        if (projectSpecs) projectSpecs.textContent = data.specs;

        updateSlider(50);
      }
    });
  });

  // Initial setup
  updateSlider(50);

  // Setup Lightbox Modal
  initLightbox();
}

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const modalTitle = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal || !modalImg) return;

  const galleryItems = document.querySelectorAll<HTMLElement>('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.imgSrc || (item.querySelector('img') as HTMLImageElement)?.src;
      const title = item.dataset.imgTitle || 'Apex Works Performance Build';
      if (src) {
        modalImg.src = src;
        if (modalTitle) modalTitle.textContent = title;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
