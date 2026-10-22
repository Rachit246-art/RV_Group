/* ==========================================================================
   RV GLOBAL PETROLEUM - INTERACTIVE JAVASCRIPT
   Handles sticky nav, mobile menu, oil price ticker, specs switcher, calculators
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (mobileToggle && mainNav) {
    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const isActive = mainNav.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    }

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });

    // Submenu click for mobile dropdowns (up to 992px)
    const navItemsWithSub = document.querySelectorAll('.nav-item.has-dropdown');
    navItemsWithSub.forEach(item => {
      const link = item.querySelector('.nav-link');
      link?.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          e.stopPropagation();
          item.classList.toggle('open-mobile');
        }
      });
    });
  }

  // 3. Dynamic Live Energy Price Simulation (Brent Crude, Natural Gas, WTI, Base Oil)
  const tickerItems = document.querySelectorAll('[data-ticker]');
  if (tickerItems.length > 0) {
    setInterval(() => {
      tickerItems.forEach(item => {
        const baseVal = parseFloat(item.dataset.base || '84.50');
        const fluctuation = (Math.random() * 0.4 - 0.2).toFixed(2);
        const newVal = (baseVal + parseFloat(fluctuation)).toFixed(2);
        const span = item.querySelector('.val');
        if (span) {
          span.textContent = `$${newVal}`;
          if (parseFloat(fluctuation) >= 0) {
            span.className = 'val val-up';
          } else {
            span.className = 'val val-gold';
          }
        }
      });
    }, 3800);
  }

  // 4. Interactive Technical Specifications Switcher (on Products & Home)
  const tabButtons = document.querySelectorAll('.spec-tab-btn');
  const tabPanes = document.querySelectorAll('.spec-pane');
  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  // 5. Volume & B2B Inquiry Estimator
  const gradeSelect = document.getElementById('calc-grade');
  const volumeInput = document.getElementById('calc-volume');
  const resultDisplay = document.getElementById('calc-est-total');
  
  function updateEstimate() {
    if (!gradeSelect || !volumeInput || !resultDisplay) return;
    const pricePerUnit = parseFloat(gradeSelect.value) || 0;
    const vol = parseFloat(volumeInput.value) || 0;
    const total = pricePerUnit * vol;
    resultDisplay.textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  if (gradeSelect && volumeInput) {
    gradeSelect.addEventListener('change', updateEstimate);
    volumeInput.addEventListener('input', updateEstimate);
    updateEstimate();
  }

  // 6. Interactive Contact / RFQ Form Toast Notification
  const rfqForm = document.getElementById('rfq-form');
  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = rfqForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting Inquiry...';
      submitBtn.disabled = true;

      setTimeout(() => {
        rfqForm.reset();
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Inquiry Dispatched to Global Trading Desk';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        submitBtn.style.borderColor = '#34d399';
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.removeAttribute('style');
        }, 4000);
      }, 1500);
    });
  }

  // 7. Smooth Interactive Parallax & Dynamic Depth on Hero Background
  const parallaxMedia = document.querySelector('.hero-bg-media img');
  if (parallaxMedia) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY;
          if (scrollPos < 1000) {
            // Pronounced parallax shift and smooth scale adjustment
            const translateY = scrollPos * 0.42;
            const scale = 1.05 + (scrollPos * 0.00015);
            parallaxMedia.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 8. Global Smooth Reveal On Scroll (IntersectionObserver)
  const autoRevealSelectors = [
    '.section-head',
    '.stat-card',
    '.product-card',
    '.feature-card',
    '.map-visual-wrap',
    '.news-card',
    '.terminal-card',
    '.career-card',
    '.quote-form',
    '.interactive-spec-module',
    '.spec-card',
    '.b2b-calc-module',
    '.glass-panel'
  ];

  // Auto-tag elements for reveal animation if not already explicitly tagged
  autoRevealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, index) => {
      if (!el.classList.contains('rv-reveal') && !el.classList.contains('rv-reveal-left') && !el.classList.contains('rv-reveal-right')) {
        el.classList.add('rv-reveal');
        // Add subtle stagger to siblings
        const staggerClass = `rv-stagger-${(index % 4) + 1}`;
        el.classList.add(staggerClass);
      }
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.rv-reveal, .rv-reveal-left, .rv-reveal-right, .rv-reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // 9. Smooth Top Scroll Progress Tracker Bar
  let progressBar = document.querySelector('.scroll-progress-tracker');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-tracker';
    document.body.prepend(progressBar);
  }

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // 10. Animated Counter Numbers for Stats
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const match = text.match(/([^\d]*)([\d,.]+)(.*)/);
          if (match) {
            const prefix = match[1] || '';
            const rawVal = parseFloat(match[2].replace(/,/g, ''));
            const suffix = match[3] || '';
            const isDecimal = match[2].includes('.');
            const duration = 1800;
            const startTime = performance.now();

            function updateCount(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const ease = 1 - Math.pow(1 - progress, 3);
              const currentVal = rawVal * ease;
              el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal).toLocaleString()}${suffix}`;
              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                el.textContent = text;
              }
            }
            requestAnimationFrame(updateCount);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));
  }
});
