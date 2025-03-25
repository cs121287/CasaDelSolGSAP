/**
 * Casa Del Sol AZ - Unified Gallery JavaScript
 * Combines all gallery functionality in one optimized file
 * 
 * @version 3.0.0
 * @updated 2025-03-22 03:33:57
 * @repository https://github.com/cs121287/CasaDelSolAZ
 * @author cs121287
 */
(function() {
  'use strict';
  
  // DOM elements cache
  let filterButtons;
  let galleryItems;
  let modal;
  let modalImage;
  let modalTitle;
  let modalDescription;
  let closeModal;
  let prevButton;
  let nextButton;
  let currentIndex = 0;
  let visibleItems = [];
  let initialized = false;
  
  // Configuration
  const TRANSITION_DURATION = 300; // ms
  const MAX_STAGGER_ITEMS = 10; // Maximum number of items to stagger for performance
  const ANIMATION_DURATION = 600; // ms
  const TILT_AMOUNT = 3; // degrees
  const LOAD_THRESHOLD = 0.01;
  const LOAD_MARGIN = '200px 0px';
  
  // Feature detection
  const supportsIntersection = 'IntersectionObserver' in window;
  const supportsPassiveEvents = (function() {
    let passive = false;
    try {
      const options = Object.defineProperty({}, 'passive', {
        get: function() { passive = true; return true; }
      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch(e) {}
    return passive;
  })();
  
  // Initialize when DOM is loaded (avoid DOMContentLoaded for faster initialization)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  /**
   * Initialize all gallery functionality
   */
  function init() {
    if (initialized) return;
    
    // Cache DOM elements
    filterButtons = document.querySelectorAll('.filter-btn');
    galleryItems = document.querySelectorAll('.gallery-item');
    modal = document.getElementById('image-modal');
    modalImage = document.getElementById('modal-image');
    modalTitle = document.getElementById('modal-title');
    modalDescription = document.getElementById('modal-description');
    closeModal = document.querySelector('.close-modal');
    prevButton = document.querySelector('.modal-nav.prev');
    nextButton = document.querySelector('.modal-nav.next');
    
    if (!galleryItems.length) return;
    
    // Set up all features
    setupFilters();
    setupModal();
    setupHoverEffects();
    
    // Setup lazy loading for images
    if (supportsIntersection) {
      setupLazyLoading();
    }
    
    // Initialize by showing all items
    updateVisibleItems('all');
    
    initialized = true;
  }
  
  /**
   * Set up filter buttons
   */
  function setupFilters() {
    if (!filterButtons.length) return;
    
    for (let i = 0; i < filterButtons.length; i++) {
      filterButtons[i].addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all buttons
        for (let j = 0; j < filterButtons.length; j++) {
          filterButtons[j].classList.remove('active');
        }
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Filter gallery items
        const category = this.getAttribute('data-category');
        updateVisibleItems(category);
      });
    }
  }
  
  /**
   * Update visible gallery items based on selected category
   * @param {string} category - The category to filter by
   */
  function updateVisibleItems(category) {
    // Reset visible items array
    visibleItems = [];
    
    // Create batch for DOM updates to minimize reflows
    requestAnimationFrame(() => {
      // First pass: determine which items should be visible
      for (let i = 0; i < galleryItems.length; i++) {
        const item = galleryItems[i];
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || category === itemCategory) {
          item.style.display = '';
          visibleItems.push(item);
        } else {
          item.style.display = 'none';
        }
      }
      
      // Second pass: add staggered animations to visible items
      const staggerLimit = Math.min(visibleItems.length, MAX_STAGGER_ITEMS);
      
      for (let i = 0; i < staggerLimit; i++) {
        const item = visibleItems[i];
        const delay = 50 * i;
        
        // Reset animation
        item.style.animation = 'none';
        
        // Force a reflow (only once per batch due to using requestAnimationFrame)
        void item.offsetWidth;
        
        // Apply new animation with staggered delay
        item.style.animation = `galleryItemFade ${ANIMATION_DURATION}ms ease-out ${delay}ms forwards`;
      }
      
      // For remaining items (if any), apply animation without stagger for performance
      if (visibleItems.length > staggerLimit) {
        for (let i = staggerLimit; i < visibleItems.length; i++) {
          const item = visibleItems[i];
          item.style.animation = `galleryItemFade ${ANIMATION_DURATION}ms ease-out forwards`;
        }
      }
    });
  }
  
  /**
   * Setup interactive hover effects for gallery items
   */
  function setupHoverEffects() {
    // Only apply hover effects on non-touch devices
    if (window.matchMedia('(hover: hover)').matches) {
      for (let i = 0; i < galleryItems.length; i++) {
        const item = galleryItems[i];
        const image = item.querySelector('.gallery-image');
        
        // Use hardware-accelerated transform for better performance
        if (image) {
          image.style.willChange = 'transform';
          
          // Apply tilt effect on mouse move
          item.addEventListener('mousemove', function(e) {
            const bounds = this.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;
            
            // Calculate percentage positions (-0.5 to 0.5)
            const xPercent = mouseX / bounds.width - 0.5;
            const yPercent = mouseY / bounds.height - 0.5;
            
            // Apply subtle 3D tilt effect
            image.style.transform = `perspective(1000px) rotateX(${yPercent * -TILT_AMOUNT}deg) rotateY(${xPercent * TILT_AMOUNT}deg) scale(1.02)`;
          }, supportsPassiveEvents ? { passive: true } : false);
          
          // Reset on mouse leave
          item.addEventListener('mouseleave', function() {
            // Smooth reset transition
            image.style.transform = '';
          });
        }
      }
    }
  }
  
  /**
   * Set up modal functionality
   */
  function setupModal() {
    if (!modal || !modalImage) return;
    
    // Add click handler to all view-image buttons
    const viewButtons = document.querySelectorAll('.view-image');
    for (let i = 0; i < viewButtons.length; i++) {
      viewButtons[i].addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const item = this.closest('.gallery-item');
        const itemIndex = visibleItems.indexOf(item);
        
        if (itemIndex !== -1) {
          openModal(itemIndex);
        }
      });
    }
    
    // Close modal when clicking the close button
    if (closeModal) {
      closeModal.addEventListener('click', closeModalWindow);
    }
    
    // Navigate through images
    if (prevButton) {
      prevButton.addEventListener('click', function() {
        navigateImage(-1);
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', function() {
        navigateImage(1);
      });
    }
    
    // Setup keyboard events (one event listener for all keys)
    document.addEventListener('keydown', function(e) {
      if (!modal || !modal.classList.contains('show')) return;
      
      switch (e.key) {
        case 'Escape':
          closeModalWindow();
          break;
        case 'ArrowLeft':
          navigateImage(-1);
          break;
        case 'ArrowRight':
          navigateImage(1);
          break;
      }
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModalWindow();
      }
    });
  }
  
  /**
   * Preload an image for smoother transitions
   * @param {string} src - Image source URL
   * @returns {Promise} - Promise that resolves when image is loaded
   */
  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  }
  
  /**
   * Open modal with specified image
   * @param {number} index - Index of the image to show
   */
  function openModal(index) {
    if (index < 0 || index >= visibleItems.length) return;
    
    currentIndex = index;
    const item = visibleItems[currentIndex];
    
    if (!item) return;
    
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-info h3');
    const description = item.querySelector('.gallery-info p');
    
    if (img) {
      // Get high-resolution image if available (data-highres attribute)
      // Or fallback to the thumbnail image src
      const imageSrc = img.getAttribute('data-highres') || img.src;
      
      // Add transitioning class for fade effect
      if (modalImage) {
        modalImage.classList.add('transitioning');
      }
      
      // Preload the image for smoother transitions
      preloadImage(imageSrc).then(() => {
        if (modalImage) {
          modalImage.src = imageSrc;
          modalImage.alt = img.alt || 'Gallery image';
          
          // Remove transition class after image is loaded
          setTimeout(() => {
            modalImage.classList.remove('transitioning');
          }, 50);
        }
      }).catch(() => {
        // Fallback if preloading fails
        if (modalImage) {
          modalImage.src = imageSrc;
          modalImage.alt = img.alt || 'Gallery image';
          modalImage.classList.remove('transitioning');
        }
      });
    }
    
    // Set modal title and description
    if (modalTitle && title) {
      modalTitle.textContent = title.textContent || '';
    }
    
    if (modalDescription && description) {
      modalDescription.textContent = description.textContent || '';
    }
    
    // Show modal with smooth transition
    modal.style.display = 'block';
    
    // Force reflow before adding transition class
    void modal.offsetWidth;
    
    // Add show class for transition
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close the modal window
   */
  function closeModalWindow() {
    // Start transition
    modal.classList.remove('show');
    
    // Clean up after transition completes
    setTimeout(() => {
      modal.style.display = 'none';
      
      // Clear image src to free memory
      if (modalImage) {
        modalImage.src = '';
      }
      
      // Re-enable body scroll
      document.body.style.overflow = '';
    }, TRANSITION_DURATION);
  }
  
  /**
   * Navigate to previous or next image
   * @param {number} direction - Navigation direction (-1 for prev, 1 for next)
   */
  function navigateImage(direction) {
    // Nothing to navigate if we have 0-1 items
    if (visibleItems.length <= 1) return;
    
    // Calculate new index with wrapping
    let nextIndex = currentIndex + direction;
    
    // Wrap around if needed
    if (nextIndex < 0) {
      nextIndex = visibleItems.length - 1;
    } else if (nextIndex >= visibleItems.length) {
      nextIndex = 0;
    }
    
    // Don't do anything if we somehow end up at the same index
    if (nextIndex === currentIndex) return;
    
    // Add transition class
    modalImage.classList.add('transitioning');
    
    // Wait for fade out before changing image
    setTimeout(() => {
      openModal(nextIndex);
    }, 200);
  }
  
  /**
   * Set up intersection observer for lazy loading images
   */
  function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.gallery-image img[loading="lazy"]');
    if (!lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (!entry.isIntersecting) continue;
        
        const img = entry.target;
        
        // Handle different lazy loading strategies
        // 1. data-src attribute (traditional)
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
        
        // 2. data-srcset for responsive images
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          delete img.dataset.srcset;
        }
        
        // 3. data-highres for modal view
        if (img.dataset.highres && !img.dataset.highresLoaded) {
          // Preload high-res version after the main image loads
          const preloader = new Image();
          preloader.onload = () => {
            img.dataset.highresLoaded = 'true';
          };
          preloader.src = img.dataset.highres;
        }
        
        // Mark as loaded and stop observing
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    }, {
      rootMargin: LOAD_MARGIN,
      threshold: LOAD_THRESHOLD
    });
    
    // Start observing images
    for (let i = 0; i < lazyImages.length; i++) {
      imageObserver.observe(lazyImages[i]);
    }
  }
})();