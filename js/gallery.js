/**
 * Enhanced Gallery Modal Functionality for CasaDelSolAZ
 * Version: 4.2.0
 * Optimized for performance with improved navigation
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
    
    // Cache DOM elements
    const videoModal = document.getElementById('video-modal');
    const imageModal = document.getElementById('image-modal');
    const videoWrapper = videoModal?.querySelector('.video-wrapper');
    const modalImage = document.getElementById('modal-image');
    const videoTitle = document.getElementById('video-modal-title');
    const videoDesc = document.getElementById('video-modal-description');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const prevBtn = imageModal?.querySelector('.modal-nav.prev');
    const nextBtn = imageModal?.querySelector('.modal-nav.next');
    const header = document.getElementById('header');
    const body = document.body;
    
    // Gallery state tracking
    let currentGalleryItems = [];
    let currentIndex = 0;
    let lastScrollPosition = 0;
    let headerClass = '';
    
    // Initialize gallery
    initGallery();
    
    function initGallery() {
        // Initialize photo gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            const viewBtn = item.querySelector('.view-image');
            
            if (viewBtn) {
                viewBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openImageModal(item, index);
                });
            }
            
            // Make whole gallery item clickable
            item.addEventListener('click', function(e) {
                if (!e.target.closest('.view-image')) {
                    e.preventDefault();
                    openImageModal(item, index);
                }
            });
        });
        
        // Video gallery using event delegation
        const videoGrid = document.querySelector('.video-gallery-grid');
        if (videoGrid) {
            videoGrid.addEventListener('click', function(e) {
                const videoItem = e.target.closest('.video-item');
                if (!videoItem) return;
                
                e.preventDefault();
                openVideoModal(videoItem);
            });
        }
        
        // Close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const modal = this.closest('.modal');
                if (modal.id === 'video-modal') {
                    closeVideoModal();
                } else {
                    closeImageModal();
                }
            });
        });
        
        // Navigation buttons
        prevBtn?.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                navigateGallery('prev');
            }
        });
        
        nextBtn?.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                navigateGallery('next');
            }
        });
        
        // Close on background click
        imageModal?.addEventListener('click', function(e) {
            if (e.target === imageModal) closeImageModal();
        });
        
        videoModal?.addEventListener('click', function(e) {
            if (e.target === videoModal) closeVideoModal();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (imageModal?.classList.contains('show')) {
                if (e.key === 'ArrowLeft' && !prevBtn.classList.contains('disabled')) {
                    navigateGallery('prev');
                } else if (e.key === 'ArrowRight' && !nextBtn.classList.contains('disabled')) {
                    navigateGallery('next');
                } else if (e.key === 'Escape') {
                    closeImageModal();
                }
            } else if (videoModal?.classList.contains('show') && e.key === 'Escape') {
                closeVideoModal();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', debounce(function() {
            if (imageModal?.classList.contains('show')) {
                optimizeImageSize();
            }
            if (videoModal?.classList.contains('show')) {
                optimizeVideoSize();
            }
        }, 200));
    }
    
    function openImageModal(item, index) {
        if (!imageModal || !modalImage) return;
        
        // Get all currently visible gallery items
        currentGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
        currentIndex = currentGalleryItems.indexOf(item);
        
        // Save page state
        savePageState();
        
        // Get image data
        const img = item.querySelector('img');
        const highresUrl = img.getAttribute('data-highres') || img.src;
        const title = item.querySelector('.gallery-info h3')?.textContent || '';
        const desc = item.querySelector('.gallery-info p')?.textContent || '';
        
        // Set modal content
        modalImage.src = highresUrl;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        
        // Show modal
        imageModal.style.visibility = 'visible';
        imageModal.style.display = 'block';
        
        // Optimize size after image loads
        modalImage.onload = function() {
            optimizeImageSize();
            // Update navigation buttons
            updateNavigationButtons();
            // Fade in
            requestAnimationFrame(() => {
                imageModal.classList.add('show');
            });
        };
        
        // Lock body scroll
        lockBodyScroll();
        
        // Fallback in case image is cached and onload doesn't fire
        setTimeout(() => {
            if (!imageModal.classList.contains('show')) {
                optimizeImageSize();
                updateNavigationButtons();
                imageModal.classList.add('show');
            }
        }, 100);
        
        // Preload adjacent images
        preloadAdjacentImages();
    }
    
    function updateNavigationButtons() {
        // Update previous button
        if (prevBtn) {
            if (currentIndex <= 0) {
                prevBtn.classList.add('disabled');
                prevBtn.setAttribute('aria-disabled', 'true');
            } else {
                prevBtn.classList.remove('disabled');
                prevBtn.setAttribute('aria-disabled', 'false');
            }
        }
        
        // Update next button
        if (nextBtn) {
            if (currentIndex >= currentGalleryItems.length - 1) {
                nextBtn.classList.add('disabled');
                nextBtn.setAttribute('aria-disabled', 'true');
            } else {
                nextBtn.classList.remove('disabled');
                nextBtn.setAttribute('aria-disabled', 'false');
            }
        }
    }
    
    function optimizeImageSize() {
        if (!modalImage) return;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calculate optimal size (80% of viewport)
        const maxWidth = viewportWidth * 0.8;
        const maxHeight = viewportHeight * 0.8;
        
        // Get natural image dimensions
        const imgWidth = modalImage.naturalWidth;
        const imgHeight = modalImage.naturalHeight;
        
        // Calculate scaling factors
        const widthRatio = maxWidth / imgWidth;
        const heightRatio = maxHeight / imgHeight;
        
        // Use smaller ratio to ensure image fits
        const scaleFactor = Math.min(widthRatio, heightRatio, 1);
        
        // Set dimensions
        const optimalWidth = Math.floor(imgWidth * scaleFactor);
        const optimalHeight = Math.floor(imgHeight * scaleFactor);
        
        // Apply dimensions
        const modalContent = imageModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.width = `${optimalWidth}px`;
            modalContent.style.top = '50%';
            modalContent.style.left = '50%';
            modalContent.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    function openVideoModal(videoItem) {
        if (!videoModal) return;
        
        // Get video data
        const videoId = videoItem.getAttribute('data-video-id');
        if (!videoId) return;
        
        const title = videoItem.querySelector('.video-info h3')?.textContent || '';
        const desc = videoItem.querySelector('.video-info p')?.textContent || '';
        
        // Save page state
        savePageState();
        
        // Show loading state
        if (videoWrapper) {
            videoWrapper.innerHTML = '<div class="loading-spinner"></div>';
        }
        
        // Update caption
        if (videoTitle) videoTitle.textContent = title;
        if (videoDesc) videoDesc.textContent = desc;
        
        // Show modal
        videoModal.style.visibility = 'visible';
        videoModal.style.display = 'block';
        
        // Lock body scroll
        lockBodyScroll();
        
        // Optimize size and create player
        optimizeVideoSize();
        createVideoEmbed(videoId);
        
        // Fade in
        requestAnimationFrame(() => {
            videoModal.classList.add('show');
        });
    }
    
    function optimizeVideoSize() {
        if (!videoModal) return;
        
        const modalContent = videoModal.querySelector('.video-modal-content');
        if (!modalContent) return;
        
        // Get viewport dimensions
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // For 9:16 aspect ratio vertical videos
        const padding = 80; // 40px on each side
        const maxHeight = viewportHeight - padding;
        const maxWidth = (maxHeight * 9/16);
        
        // If calculated width overflows viewport width
        if (maxWidth > (viewportWidth - padding)) {
            const adjustedWidth = viewportWidth - padding;
            const adjustedHeight = (adjustedWidth * 16/9);
            
            modalContent.style.width = `${adjustedWidth}px`;
            modalContent.style.height = `${adjustedHeight}px`;
        } else {
            modalContent.style.width = `${maxWidth}px`;
            modalContent.style.height = `${maxHeight}px`;
        }
        
        // Center modal
        modalContent.style.top = '50%';
        modalContent.style.left = '50%';
        modalContent.style.transform = 'translate(-50%, -50%)';
    }
    
    function createVideoEmbed(videoId) {
        if (!videoWrapper) return;
        
        // Create embed
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        
        // Clear wrapper and add iframe
        videoWrapper.innerHTML = '';
        videoWrapper.appendChild(iframe);
    }
    
    function closeImageModal() {
        if (!imageModal) return;
        
        imageModal.classList.remove('show');
        
        // Wait for transition
        setTimeout(() => {
            imageModal.style.display = 'none';
            imageModal.style.visibility = 'hidden';
            modalImage.src = '';
            
            // Restore page state
            restorePageState();
        }, 250);
    }
    
    function closeVideoModal() {
        if (!videoModal) return;
        
        videoModal.classList.remove('show');
        
        // Wait for transition
        setTimeout(() => {
            videoModal.style.display = 'none';
            videoModal.style.visibility = 'hidden';
            
            // Clear video wrapper
            if (videoWrapper) {
                videoWrapper.innerHTML = '';
            }
            
            // Restore page state
            restorePageState();
        }, 250);
    }
    
    function savePageState() {
        // Save scroll position
        lastScrollPosition = window.scrollY;
        
        // Save header state
        if (header) {
            headerClass = header.className;
            header.style.visibility = 'hidden';
        }
    }
    
    function lockBodyScroll() {
        body.classList.add('modal-open');
        body.style.top = `-${lastScrollPosition}px`;
    }
    
    function restorePageState() {
        // Restore header
        if (header) {
            setTimeout(() => {
                header.className = headerClass;
                header.style.visibility = '';
            }, 50);
        }
        
        // Restore scroll
        body.classList.remove('modal-open');
        body.style.top = '';
        window.scrollTo(0, lastScrollPosition);
    }
    
    function navigateGallery(direction) {
        if (currentGalleryItems.length <= 1) return;
        
        // Calculate new index
        let newIndex;
        if (direction === 'next') {
            newIndex = Math.min(currentIndex + 1, currentGalleryItems.length - 1);
        } else {
            newIndex = Math.max(currentIndex - 1, 0);
        }
        
        // If index hasn't changed, do nothing
        if (newIndex === currentIndex) return;
        
        currentIndex = newIndex;
        
        // Get new item
        const newItem = currentGalleryItems[currentIndex];
        
        // Add transition class
        modalImage.classList.add('transitioning');
        
        // Get new image data
        const img = newItem.querySelector('img');
        const highresUrl = img.getAttribute('data-highres') || img.src;
        const title = newItem.querySelector('.gallery-info h3')?.textContent || '';
        const desc = newItem.querySelector('.gallery-info p')?.textContent || '';
        
        // Update after short delay
        setTimeout(() => {
            modalImage.src = highresUrl;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            
            // When image loads, update size and state
            modalImage.onload = function() {
                optimizeImageSize();
                modalImage.classList.remove('transitioning');
                updateNavigationButtons();
                preloadAdjacentImages();
            };
        }, 200);
    }
    
    function preloadAdjacentImages() {
        if (currentGalleryItems.length <= 1) return;
        
        // Only preload immediately adjacent images
        const indicesToPreload = [];
        
        if (currentIndex > 0) {
            indicesToPreload.push(currentIndex - 1);
        }
        
        if (currentIndex < currentGalleryItems.length - 1) {
            indicesToPreload.push(currentIndex + 1);
        }
        
        // Preload these images
        indicesToPreload.forEach(index => {
            const item = currentGalleryItems[index];
            const img = item.querySelector('img');
            if (img) {
                const highresUrl = img.getAttribute('data-highres') || img.src;
                const preloader = new Image();
                preloader.src = highresUrl;
            }
        });
    }
    
    // Utility: Debounce function for resize events
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});