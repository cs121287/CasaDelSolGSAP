/**
 * FAQ functionality for CasaDelSolAZ
 * Optimized for performance with event delegation and minimal DOM operations
 * Version: 3.0.2
 */
document.addEventListener('DOMContentLoaded', function() {
  // Use event delegation for better performance
  const faqContainer = document.querySelector('.faq-container');
  
  if (faqContainer) {
    faqContainer.addEventListener('click', function(event) {
      // Find the closest faq-question button if the click was on or within it
      const faqQuestion = event.target.closest('.faq-question');
      
      if (faqQuestion) {
        // Close any other open FAQ items first for accordion effect
        const activeFaqQuestions = faqContainer.querySelectorAll('.faq-question.active');
        activeFaqQuestions.forEach(activeQuestion => {
          if (activeQuestion !== faqQuestion) {
            activeQuestion.classList.remove('active');
            const activeAnswer = activeQuestion.nextElementSibling;
            activeAnswer.classList.remove('active');
            activeAnswer.style.maxHeight = '0';
          }
        });
        
        // Toggle active class on the question element itself
        faqQuestion.classList.toggle('active');
        
        // Get the corresponding answer
        const faqAnswer = faqQuestion.nextElementSibling;
        
        // Toggle the active class on the answer too
        faqAnswer.classList.toggle('active');
        
        // Set max-height for smooth animation
        if (faqQuestion.classList.contains('active')) {
          faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
        } else {
          faqAnswer.style.maxHeight = '0';
        }
      }
    });
    
    // Auto-initialize the first FAQ item to be open for better UX
    const firstFaqQuestion = faqContainer.querySelector('.faq-question');
    const firstFaqAnswer = faqContainer.querySelector('.faq-answer');
    if (firstFaqQuestion && firstFaqAnswer) {
      firstFaqQuestion.classList.add('active');
      firstFaqAnswer.classList.add('active');
      firstFaqAnswer.style.maxHeight = firstFaqAnswer.scrollHeight + 'px';
    }
  }
  
  // Pre-populate service field on contact form if coming from a service link
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  
  if (serviceParam) {
    // Use requestAnimationFrame for better performance than setTimeout
    requestAnimationFrame(() => {
      const serviceSelect = document.getElementById('service');
      if (serviceSelect) {
        // Format the service parameter to match option values
        const formattedService = serviceParam.replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        // Find and select the matching option
        Array.from(serviceSelect.options).forEach(option => {
          if (option.text.includes(formattedService)) {
            option.selected = true;
            
            // Trigger any "change" handlers that might be present
            const changeEvent = new Event('change', { bubbles: true });
            serviceSelect.dispatchEvent(changeEvent);
          }
        });
        
        // Scroll to contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          // Use scrollIntoView with smooth behavior
          contactForm.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    });
  }
});