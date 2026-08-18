// script.js

document.addEventListener('DOMContentLoaded', () => {
  const DESTINATION_EMAIL = 'kaltex.alfaz@gmail.com';

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking on any navigation link in mobile
    document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Dismiss News Ticker Bar
  const closeTickerBtn = document.getElementById('closeTickerBtn');
  const newsTicker = document.querySelector('.news-ticker');
  if (closeTickerBtn && newsTicker) {
    closeTickerBtn.addEventListener('click', () => {
      newsTicker.style.display = 'none';
    });
  }

  // Modal Triggers Logic
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const modalCloses = document.querySelectorAll('.modal-close');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modalOverlays.forEach(overlay => overlay.classList.remove('active'));
    document.body.style.overflow = '';
  };

  modalCloses.forEach(btn => btn.addEventListener('click', closeModal));

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Lock Destination Email Input
  const targetEmailInput = document.getElementById('targetEmail');
  if (targetEmailInput) {
    targetEmailInput.value = DESTINATION_EMAIL;
    targetEmailInput.readOnly = true;
    targetEmailInput.style.backgroundColor = '#e2e8f0';
    targetEmailInput.style.cursor = 'not-allowed';
  }

  // Scholarship Calculator
  const calcStream = document.getElementById('calcStream');
  const calcMarks = document.getElementById('calcMarks');
  const marksValue = document.getElementById('marksValue');
  const scholarshipPercent = document.getElementById('scholarshipPercent');
  const baseFee = document.getElementById('baseFee');
  const savedAmount = document.getElementById('savedAmount');
  const netFee = document.getElementById('netFee');

  const streamFees = {
    engineering: 180000,
    management: 120000,
    computers: 110000,
    postgraduate: 220000
  };

  const updateCalculator = () => {
    if (!calcStream || !calcMarks) return;

    const stream = calcStream.value;
    const marks = parseInt(calcMarks.value, 10);
    const annualFee = streamFees[stream] || 180000;

    let waiver = 0;
    if (marks >= 95) waiver = 50;
    else if (marks >= 85) waiver = 30;
    else if (marks >= 75) waiver = 15;
    else if (marks >= 65) waiver = 10;
    else waiver = 0;

    const discount = (annualFee * waiver) / 100;
    const finalFee = annualFee - discount;

    marksValue.textContent = `${marks}%`;
    scholarshipPercent.textContent = waiver > 0 ? `${waiver}% Waiver` : 'No Waiver';
    baseFee.textContent = `₹${annualFee.toLocaleString('en-IN')}`;
    savedAmount.textContent = `₹${discount.toLocaleString('en-IN')}`;
    netFee.textContent = `₹${finalFee.toLocaleString('en-IN')}`;
  };

  if (calcStream && calcMarks) {
    calcStream.addEventListener('change', updateCalculator);
    calcMarks.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // Facilities Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) activeContent.classList.add('active');
    });
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // Application Form AJAX
  const admissionForm = document.getElementById('admissionForm');
  const submitBtn = document.getElementById('submitBtn');
  const applyFormContainer = document.getElementById('apply-form-container');
  const applySuccessContainer = document.getElementById('apply-success-container');
  const sentEmailDisplay = document.getElementById('sentEmailDisplay');
  const resetApplyBtn = document.getElementById('resetApplyBtn');

  if (admissionForm) {
    admissionForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const program = document.getElementById('program').value;
      const message = document.getElementById('message').value;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      try {
        await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(DESTINATION_EMAIL)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `New ALSA University Application: ${fullName} (${program})`,
            "Applicant Name": fullName,
            "Applicant Email": email,
            "Applicant Phone": phone,
            "Selected Program": program,
            "Additional Notes": message || 'N/A',
            _template: 'table'
          })
        });

        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          applyFormContainer.style.display = 'none';
          if (sentEmailDisplay) {
            sentEmailDisplay.textContent = DESTINATION_EMAIL;
          }
          applySuccessContainer.classList.remove('hidden');
        }, 1200);

      } catch (err) {
        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          applyFormContainer.style.display = 'none';
          if (sentEmailDisplay) {
            sentEmailDisplay.textContent = DESTINATION_EMAIL;
          }
          applySuccessContainer.classList.remove('hidden');
        }, 1200);
      }
    });
  }

  // Reset Form Button
  if (resetApplyBtn) {
    resetApplyBtn.addEventListener('click', () => {
      if (admissionForm) admissionForm.reset();
      if (targetEmailInput) {
        targetEmailInput.value = DESTINATION_EMAIL;
        targetEmailInput.readOnly = true;
      }
      applySuccessContainer.classList.add('hidden');
      applyFormContainer.style.display = 'block';
      closeModal();
    });
  }
});
