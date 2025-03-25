/**
 * Contact form submission handler for CasaDelSolAZ
 * Uses EmailJS for serverless email processing
 */
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (!contactForm || !formSuccess) return;
  
  // Form submission handler
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show processing state
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>Processing...';
    
    // Format current date/time 
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Use sendForm() method for more efficient form data collection
    emailjs.sendForm('service_casa_del_sol', 'template_contact_form', contactForm)
      .then(function(response) {
        console.log('SUCCESS!', response.status);
        
        // Show success message with animation
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translateY(-20px)';
        
        setTimeout(function() {
          contactForm.style.display = 'none';
          formSuccess.classList.remove('hidden');
          
          setTimeout(function() {
            formSuccess.style.opacity = '1';
            formSuccess.style.transform = 'translateY(0)';
          }, 50);
        }, 300);
      })
      .catch(function(error) {
        console.error('FAILED...', error);
        alert('There was a problem sending your message. Please try again or contact us directly at (480) 123-4567.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Inquiry';
      });
  });
  
  // Reset form functionality - existing code
  const resetBtn = document.getElementById('resetForm');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      formSuccess.style.opacity = '0';
      formSuccess.style.transform = 'translateY(20px)';
      
      setTimeout(function() {
        formSuccess.classList.add('hidden');
        contactForm.reset();
        
        // Reset form groups
        contactForm.querySelectorAll('.form-group').forEach(group => {
          group.classList.remove('focused', 'has-value', 'has-error');
        });
        
        contactForm.style.display = 'block';
        
        setTimeout(function() {
          contactForm.style.opacity = '1';
          contactForm.style.transform = 'translateY(0)';
          
          // Re-enable submit button
          contactForm.querySelector('button[type="submit"]').disabled = false;
          contactForm.querySelector('button[type="submit"]').innerHTML = 'Submit Inquiry';
        }, 50);
      }, 300);
    });
  }
});