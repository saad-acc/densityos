/* DensityOS — interactions */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Mobile nav ----------
  const menuBtn = document.getElementById('nav-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', function (e) {
      if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Revenue calculator ----------
  const coresSlider = document.getElementById('cores');
  const utilizationSlider = document.getElementById('utilization');
  const rateSlider = document.getElementById('rate');

  if (coresSlider && utilizationSlider && rateSlider) {
    function fmt(v) {
      if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(1) + 'M';
      if (v >= 1_000) return '$' + (v / 1_000).toFixed(0) + 'K';
      return '$' + Math.round(v);
    }
    function fillTrack(slider, min, max) {
      const pct = ((slider.value - min) / (max - min)) * 100;
      slider.style.background =
        `linear-gradient(to right, var(--accent) ${pct}%, var(--grid) ${pct}%)`;
    }
    function calc() {
      const cores = parseInt(coresSlider.value);
      const util = parseInt(utilizationSlider.value) / 100;
      const rate = parseFloat(rateSlider.value);
      const hours = 8760;
      const current = cores * util * rate * hours;
      const upgraded = cores * 0.88 * rate * hours;
      const delta = upgraded - current;

      document.getElementById('cores-display').textContent = cores.toLocaleString();
      document.getElementById('utilization-display').textContent = Math.round(util * 100) + '%';
      document.getElementById('rate-display').textContent = '$' + rate.toFixed(2);
      document.getElementById('current-revenue').textContent = fmt(current);
      document.getElementById('tws-revenue').textContent = fmt(upgraded);
      document.getElementById('additional-revenue').textContent = delta > 0 ? '+' + fmt(delta) : fmt(delta);

      fillTrack(coresSlider, 1000, 100000);
      fillTrack(utilizationSlider, 40, 85);
      fillTrack(rateSlider, 0.05, 0.50);
    }
    [coresSlider, utilizationSlider, rateSlider].forEach(s => s.addEventListener('input', calc));
    calc();
  }

  // ---------- Problem cards accordion ----------
  const problemCards = document.querySelectorAll('.problem-card');
  problemCards.forEach(function (card) {
    function toggle() {
      const isOpen = card.getAttribute('aria-expanded') === 'true';
      problemCards.forEach(c => c.setAttribute('aria-expanded', 'false'));
      card.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    }
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // ---------- POC form ----------
  const pocForm = document.getElementById('poc-form');
  if (pocForm) {
    const requiredFields = ['company-name','website','your-name','role','email','cluster-size','challenges','timeframe'];

    function showError(field, msg) {
      field.style.borderColor = 'var(--accent)';
      let e = field.parentNode.querySelector('.error-message');
      if (!e) { e = document.createElement('p'); e.className = 'error-message'; field.parentNode.appendChild(e); }
      e.textContent = msg;
    }
    function clearError(field) {
      field.style.borderColor = '';
      const e = field.parentNode.querySelector('.error-message');
      if (e) e.remove();
    }

    requiredFields.forEach(function (id) {
      const f = document.getElementById(id);
      if (!f) return;
      f.addEventListener('blur', function () {
        if (!f.value.trim()) showError(f, 'Required'); else clearError(f);
      });
    });

    const emailField = document.getElementById('email');
    if (emailField) {
      emailField.addEventListener('blur', function () {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField.value && !re.test(emailField.value)) showError(emailField, 'Invalid email');
      });
    }

    pocForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let ok = true;
      requiredFields.forEach(function (id) {
        const f = document.getElementById(id);
        if (!f) return;
        if (!f.value.trim()) { ok = false; showError(f, 'Required'); } else clearError(f);
      });
      if (emailField) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField.value && !re.test(emailField.value)) { ok = false; showError(emailField, 'Invalid email'); }
      }
      if (ok) {
        pocForm.style.display = 'none';
        const success = document.createElement('div');
        success.className = 'card';
        success.style.borderColor = 'var(--accent)';
        success.innerHTML = [
          '<p class="card-head" style="color: var(--accent); border-color: var(--accent);">Request received</p>',
          '<h3 style="font-family: var(--font-display); font-weight: 600; font-size: 28px; line-height: 1.2; letter-spacing: -0.005em; margin-bottom: var(--sp-4);">Thank you. <em style="font-style: normal; font-weight: 600; color: var(--accent);">We\u2019ll be in touch.</em></h3>',
          '<p style="color: var(--fg-muted); max-width: 52ch;">We review every request and will respond within 48 hours to schedule an intro call and scope the baseline measurement.</p>',
          '<p class="label" style="margin-top: var(--sp-6);">Next step · Intro call</p>'
        ].join('');
        pocForm.parentNode.appendChild(success);
      }
    });
  }
});

/* =========================================================
   For Data Centers — page-specific interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Gauge bar fills (animate in on load) ----------
  const gauges = document.querySelectorAll('.gauge-bar');
  requestAnimationFrame(function () {
    gauges.forEach(function (g) {
      const fill = g.querySelector('.gauge-bar-fill');
      const pct = parseFloat(g.getAttribute('data-fill') || '0');
      if (fill) fill.style.width = pct + '%';
    });
  });

  // ---------- Hosting capacity calculator ----------
  const serversEl   = document.getElementById('dc-servers');
  const customersEl = document.getElementById('dc-customers');
  const arpuEl      = document.getElementById('dc-arpu');

  if (serversEl && customersEl && arpuEl) {
    const DENSITY_UPLIFT = 0.50;

    function fmtMoney(v) {
      if (v >= 1000000000) return '$' + (v / 1000000000).toFixed(2) + 'B';
      if (v >= 1000000)    return '$' + (v / 1000000).toFixed(1) + 'M';
      if (v >= 1000)       return '$' + (v / 1000).toFixed(0) + 'K';
      return '$' + Math.round(v).toLocaleString();
    }
    function fmtCount(v) {
      if (v >= 1000000) return (v / 1000000).toFixed(2) + 'M';
      if (v >= 1000)    return (v / 1000).toFixed(1) + 'K';
      return Math.round(v).toLocaleString();
    }
    function fillTrack(slider, min, max) {
      const pct = ((slider.value - min) / (max - min)) * 100;
      slider.style.background =
        'linear-gradient(to right, var(--accent) ' + pct + '%, var(--grid) ' + pct + '%)';
    }

    function calcDC() {
      const servers    = parseInt(serversEl.value, 10);
      const custPerSv  = parseInt(customersEl.value, 10);
      const arpu       = parseFloat(arpuEl.value);

      const totalCustomers    = servers * custPerSv;
      const upgradedCustomers = Math.round(totalCustomers * (1 + DENSITY_UPLIFT));
      const extraCustomers    = upgradedCustomers - totalCustomers;

      const annualCurrent  = totalCustomers    * arpu * 12;
      const annualUpgraded = upgradedCustomers * arpu * 12;
      const delta          = annualUpgraded - annualCurrent;

      document.getElementById('dc-servers-display').textContent   = servers.toLocaleString();
      document.getElementById('dc-customers-display').textContent = custPerSv.toString();
      document.getElementById('dc-arpu-display').textContent      = '$' + Math.round(arpu);
      document.getElementById('dc-current').textContent           = fmtMoney(annualCurrent);
      document.getElementById('dc-upgraded').textContent          = fmtMoney(annualUpgraded);
      document.getElementById('dc-extra-customers').textContent   = '+' + fmtCount(extraCustomers);
      document.getElementById('dc-additional').textContent        = '+' + fmtMoney(delta);

      fillTrack(serversEl,   100, 20000);
      fillTrack(customersEl, 2,   40);
      fillTrack(arpuEl,      10,  200);
    }

    [serversEl, customersEl, arpuEl].forEach(function (s) {
      s.addEventListener('input', calcDC);
    });
    calcDC();
  }
});
