/**
 * Video Gallery Handler for Casa Del Sol AZ
 * https://github.com/cs121287/CasaDelSolAZ
 */
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const videoModal = document.getElementById('video-modal');
    const videoContent = videoModal?.querySelector('.video-modal-content');
    const videoIframe = document.getElementById('video-iframe');
    const videoWrapper = videoModal?.querySelector('.video-wrapper');
    const videoTitle = document.getElementById('video-modal-title');
    const videoDesc = document.getElementById('video-modal-description');
    const closeButton = videoModal?.querySelector('.close-modal');
    
    // Set up video items
    const videoItems = document.querySelectorAll('.video-item');
    
    // YouTube ID mappings - using data attributes directly in HTML
    
    // Handle click on video items
    function setupVideoClicks() {
        document.addEventListener('click', function(e) {
            const videoItem = e.target.closest('.video-item');
            if (!videoItem) return;
            
            e.preventDefault();
            openVideoModal(videoItem);
        });
    }
    
    // Open video modal centered in viewport
    function openVideoModal(videoItem) {
        if (!videoModal || !videoIframe || !videoWrapper) return;
        
        // Get video ID and info
        const videoId = videoItem.getAttribute('data-video-id');
        const title = videoItem.querySelector('.video-info h3')?.textContent || '';
        const description = videoItem.querySelector('.video-info p')?.textContent || '';
        
        // Show loading state
        videoWrapper.classList.add('loading');
        
        // Always position in viewport center (not page relative)
        if (videoContent) {
            videoContent.style.top = '50%';
            videoContent.style.left = '50%';
            videoContent.style.transform = 'translate(-50%, -50%)';
        }
        
        // Set video source for YouTube Shorts
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
        
        // Set caption
        if (videoTitle) videoTitle.textContent = title;
        if (videoDesc) videoDesc.textContent = description;
        
        // Set up load handler for iframe
        videoIframe.onload = function() {
            videoWrapper.classList.remove('loading');
            videoIframe.classList.add('loaded');
        };
        
        // Set iframe source to load video
        videoIframe.classList.remove('loaded');
        videoIframe.src = embedUrl;
        
        // Show modal
        videoModal.style.display = 'block';
        document.body.classList.add('modal-open');
        
        // Trigger animation
        requestAnimationFrame(() => {
            videoModal.classList.add('show');
        });
    }
    
    // Close video modal
    function closeVideoModal() {
        if (!videoModal || !videoIframe) return;
        
        videoModal.classList.remove('show');
        
        // Wait for transition
        setTimeout(() => {
            videoModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            
            // Clear iframe source to stop playback
            videoIframe.src = '';
            videoIframe.classList.remove('loaded');
        }, 200);
    }
    
    // Set up close button and escape key handling
    function setupCloseHandlers() {
        if (closeButton) {
            closeButton.addEventListener('click', closeVideoModal);
        }
        
        // Close on background click
        videoModal?.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal?.classList.contains('show')) {
                closeVideoModal();
            }
        });
    }
    
    // Initialize
    function init() {
        setupVideoClicks();
        setupCloseHandlers();
    }
    
    // Start if elements exist
    if (videoModal && videoItems.length > 0) {
        init();
    }
});