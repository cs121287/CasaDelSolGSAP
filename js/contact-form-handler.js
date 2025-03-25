/**
 * Contact Form Handler with EmailJS Integration
 * Casa Del Sol AZ | 2025
 * Optimized for performance with modal feedback
 */
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init({
      publicKey: "b3T2GoOXJmt08AM0y"
    });
    
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Initialize form effects
    initFormEffects();
    
    // Initialize date and select handlers
    initDateAndSelectHandlers();
    
    // Set current timestamp
    const formTime = document.getElementById('form_time');
    if (formTime) {
      formTime.value = new Date().toLocaleString('en-US');
    }
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      if (!validateForm(this)) return;
      
      // Update button state
      const submitBtn = this.querySelector('button[type="submit"]');
      const buttonText = submitBtn.querySelector('.button-text');
      const buttonIcon = submitBtn.querySelector('.button-icon');
      
      submitBtn.disabled = true;
      buttonText.textContent = 'Sending...';
      buttonIcon.innerHTML = '<span class="spinner"></span>';
      
      // Mark form as being processed
      contactForm.classList.add('form-sent');
      
      // Prepare form data
      const params = {
        user_name: document.getElementById('name').value,
        user_email: document.getElementById('email').value,
        user_phone: document.getElementById('phone').value || 'Not provided',
        event_type: document.getElementById('event-type').value || 'Not specified',
        event_date: document.getElementById('event-date').value || 'Not specified',
        guests: document.getElementById('guests').value || 'Not specified',
        message: document.getElementById('message').value,
        time: formTime ? formTime.value : new Date().toLocaleString('en-US')
      };
      
      // Send with EmailJS
      emailjs.send('service_vkdsa6d', 'template_q9f1rn2', params)
        .then(function() {
          // Show success modal
          if (window.FormModalHandler && window.FormModalHandler.showSuccess) {
            window.FormModalHandler.showSuccess();
          }
        })
        .catch(function(error) {
          console.error('EmailJS error:', error);
          
          // Reset form sent state
          contactForm.classList.remove('form-sent');
          
          // Show error modal
          if (window.FormModalHandler && window.FormModalHandler.showError) {
            window.FormModalHandler.showError('There was a problem sending your message. Please try again or contact us directly at (480) 123-4567.');
          } else {
            alert('There was a problem sending your message. Please try again or contact us directly at (480) 123-4567.');
          }
          
          // Reset button state
          submitBtn.disabled = false;
          buttonText.textContent = 'Submit Inquiry';
          buttonIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
        });
    });
    
    // Handle has-value class for date and select inputs
    function initDateAndSelectHandlers() {
      // Date input value handler
      const dateInput = document.getElementById('event-date');
      if (dateInput) {
        const dateContainer = dateInput.closest('.date-input');
        
        // Set initial state if date has value
        if (dateInput.value) {
          dateContainer.classList.add('has-value');
          dateInput.style.color = 'var(--form-text)';
        }
        
        // Add change event listener
        dateInput.addEventListener('change', function() {
          if (this.value) {
            dateContainer.classList.add('has-value');
            this.style.color = 'var(--form-text)';
          } else {
            dateContainer.classList.remove('has-value');
            this.style.color = 'var(--form-placeholder)';
          }
        });
        
        // Also handle the input event for better responsiveness
        dateInput.addEventListener('input', function() {
          if (this.value) {
            dateContainer.classList.add('has-value');
            this.style.color = 'var(--form-text)';
          } else {
            dateContainer.classList.remove('has-value');
            this.style.color = 'var(--form-placeholder)';
          }
        });
      }
      
      // Select input value handler
      const selectInput = document.getElementById('event-type');
      if (selectInput) {
        const selectContainer = selectInput.closest('.select-input');
        
        // Set initial state if select has value
        if (selectInput.value && selectInput.value !== '') {
          selectContainer.classList.add('has-value');
          selectInput.style.color = 'var(--form-text)';
        }
        
        // Add change event listener
        selectInput.addEventListener('change', function() {
          if (this.value && this.value !== '') {
            selectContainer.classList.add('has-value');
            this.style.color = 'var(--form-text)';
          } else {
            selectContainer.classList.remove('has-value');
            this.style.color = 'var(--form-placeholder)';
          }
        });
      }
    }
    
    // Form validation function
    function validateForm(form) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      // Remove any existing error messages first for clean validation
      const existingErrors = form.querySelectorAll('.error-message');
      existingErrors.forEach(error => error.remove());
      
      // Check each required field
      for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        const fieldGroup = field.closest('.form-group');
        
        if (!field.value.trim()) {
          fieldGroup.classList.add('has-error');
          isValid = false;
          
          // Add error message if needed
          if (!fieldGroup.querySelector('.error-message')) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            fieldGroup.appendChild(errorMsg);
          }
        } else {
          fieldGroup.classList.remove('has-error');
          
          // Additional validation for email
          if (field.type === 'email' && !validateEmail(field.value)) {
            fieldGroup.classList.add('has-error');
            isValid = false;
            
            if (!fieldGroup.querySelector('.error-message')) {
              const errorMsg = document.createElement('div');
              errorMsg.className = 'error-message';
              errorMsg.textContent = 'Please enter a valid email address';
              fieldGroup.appendChild(errorMsg);
            }
          }
        }
      }
      
      if (!isValid) {
        // Focus first invalid field
        const firstError = form.querySelector('.has-error input, .has-error textarea');
        if (firstError) {
          firstError.focus();
          
          // Smoothly scroll to the error if needed
          const rect = firstError.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > window.innerHeight) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
      
      return isValid;
    }
    
    // Email validation helper
    function validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    
    // Initialize form effects
    function initFormEffects() {
      const inputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
      
      // Set initial state for inputs with values
      inputs.forEach(input => {
        // Set initial has-value class
        if (input.value) {
          input.parentElement.classList.add('has-value');
        }
        
        // Focus event
        input.addEventListener('focus', function() {
          this.parentElement.classList.add('focused');
        });
        
        // Blur event
        input.addEventListener('blur', function() {
          this.parentElement.classList.remove('focused');
          
          if (this.value) {
            this.parentElement.classList.add('has-value');
          } else {
            this.parentElement.classList.remove('has-value');
          }
          
          // Live validation for required fields
          if (this.hasAttribute('required')) {
            const fieldGroup = this.closest('.form-group');
            
            if (!this.value.trim()) {
              fieldGroup.classList.add('has-error');
              
              if (!fieldGroup.querySelector('.error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                fieldGroup.appendChild(errorMsg);
              }
            } else {
              fieldGroup.classList.remove('has-error');
              const errorMsg = fieldGroup.querySelector('.error-message');
              if (errorMsg) errorMsg.remove();
              
              // Email validation
              if (this.type === 'email' && !validateEmail(this.value)) {
                fieldGroup.classList.add('has-error');
                
                if (!fieldGroup.querySelector('.error-message')) {
                  const errorMsg = document.createElement('div');
                  errorMsg.className = 'error-message';
                  errorMsg.textContent = 'Please enter a valid email address';
                  fieldGroup.appendChild(errorMsg);
                }
              }
            }
          }
        });
        
        // Input validation - clear errors as user types
        input.addEventListener('input', function() {
          if (this.hasAttribute('required') || this.type === 'email') {
            const fieldGroup = this.closest('.form-group');
            
            if ((this.hasAttribute('required') && this.value.trim()) || 
                (this.type === 'email' && validateEmail(this.value))) {
              fieldGroup.classList.remove('has-error');
              const errorMsg = fieldGroup.querySelector('.error-message');
              if (errorMsg) errorMsg.remove();
            }
          }
        });
      });
      
      // Submit button hover effects - using event delegation for better performance
      const submitButton = document.querySelector('.submit-button');
      if (submitButton) {
        submitButton.addEventListener('mouseover', function() {
          this.classList.add('hover');
        });
        
        submitButton.addEventListener('mouseout', function() {
          this.classList.remove('hover');
        });
      }
    }
  });
})();