/**
 * IRON FORGE — Architectural Performance Training
 * Interactions, Category State Switcher, Parallax Depth, Audio Synthesizer & Dialogs
 */

document.addEventListener('DOMContentLoaded', () => {
  initCategorySwitcher();
  initModals();
  initParallax();
  initCanvasModeToggle();
  initAmbientAudio();
  initStatCounter();
  initTierSelection();
});

/* ==========================================================================
   1. FLOATING INFORMATION PANEL: DYNAMIC CATEGORY TABS
   ========================================================================== */
const CATEGORY_DATA = {
  strength: {
    kicker: 'DISCIPLINE FOCUS',
    title: 'STRENGTH TRAINING',
    desc: 'Calibrated barbell compound mastery, periodized velocity-based loading, and neural adaptation for uncompromised force output.',
    tags: ['IPF Calibrated', 'VBT Velocity Tracking'],
    img: 'assets/barbell_detail.jpg',
    badge: '1.2mm Diamond Knurl'
  },
  personal: {
    kicker: '1-ON-1 MASTERY',
    title: 'PERSONAL TRAINING',
    desc: 'Biomechanical kinematic analysis, customized movement prep, and dedicated platform reservations with master strength coaches.',
    tags: ['Kinematic Screen', 'Reserved Platform'],
    img: 'assets/weights_stack.jpg',
    badge: 'Dedicated Coach'
  },
  performance: {
    kicker: 'DISCIPLINE FOCUS',
    title: 'PERFORMANCE TRAINING',
    desc: 'Train with purpose. Build strength, improve performance, and develop a body that performs as well as it looks.',
    tags: ['Periodized Meso-cycles', 'Biomechanical Assessment'],
    img: 'assets/barbell_detail.jpg',
    badge: 'Calibrated Barbell'
  },
  nutrition: {
    kicker: 'CELLULAR PROTOCOL',
    title: 'METABOLIC & NUTRITION',
    desc: 'Metabolic conditioning, continuous glycogen management, biomarker blood panels, and whole-food nutritional architecture.',
    tags: ['Glycogen Tuning', 'Biomarker Panels'],
    img: 'assets/weights_stack.jpg',
    badge: 'Targeted Recovery'
  }
};

function initCategorySwitcher() {
  const pills = document.querySelectorAll('.cat-pill');
  const kicker = document.getElementById('panelKicker');
  const title = document.getElementById('panelTitle');
  const desc = document.getElementById('panelDesc');
  const cropImg = document.getElementById('panelCropImg');
  const cropBadgeText = document.querySelector('.crop-glass-badge span');
  const metaContainer = document.querySelector('.panel-meta-stats');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const catKey = pill.getAttribute('data-cat');
      if (!catKey || !CATEGORY_DATA[catKey]) return;

      // Update active state
      pills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      // Animate content transition
      const data = CATEGORY_DATA[catKey];
      
      const panelContent = document.querySelector('.panel-content-flex');
      panelContent.style.opacity = '0.3';
      panelContent.style.transform = 'translateY(4px)';
      panelContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

      setTimeout(() => {
        kicker.textContent = data.kicker;
        title.textContent = data.title;
        desc.textContent = data.desc;
        cropImg.src = data.img;
        if (cropBadgeText) cropBadgeText.textContent = data.badge;

        if (metaContainer) {
          metaContainer.innerHTML = data.tags
            .map(t => `<span class="meta-tag">${t}</span>`)
            .join('');
        }

        panelContent.style.opacity = '1';
        panelContent.style.transform = 'translateY(0)';
      }, 180);
    });
  });

  // Link lower right "View Programs ↗" to cycle through categories
  const viewProgramsLink = document.getElementById('viewProgramsLink');
  if (viewProgramsLink) {
    viewProgramsLink.addEventListener('click', (e) => {
      e.preventDefault();
      const currentActive = document.querySelector('.cat-pill.active');
      const allPills = Array.from(pills);
      const currentIndex = allPills.indexOf(currentActive);
      const nextIndex = (currentIndex + 1) % allPills.length;
      allPills[nextIndex].click();
      allPills[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
}

/* ==========================================================================
   2. MODALS & DRAWERS
   ========================================================================== */
function initModals() {
  const startModal = document.getElementById('startTrainingModal');
  const contactModal = document.getElementById('contactModal');
  const facilityModal = document.getElementById('facilityModal');

  // Open Buttons
  document.getElementById('startTrainingBtn')?.addEventListener('click', () => {
    startModal?.showModal();
  });

  document.getElementById('openContactBtn')?.addEventListener('click', () => {
    contactModal?.showModal();
  });

  document.getElementById('exploreCardLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    facilityModal?.showModal();
  });

  // Close Buttons
  document.getElementById('closeTrainingModalBtn')?.addEventListener('click', () => {
    startModal?.close();
  });

  document.getElementById('closeContactModalBtn')?.addEventListener('click', () => {
    contactModal?.close();
  });

  document.getElementById('closeFacilityModalBtn')?.addEventListener('click', () => {
    facilityModal?.close();
  });

  // Close on Backdrop Click
  [startModal, contactModal, facilityModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  });
}

function initTierSelection() {
  const tiers = document.querySelectorAll('.tier-card');
  tiers.forEach(tier => {
    tier.addEventListener('click', () => {
      tiers.forEach(t => t.classList.remove('active'));
      tier.classList.add('active');
    });
  });
}

window.handleIntakeSubmit = function() {
  const name = document.getElementById('fullName')?.value || 'Athlete';
  const modal = document.getElementById('startTrainingModal');
  
  if (modal) {
    const card = modal.querySelector('.modal-card');
    card.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <span class="modal-eyebrow">APPLICATION RECEIVED</span>
        <h2 class="modal-title" style="margin-bottom: 16px;">WELCOME, ${name.toUpperCase()}</h2>
        <p class="modal-desc" style="max-width: 480px; margin: 0 auto 28px;">
          Your intake dossier has been dispatched to our Head of Strength. A private concierge will contact you within 4 hours to arrange your physical diagnostic assessment.
        </p>
        <button class="modal-submit-btn" onclick="document.getElementById('startTrainingModal').close(); location.reload();">
          Done
        </button>
      </div>
    `;
  }
};

/* ==========================================================================
   3. SUBTLE MOUSE PARALLAX DEPTH
   ========================================================================== */
function initParallax() {
  const stage = document.getElementById('heroStage');
  const bgImg = document.getElementById('heroBgImage');
  const upperRight = document.getElementById('floatingInfoPanel');
  const lowerLeft = document.getElementById('lowerLeftCard');
  const centerStat = document.getElementById('centerStatCluster');

  if (!stage || window.innerWidth < 1024) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle opposing translations for true 3D spatial depth
    if (bgImg) {
      bgImg.style.transform = `scale(1.02) translate(${x * -8}px, ${y * -8}px)`;
    }
    if (upperRight) {
      upperRight.style.transform = `translate(${x * 14}px, ${y * 14}px)`;
    }
    if (lowerLeft) {
      lowerLeft.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    }
    if (centerStat) {
      centerStat.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    }
  });

  stage.addEventListener('mouseleave', () => {
    if (bgImg) bgImg.style.transform = 'scale(1.01) translate(0px, 0px)';
    if (upperRight) upperRight.style.transform = 'translate(0px, 0px)';
    if (lowerLeft) lowerLeft.style.transform = 'translate(0px, 0px)';
    if (centerStat) centerStat.style.transform = 'translate(0px, 0px)';
  });
}

/* ==========================================================================
   4. PRESENTATION MODE TOGGLE (1440x900 Fixed Canvas vs Fluid Fullscreen)
   ========================================================================== */
function initCanvasModeToggle() {
  const toggleBtn = document.getElementById('aspectRatioToggleBtn');
  const canvasWrapper = document.getElementById('canvasWrapper');
  const label = document.getElementById('aspectLabel');

  if (!toggleBtn || !canvasWrapper) return;

  toggleBtn.addEventListener('click', () => {
    const isFluid = canvasWrapper.classList.toggle('fluid-mode');
    if (isFluid) {
      label.textContent = 'Fluid Fullscreen: Active';
      toggleBtn.style.background = 'rgba(183, 160, 142, 0.3)';
    } else {
      label.innerHTML = '1440&times;900 Canvas: Active';
      toggleBtn.style.background = 'rgba(111, 125, 130, 0.15)';
    }
  });
}

/* ==========================================================================
   5. ATMOSPHERIC SOUND SYNTHESIZER (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let isAudioActive = false;
let droneOsc1 = null;
let droneOsc2 = null;
let masterGain = null;

function initAmbientAudio() {
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioLabel = document.getElementById('audioLabel');
  const iconOff = document.querySelector('.control-icon.audio-off');
  const iconOn = document.querySelector('.control-icon.audio-on');

  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (!isAudioActive) {
      startAmbientAudio();
      isAudioActive = true;
      audioLabel.textContent = 'Ambient Focus: Active';
      iconOff.classList.add('hidden');
      iconOn.classList.remove('hidden');
      audioBtn.style.background = 'rgba(96, 211, 148, 0.2)';
      audioBtn.style.borderColor = '#60D394';
    } else {
      stopAmbientAudio();
      isAudioActive = false;
      audioLabel.textContent = 'Ambient Audio: Off';
      iconOff.classList.remove('hidden');
      iconOn.classList.add('hidden');
      audioBtn.style.background = 'rgba(111, 125, 130, 0.15)';
      audioBtn.style.borderColor = 'rgba(233, 229, 220, 0.12)';
    }
  });
}

function startAmbientAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 3);

    // Warm deep low-frequency focus drone (55Hz / A1 fundamental)
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    // Subtle detuned fifth harmonic (82.5Hz)
    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'triangle';
    droneOsc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

    // Lowpass acoustic filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, audioCtx.currentTime);

    droneOsc1.connect(filter);
    droneOsc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    droneOsc1.start();
    droneOsc2.start();
  } catch (err) {
    console.warn('Web Audio note: User gesture required or unsupported', err);
  }
}

function stopAmbientAudio() {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
    setTimeout(() => {
      try {
        droneOsc1?.stop();
        droneOsc2?.stop();
      } catch (e) {}
    }, 1200);
  }
}

/* ==========================================================================
   6. STATISTIC COUNTER ANIMATION
   ========================================================================== */
function initStatCounter() {
  const counterEl = document.getElementById('statCounter');
  if (!counterEl) return;

  let current = 0;
  const target = 500;
  const duration = 1800; // ms
  const stepTime = 25;
  const increment = target / (duration / stepTime);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      counterEl.textContent = '500+';
      clearInterval(timer);
    } else {
      counterEl.textContent = Math.floor(current) + '+';
    }
  }, stepTime);
}
