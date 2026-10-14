/**
 * Progressive Studio — Lightweight Interactive & Motion Logic
 * Minimalist, accessible, zero-dependency.
 */

(function () {
  'use strict';

  // 1. Mark JavaScript as active for progressive enhancement
  document.documentElement.classList.add('js-active');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Mobile Navigation Toggle & Drawer
  function initMobileNav() {
    var btn = document.getElementById('mobile-nav-toggle');
    var drawer = document.getElementById('mobile-nav-drawer');
    if (!btn || !drawer) return;

    var icon = btn.querySelector('.material-symbols-outlined');

    function openDrawer() {
      drawer.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      if (icon) icon.textContent = 'close';
    }

    function closeDrawer() {
      drawer.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
      if (icon) icon.textContent = 'menu';
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isExpanded = btn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close when clicking any link inside drawer
    var drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        closeDrawer();
        btn.focus();
      }
    });

    // Close when clicking outside drawer
    document.addEventListener('click', function (e) {
      if (btn.getAttribute('aria-expanded') === 'true') {
        if (!drawer.contains(e.target) && !btn.contains(e.target)) {
          closeDrawer();
        }
      }
    });
  }

  // 3. Header Scroll Effect
  function initHeaderScroll() {
    var header = document.querySelector('header');
    if (!header) return;

    var ticking = false;
    function updateHeader() {
      if (window.scrollY > 12) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateHeader();
  }

  // 4. Hero Entrance Stagger
  function initHeroEntrance() {
    var heroElements = document.querySelectorAll('.hero-fade');
    if (!heroElements.length) return;

    if (prefersReducedMotion) {
      heroElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    // Trigger shortly after DOM ready for a fluid, quiet entrance
    window.requestAnimationFrame(function () {
      setTimeout(function () {
        heroElements.forEach(function (el) {
          el.classList.add('is-visible');
        });
      }, 40);
    });
  }

  // 5. Scroll-Triggered Section Reveals
  function initScrollReveals() {
    var reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!reveals.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // 6. Contact Page Interactions (Topic Auto-Select & Transparent Form Handling)
  function initContactPage() {
    var topicSelect = document.getElementById('interest-topic');
    if (topicSelect) {
      // Check URL parameters for topic pre-selection
      var params = new URLSearchParams(window.location.search);
      var topicParam = params.get('topic');
      if (topicParam) {
        var options = topicSelect.options;
        for (var i = 0; i < options.length; i++) {
          if (options[i].value === topicParam) {
            topicSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    var form = document.getElementById('contact-form');
    var charCounter = document.getElementById('char-counter');
    var notesInput = document.getElementById('project-notes');
    var nameInput = document.getElementById('full-name');
    var emailInput = document.getElementById('email-address');

    if (notesInput && charCounter) {
      notesInput.addEventListener('input', function () {
        charCounter.textContent = notesInput.value.length + ' / 1000';
      });
    }

    // Clear validation error on field input
    [nameInput, emailInput, topicSelect, notesInput].forEach(function (input) {
      if (!input) return;
      var errId = input.id === 'full-name' ? 'name-error' :
                  input.id === 'email-address' ? 'email-error' :
                  input.id === 'interest-topic' ? 'topic-error' : 'message-error';
      var errEl = document.getElementById(errId);

      input.addEventListener('input', function () {
        input.classList.remove('border-error');
        if (errEl) errEl.classList.add('hidden');
      });
      input.addEventListener('change', function () {
        input.classList.remove('border-error');
        if (errEl) errEl.classList.add('hidden');
      });
    });

    if (form) {
      var submitBtn = document.getElementById('submit-btn');
      var feedback = document.getElementById('form-feedback');

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var isValid = true;
        var firstInvalid = null;

        // Name validation
        var nameErr = document.getElementById('name-error');
        if (!nameInput.value.trim()) {
          nameErr.classList.remove('hidden');
          nameInput.classList.add('border-error');
          isValid = false;
          if (!firstInvalid) firstInvalid = nameInput;
        } else {
          nameErr.classList.add('hidden');
          nameInput.classList.remove('border-error');
        }

        // Email validation
        var emailErr = document.getElementById('email-error');
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
          emailErr.classList.remove('hidden');
          emailInput.classList.add('border-error');
          isValid = false;
          if (!firstInvalid) firstInvalid = emailInput;
        } else {
          emailErr.classList.add('hidden');
          emailInput.classList.remove('border-error');
        }

        // Topic validation
        var topicErr = document.getElementById('topic-error');
        if (!topicSelect.value) {
          topicErr.classList.remove('hidden');
          topicSelect.classList.add('border-error');
          isValid = false;
          if (!firstInvalid) firstInvalid = topicSelect;
        } else {
          topicErr.classList.add('hidden');
          topicSelect.classList.remove('border-error');
        }

        // Notes validation
        var notesErr = document.getElementById('message-error');
        if (!notesInput.value.trim()) {
          notesErr.classList.remove('hidden');
          notesInput.classList.add('border-error');
          isValid = false;
          if (!firstInvalid) firstInvalid = notesInput;
        } else {
          notesErr.classList.add('hidden');
          notesInput.classList.remove('border-error');
        }

        if (!isValid) {
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        // Processing state
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70');
        var originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Formatting Inquiry...</span>';

        setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-70');
          submitBtn.innerHTML = '<span>Inquiry Prepared</span><span class="material-symbols-outlined text-[18px]">done</span>';

          var senderName = nameInput.value.trim();
          var senderEmail = emailInput.value.trim();
          var senderTopic = topicSelect.options[topicSelect.selectedIndex].text;
          var senderMsg = notesInput.value.trim();

          var mailtoSubject = encodeURIComponent('Progressive Inquiry: ' + senderTopic + ' — ' + senderName);
          var mailtoBody = encodeURIComponent(
            'Name: ' + senderName + '\n' +
            'Email: ' + senderEmail + '\n' +
            'Topic: ' + senderTopic + '\n\n' +
            'Project Overview:\n' + senderMsg
          );
          var mailtoUrl = 'mailto:hello@progressive.studio?subject=' + mailtoSubject + '&body=' + mailtoBody;

          if (feedback) {
            feedback.innerHTML = '' +
              '<div class="flex flex-col gap-space-sm w-full">' +
                '<div class="flex items-center gap-space-sm font-medium text-secondary">' +
                  '<span class="material-symbols-outlined text-[20px]">check_circle</span>' +
                  '<span>Inquiry Formatted & Validated</span>' +
                '</div>' +
                '<p class="font-body-sm text-body-sm text-on-surface leading-relaxed">' +
                  'Thank you, <strong>' + escapeHtml(senderName) + '</strong>. Because this site operates as a static architectural site without an external API backend, your inquiry has been compiled and is ready for dispatch.' +
                '</p>' +
                '<div class="flex flex-wrap items-center gap-space-sm pt-space-xs">' +
                  '<a href="' + mailtoUrl + '" class="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded bg-primary text-on-primary font-body-sm text-body-sm hover:bg-neutral-800 transition-colors">' +
                    '<span>Dispatch via Email Client</span>' +
                    '<span class="material-symbols-outlined text-[16px]">open_in_new</span>' +
                  '</a>' +
                  '<button type="button" id="copy-inquiry-btn" class="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded border border-border bg-background text-on-surface font-body-sm text-body-sm hover:bg-surface transition-colors">' +
                    '<span>Copy Summary</span>' +
                    '<span class="material-symbols-outlined text-[16px]">content_copy</span>' +
                  '</button>' +
                  '<span id="copy-status" class="hidden text-secondary font-label-mono-sm text-label-mono-sm">Copied!</span>' +
                '</div>' +
              '</div>';
            feedback.classList.remove('hidden');

            // Wire up copy button
            var copyBtn = document.getElementById('copy-inquiry-btn');
            var copyStatus = document.getElementById('copy-status');
            if (copyBtn) {
              copyBtn.addEventListener('click', function () {
                var summaryText = 'Name: ' + senderName + '\nEmail: ' + senderEmail + '\nTopic: ' + senderTopic + '\n\n' + senderMsg;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(summaryText).then(function () {
                    if (copyStatus) copyStatus.classList.remove('hidden');
                    setTimeout(function () {
                      if (copyStatus) copyStatus.classList.add('hidden');
                    }, 2500);
                  });
                }
              });
            }
          }
        }, 300);
      });
    }
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    initMobileNav();
    initHeaderScroll();
    initHeroEntrance();
    initScrollReveals();
    initContactPage();
  }
})();
