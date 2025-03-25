/**
 * Contact Form Modal Handler
 * Casa Del Sol AZ | 2025
 * Optimized for performance with lazy-loaded modals
 */
(function() {
  'use strict';
  
  // DOM elements
  let contactForm;
  let submitButton;
  let successModal;
  let errorModal;
  let closeSuccessButton;
  let closeErrorButton;
  
  // Only init when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    initModalSystem();
  });
  
  /**
   * Initialize the modal system
   */
  function initModalSystem() {
    // Get DOM elements
    contactForm = document.getElementById('contactForm');
    successModal = document.getElementById('successModal');
    errorModal = document.getElementById('errorModal');
    
    if (!contactForm || !successModal || !errorModal) return;
    
    // Init modal close buttons
    closeSuccessButton = document.getElementById('closeSuccessModal');
    closeErrorButton = document.getElementById('closeErrorModal');
    
    if (closeSuccessButton) {
      closeSuccessButton.addEventListener('click', function() {
        closeModal(successModal);
        resetForm();
      });
    }
    
    if (closeErrorButton) {
      closeErrorButton.addEventListener('click', function() {
        closeModal(errorModal);
        resetFormSubmitState();
      });
    }
    
    // Setup modal close on overlay click
    setupModalOverlayClicks();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
  }
  
  /**
   * Setup click handlers for modal overlays
   */
  function setupModalOverlayClicks() {
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
      overlay.addEventListener('click', function(e) {
        const modal = e.target.closest('.modal');
        closeModal(modal);
        
        // If success modal, reset form
        if (modal.id === 'successModal') {
          resetForm();
        } else if (modal.id === 'errorModal') {
          resetFormSubmitState();
        }
      });
    });
  }
  
  /**
   * Setup keyboard event handlers for modals
   */
  function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
      // ESC key closes modals
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          closeModal(activeModal);
          
          // If success modal, reset form
          if (activeModal.id === 'successModal') {
            resetForm();
          } else if (activeModal.id === 'errorModal') {
            resetFormSubmitState();
          }
        }
      }
    });
  }
  
  /**
   * Opens a specified modal
   * @param {HTMLElement} modal - The modal to open
   */
  function openModal(modal) {
    if (!modal) return;
    
    // Add active class with a small delay to ensure the transition works
    requestAnimationFrame(function() {
      modal.classList.add('active');
      
      // Set focus to the close button for accessibility
      const closeButton = modal.querySelector('button');
      if (closeButton) {
        setTimeout(function() {
          closeButton.focus();
        }, 100);
      }
      
      // Set aria attributes
      modal.setAttribute('aria-hidden', 'false');
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    });
  }
  
  /**
   * Closes a specified modal
   * @param {HTMLElement} modal - The modal to close
   */
  function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // Reset aria attributes
    modal.setAttribute('aria-hidden', 'true');
    
    // Allow scrolling again
    document.body.style.overflow = '';
  }
  
  /**
   * Show success modal
   */
  function showSuccessModal() {
    openModal(successModal);
  }
  
  /**
   * Show error modal with custom message
   * @param {string} message - Error message to display
   */
  function showErrorModal(message) {
    const errorMessage = document.getElementById('errorModalMessage');
    if (errorMessage && message) {
      errorMessage.textContent = message;
    }
    openModal(errorModal);
  }
  
  /**
   * Reset form to initial state
   */
  function resetForm() {
    if (!contactForm) return;
    
    // Reset form fields
    contactForm.reset();
    
    // Update timestamp if exists
    const formTime = document.getElementById('form_time');
    if (formTime) {
      formTime.value = new Date().toLocaleString('en-US');
    }
    
    // Reset form groups
    const formGroups = contactForm.querySelectorAll('.form-group');
    for (let i = 0; i < formGroups.length; i++) {
      formGroups[i].classList.remove('focused', 'has-value', 'has-error');
    }
    
    // Reset special inputs
    const dateContainer = document.querySelector('.date-input');
    const selectContainer = document.querySelector('.select-input');
    if (dateContainer) dateContainer.classList.remove('has-value');
    if (selectContainer) selectContainer.classList.remove('has-value');
    
    // Reset input colors
    const dateInput = document.getElementById('event-date');
    const selectInput = document.getElementById('event-type');
    if (dateInput) dateInput.style.color = 'rgba(0, 0, 0, 0.6)';
    if (selectInput) selectInput.style.color = 'rgba(0, 0, 0, 0.6)';
    
    // Remove the sent class
    contactForm.classList.remove('form-sent');
    
    // Reset submit button
    resetFormSubmitState();
  }
  
  /**
   * Reset the submit button state
   */
  function resetFormSubmitState() {
    if (!contactForm) return;
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    const buttonText = submitBtn.querySelector('.button-text');
    const buttonIcon = submitBtn.querySelector('.button-icon');
    
    submitBtn.disabled = false;
    if (buttonText) buttonText.textContent = 'Submit Inquiry';
    if (buttonIcon) buttonIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
  }
  
  // Make functions available to EmailJS handler
  window.FormModalHandler = {
    showSuccess: showSuccessModal,
    showError: showErrorModal
  };
})();