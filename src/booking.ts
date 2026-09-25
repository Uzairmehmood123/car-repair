/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Apex Works - Interactive Booking & Consultation Form
 * Real-time client-side validation, instant dynamic cost estimator,
 * and confetti celebration upon confirmation.
 */

import confetti from 'canvas-confetti';
import gsap from 'gsap';

export function initBookingForm() {
  const form = document.getElementById('apex-booking-form') as HTMLFormElement | null;
  const successBox = document.getElementById('booking-success-box');
  const serviceSelect = document.getElementById('booking-service') as HTMLSelectElement | null;
  const quoteEstimateBox = document.getElementById('quote-estimate-box');
  const quotePriceEl = document.getElementById('quote-est-price');
  const quoteTurnaroundEl = document.getElementById('quote-est-turnaround');

  if (!form || !successBox) return;

  // Pricing guide mapped to service IDs
  const quoteLookup: Record<string, { price: string; time: string }> = {
    'engine-tuning': { price: '$1,250 – $2,400', time: '1–2 Business Days' },
    'body-kits': { price: '$3,400 – $7,500', time: '3–5 Business Days' },
    'mechanical-repair': { price: '$850 – $2,800', time: '2–4 Business Days' },
    'suspension-brakes': { price: '$1,650 – $3,900', time: '1–2 Business Days' },
    'valvetronic-exhaust': { price: '$2,100 – $4,600', time: '1–2 Business Days' },
    'ceramic-detailing': { price: '$950 – $1,800', time: '2 Business Days' },
  };

  // Update dynamic quote estimator on service change
  if (serviceSelect && quotePriceEl && quoteTurnaroundEl && quoteEstimateBox) {
    serviceSelect.addEventListener('change', () => {
      const selected = serviceSelect.value;
      if (selected && quoteLookup[selected]) {
        quotePriceEl.textContent = quoteLookup[selected].price;
        quoteTurnaroundEl.textContent = quoteLookup[selected].time;
        quoteEstimateBox.style.display = 'block';
        gsap.fromTo(quoteEstimateBox, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
      } else {
        quoteEstimateBox.style.display = 'none';
      }
    });
  }

  // Field validation helpers
  function validateField(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    const parent = input.closest('.form-group-apex');
    const value = input.value.trim();
    let isValid = true;

    if (input.required && !value) {
      isValid = false;
    } else if (input.type === 'tel' && value) {
      // Basic phone check (at least 7 digits)
      const digits = value.replace(/\D/g, '');
      if (digits.length < 7) isValid = false;
    } else if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) isValid = false;
    }

    if (parent) {
      if (isValid) {
        parent.classList.remove('has-error');
      } else {
        parent.classList.add('has-error');
      }
    }

    return isValid;
  }

  // Real-time blur validation
  const inputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group-apex');
      if (parent && parent.classList.contains('has-error')) {
        validateField(input);
      }
    });
  });

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        allValid = false;
      }
    });

    if (!allValid) {
      // Scroll to first invalid input
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
        <svg class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></svg>
        <span>Transmitting Request...</span>
      `;
    }

    // Capture form values
    const nameVal = (document.getElementById('booking-name') as HTMLInputElement)?.value || '';
    const carVal = (document.getElementById('booking-car') as HTMLInputElement)?.value || '';
    const serviceVal = (document.getElementById('booking-service') as HTMLSelectElement)?.selectedOptions[0]?.text || '';
    const dateVal = (document.getElementById('booking-date') as HTMLInputElement)?.value || 'Flexible';

    setTimeout(() => {
      // Generate randomized booking reference ID
      const refId = `APX-${Math.floor(10000 + Math.random() * 90000)}`;

      // Update success card elements
      const refIdEl = document.getElementById('success-ref-id');
      const clientNameEl = document.getElementById('success-client-name');
      const vehicleEl = document.getElementById('success-vehicle');
      const serviceEl = document.getElementById('success-service');
      const dateEl = document.getElementById('success-date');

      if (refIdEl) refIdEl.textContent = refId;
      if (clientNameEl) clientNameEl.textContent = nameVal;
      if (vehicleEl) vehicleEl.textContent = carVal;
      if (serviceEl) serviceEl.textContent = serviceVal;
      if (dateEl) dateEl.textContent = dateVal || 'Earliest Available';

      // Multi-color vibrant confetti burst
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ff5500', '#a855f7', '#ff0055', '#10b981', '#ffffff']
      });

      // Animate form hide and success show
      gsap.to(form, {
        opacity: 0,
        y: -20,
        duration: 0.35,
        onComplete: () => {
          form.style.display = 'none';
          successBox.classList.add('active');
          gsap.fromTo(successBox, 
            { opacity: 0, y: 20, scale: 0.96 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
          );
        }
      });
    }, 900);
  });

  // Reset / Book another button
  const resetBtn = document.getElementById('btn-reset-booking');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Confirm Intake Appointment</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
      if (quoteEstimateBox) quoteEstimateBox.style.display = 'none';

      gsap.to(successBox, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          successBox.classList.remove('active');
          form.style.display = 'block';
          gsap.fromTo(form, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
        }
      });
    });
  }
}
