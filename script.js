/**
 * NOVA - Youth Technology Platform
 * Client-side Interactions & Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && primaryNav) {
    const toggleMenu = (isOpen) => {
      const state = typeof isOpen === 'boolean' ? isOpen : !primaryNav.classList.contains('is-open');
      menuToggle.classList.toggle('is-active', state);
      primaryNav.classList.toggle('is-open', state);
      menuToggle.setAttribute('aria-expanded', String(state));
      document.body.style.overflow = state ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        primaryNav.classList.contains('is-open') &&
        !primaryNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });
  }

  // --- Active Nav Link on Scroll (Intersection Observer) ---
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --- Contact Form Handling & Validation ---
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Helper: Validate email format
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    };

    // Helper: Set input validation state
    const setFieldState = (input, isValid) => {
      const parent = input.closest('.form-group');
      if (isValid) {
        parent.classList.remove('has-error');
        input.classList.remove('is-invalid');
      } else {
        parent.classList.add('has-error');
        input.classList.add('is-invalid');
      }
    };

    // Clear validation state on user input
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          setFieldState(input, true);
          if (formStatus.style.display !== 'none') {
            formStatus.style.display = 'none';
          }
        });
      }
    });

    // Handle Form Submit
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const messageVal = messageInput.value.trim();

      let hasError = false;

      // Validate Name
      if (!nameVal) {
        setFieldState(nameInput, false);
        hasError = true;
      } else {
        setFieldState(nameInput, true);
      }

      // Validate Email
      if (!emailVal || !isValidEmail(emailVal)) {
        setFieldState(emailInput, false);
        hasError = true;
      } else {
        setFieldState(emailInput, true);
      }

      // Validate Message
      if (!messageVal || messageVal.length < 10) {
        setFieldState(messageInput, false);
        hasError = true;
      } else {
        setFieldState(messageInput, true);
      }

      if (hasError) {
        return;
      }

      // Simulate sending state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      setTimeout(() => {
        // Display success alert
        formStatus.className = 'form-status success';
        formStatus.textContent = `Thanks, ${nameVal}! Your message has been received. Our team will contact you soon.`;
        formStatus.style.display = 'block';

        // Reset form and button
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }, 700);
    });
  }
});
